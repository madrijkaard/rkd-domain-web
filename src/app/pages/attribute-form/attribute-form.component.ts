import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AttributeService } from '../../services/attribute.service';
import { DomainService } from '../../services/domain.service';
import { OptionService } from '../../services/option.service';
import { ATTRIBUTE_TYPES, Attribute, AttributeType, Domain, Option } from '../../models/domain';

@Component({ selector: 'app-attribute-form', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], templateUrl: './attribute-form.component.html' })
export class AttributeFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly domains = inject(DomainService);
  private readonly service = inject(AttributeService);
  private readonly optionService = inject(OptionService);
  readonly types = ATTRIBUTE_TYPES;
  readonly form = this.fb.nonNullable.group({ code: ['', Validators.required], description: ['', Validators.required], type: ['TEXT' as AttributeType, Validators.required], mandatory: [false] });
  domainId!: number;
  attributeId?: number;
  domain?: Domain;
  editing = false;
  loading = true;
  saving = false;
  deletingOption = false;
  error = '';

  get selectedType(): AttributeType { return this.form.controls.type.value; }
  get canManageOption(): boolean { return this.editing && this.selectedType === 'OPTION' && !!this.attributeId; }
  get currentOption(): Option | undefined { return this.domain?.attributes?.find((item) => item.id === this.attributeId)?.option; }
  formatOptionJson(option: Option): string { return JSON.stringify(option, null, 2); }

  ngOnInit(): void {
    this.domainId = Number(this.route.snapshot.paramMap.get('domainId'));
    const attributeId = this.route.snapshot.paramMap.get('attributeId');
    this.attributeId = attributeId ? Number(attributeId) : undefined;
    this.editing = this.attributeId !== undefined;
    this.domains.find(this.domainId).subscribe({ next: (domain) => { this.domain = domain; const attribute = domain.attributes?.find((item) => item.id === this.attributeId); if (this.editing && !attribute) { this.error = 'Attribute not found.'; } else if (attribute) { this.patch(attribute); } this.loading = false; }, error: () => { this.error = 'Unable to load the domain.'; this.loading = false; } });
  }

  private patch(attribute: Attribute): void { this.form.patchValue({ code: attribute.code, description: attribute.description, type: attribute.type, mandatory: attribute.mandatory }); }
  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const value = this.form.getRawValue();
    const payload = { ...value, domainId: this.domainId, status: true };
    const request = this.editing ? this.service.update(this.attributeId!, payload) : this.service.create(payload);
    request.subscribe({ next: (attribute) => { this.saving = false; if (!this.editing) { this.attributeId = attribute.id; this.editing = true; this.router.navigate(['/domains', this.domainId, 'attributes', attribute.id, 'edit']); } else { this.router.navigate(['/domains', this.domainId, 'edit']); } }, error: () => { this.error = 'Unable to save the attribute.'; this.saving = false; } });
  }

  addOption(): void { if (this.canManageOption && !this.currentOption) this.router.navigate(['/domains', this.domainId, 'attributes', this.attributeId, 'option', 'new']); }
  editOption(): void { if (this.currentOption?.id) this.router.navigate(['/domains', this.domainId, 'attributes', this.attributeId, 'option', this.currentOption.id, 'edit']); }
  removeOption(): void {
    if (!this.currentOption?.id || !window.confirm(`Delete option "${this.currentOption.code}"?`)) return;
    this.deletingOption = true;
    this.error = '';
    this.optionService.remove(this.currentOption.id).subscribe({
      next: () => {
        if (this.domain) {
          const attribute = this.domain.attributes?.find((item) => item.id === this.attributeId);
          if (attribute) attribute.option = undefined;
        }
        this.deletingOption = false;
      },
      error: (error) => { this.error = this.apiMessage(error, 'Unable to delete the option.'); this.deletingOption = false; },
    });
  }

  private apiMessage(error: unknown, fallback: string): string {
    const response = error as { error?: { message?: string } | string };
    return typeof response?.error === 'string' ? response.error : response?.error?.message ?? fallback;
  }
}
