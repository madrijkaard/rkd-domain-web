import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { AttributeService } from '../../services/attribute.service';
import { Attribute, Domain, DomainSummary } from '../../models/domain';

@Component({ selector: 'app-domain-form', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], templateUrl: './domain-form.component.html' })
export class DomainFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(DomainService);
  private readonly attributeService = inject(AttributeService);
  readonly form = this.fb.nonNullable.group({ code: ['', Validators.required], description: ['', Validators.required] });
  domain?: Domain;
  allDomains: DomainSummary[] = [];
  relatedDomains: DomainSummary[] = [];
  showRelatedDomains = false;
  domainId?: number;
  saving = false;
  deletingAttributeId?: number;
  loading = false;
  error = '';

  get editing(): boolean { return this.domainId !== undefined; }
  get attributes(): Attribute[] { return this.domain?.attributes ?? []; }
  get availableDomains(): DomainSummary[] {
    const selected = new Set(this.relatedDomains.map((domain) => domain.id));
    return this.allDomains.filter((domain) => domain.id !== this.domainId && !selected.has(domain.id));
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadDomains();
    if (id) { this.domainId = Number(id); this.loadDomain(); }
  }

  private loadDomains(): void {
    this.service.list().subscribe({ next: (domains) => { this.allDomains = domains.map(({ id, code, description, status }) => ({ id: id!, code, description, status })); }, error: () => { this.error = 'Unable to load related domains.'; } });
  }

  loadDomain(): void {
    this.loading = true;
    this.service.find(this.domainId!).subscribe({ next: (domain) => { this.domain = domain; this.relatedDomains = domain.relatedDomains ?? []; this.form.patchValue({ code: domain.code, description: domain.description }); this.loading = false; }, error: () => { this.error = 'Unable to load this domain.'; this.loading = false; } });
  }

  relate(domain: DomainSummary): void { if (!this.relatedDomains.some((item) => item.id === domain.id)) this.relatedDomains = [...this.relatedDomains, domain]; }
  unrelate(domain: DomainSummary): void { this.relatedDomains = this.relatedDomains.filter((item) => item.id !== domain.id); }
  toggleRelatedDomains(): void { this.showRelatedDomains = !this.showRelatedDomains; }

  removeAttribute(attribute: Attribute): void {
    if (!attribute.id || !window.confirm(`Delete attribute "${attribute.code}"?`)) return;
    this.deletingAttributeId = attribute.id;
    this.error = '';
    this.attributeService.remove(attribute.id).subscribe({
      next: () => { if (this.domain) this.domain.attributes = this.domain.attributes?.filter((item) => item.id !== attribute.id); this.deletingAttributeId = undefined; },
      error: (error) => { this.error = this.apiMessage(error, 'Unable to delete the attribute.'); this.deletingAttributeId = undefined; },
    });
  }

  private apiMessage(error: unknown, fallback: string): string {
    const response = error as { error?: { message?: string } | string };
    return typeof response?.error === 'string' ? response.error : response?.error?.message ?? fallback;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.error = '';
    const values = this.form.getRawValue();
    const payload = { ...values, relatedDomainIds: this.relatedDomains.map((domain) => domain.id), status: this.domain?.status ?? true };
    const request = this.editing ? this.service.update(this.domainId!, payload) : this.service.create(payload);
    request.subscribe({ next: (domain) => { this.domain = domain; this.domainId = domain.id; this.relatedDomains = domain.relatedDomains ?? this.relatedDomains; this.saving = false; if (!this.editing) { this.router.navigate(['/domains', domain.id, 'edit']); } }, error: () => { this.error = 'Unable to save the domain.'; this.saving = false; } });
  }
}
