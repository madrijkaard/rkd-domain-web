import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OptionService } from '../../services/option.service';
import { AttributeService } from '../../services/attribute.service';
import { DomainService } from '../../services/domain.service';
import { Option, OptionValue } from '../../models/domain';

@Component({
  selector: 'app-option-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './option-form.component.html',
})
export class OptionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(OptionService);
  private readonly attributes = inject(AttributeService);
  private readonly domains = inject(DomainService);

  readonly form = this.fb.nonNullable.group({
    code: ['', Validators.required],
    description: ['', Validators.required],
    values: this.fb.array([this.valueGroup(), this.valueGroup()]),
  });
  domainId!: number;
  attributeId!: number;
  optionId?: number;
  editing = false;
  loading = true;
  saving = false;
  error = '';

  get optionValues(): FormArray { return this.form.controls.values; }

  ngOnInit(): void {
    this.domainId = Number(this.route.snapshot.paramMap.get('domainId'));
    this.attributeId = Number(this.route.snapshot.paramMap.get('attributeId'));
    const optionId = this.route.snapshot.paramMap.get('optionId');
    this.optionId = optionId ? Number(optionId) : undefined;
    this.editing = this.optionId !== undefined;
    if (!this.editing) { this.loading = false; return; }
    this.service.find(this.optionId!).subscribe({
      next: (option) => { this.patch(option); this.loading = false; },
      error: () => { this.error = 'Unable to load the option.'; this.loading = false; },
    });
  }

  private valueGroup(value = '', label = '') { return this.fb.nonNullable.group({ value: [value, Validators.required], label: [label, Validators.required] }); }

  private patch(option: Option): void {
    this.form.patchValue({ code: option.code, description: option.description });
    this.optionValues.clear();
    const values = option.values?.options ?? [];
    for (const item of values) this.optionValues.push(this.valueGroup(item.value, item.label));
    if (this.optionValues.length < 2) this.addValue();
  }

  addValue(): void { this.optionValues.push(this.valueGroup()); }
  removeValue(index: number): void { if (this.optionValues.length > 2) this.optionValues.removeAt(index); }

  save(): void {
    if (this.form.invalid || this.optionValues.length < 2) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.error = '';
    const raw = this.form.getRawValue();
    const payload = { code: raw.code, description: raw.description, values: { options: raw.values as OptionValue[] }, status: true };
    const request = this.editing ? this.service.update(this.optionId!, payload) : this.service.create(payload);
    request.subscribe({
      next: (option) => this.saveOptionRelation(option),
      error: () => { this.error = 'Unable to save the option.'; this.saving = false; },
    });
  }

  private saveOptionRelation(option: Option): void {
    if (this.editing) { this.router.navigate(['/domains', this.domainId, 'attributes', this.attributeId, 'edit']); return; }
    this.domains.find(this.domainId).subscribe({
      next: (domain) => {
        const attribute = domain.attributes?.find((item) => item.id === this.attributeId);
        if (!attribute) { this.error = 'Unable to link the option to the attribute.'; this.saving = false; return; }
        this.attributes.update(this.attributeId, { code: attribute.code, description: attribute.description, type: attribute.type, mandatory: attribute.mandatory, domainId: this.domainId, status: attribute.status ?? true, optionId: option.id }).subscribe({
          next: () => this.router.navigate(['/domains', this.domainId, 'attributes', this.attributeId, 'edit']),
          error: () => { this.error = 'The option was created but could not be linked to the attribute.'; this.saving = false; },
        });
      },
      error: () => { this.error = 'The option was created but the attribute could not be loaded.'; this.saving = false; },
    });
  }
}
