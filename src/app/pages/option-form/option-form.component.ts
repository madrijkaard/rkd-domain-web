import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OptionService } from '../../services/option.service';
import { Option } from '../../models/domain';

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

  private valueGroup(value = '') { return this.fb.nonNullable.group({ value: [value, Validators.required] }); }

  private patch(option: Option): void {
    this.form.patchValue({ code: option.code, description: option.description });
    this.optionValues.clear();
    const values = option.values?.options ?? [];
    for (const item of values) this.optionValues.push(this.valueGroup(this.formatItem(item)));
    if (this.optionValues.length < 2) this.addValue();
  }

  addValue(): void { this.optionValues.push(this.valueGroup()); }
  removeValue(index: number): void { if (this.optionValues.length > 2) this.optionValues.removeAt(index); }

  save(): void {
    if (this.form.invalid || this.optionValues.length < 2) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.error = '';
    const raw = this.form.getRawValue();
    const payload = { code: raw.code, description: raw.description, values: { options: raw.values.map(({ value }) => this.parseItem(value)) }, attributeId: this.attributeId, status: true };
    const request = this.editing ? this.service.update(this.optionId!, payload) : this.service.create(payload);
    request.subscribe({
      next: () => this.router.navigate(['/domains', this.domainId, 'attributes', this.attributeId, 'edit']),
      error: () => { this.error = 'Unable to save the option.'; this.saving = false; },
    });
  }

  private formatItem(item: unknown): string { return typeof item === 'string' ? item : JSON.stringify(item, null, 2); }

  private parseItem(value: string): unknown {
    try { return JSON.parse(value); } catch { return value; }
  }

}
