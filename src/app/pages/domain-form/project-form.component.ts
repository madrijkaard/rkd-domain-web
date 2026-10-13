import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';

@Component({ selector: 'app-project-form', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], templateUrl: './project-form.component.html' })
export class ProjectFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router); private readonly service = inject(ProjectService);
  readonly form = this.fb.nonNullable.group({ code: ['', Validators.required], description: ['', Validators.required] }); projectId?: number; loading = false; saving = false; error = '';
  get editing(): boolean { return this.projectId !== undefined; }
  ngOnInit(): void { const id = this.route.snapshot.paramMap.get('id'); if (id) { this.projectId = Number(id); this.loading = true; this.service.find(this.projectId).subscribe({ next: (project) => { this.form.patchValue({ code: project.code, description: project.description }); this.loading = false; }, error: () => { this.error = 'Unable to load this project.'; this.loading = false; } }); } }
  save(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.saving = true; const request = this.editing ? this.service.update(this.projectId!, this.form.getRawValue()) : this.service.create(this.form.getRawValue()); request.subscribe({ next: (project) => this.router.navigate(['/projects', project.id, 'domains']), error: (error) => { this.error = error?.error?.message ?? 'Unable to save the project.'; this.saving = false; } }); }
}
