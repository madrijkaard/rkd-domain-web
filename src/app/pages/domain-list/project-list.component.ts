import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project';

@Component({ selector: 'app-project-list', standalone: true, imports: [RouterLink], templateUrl: './project-list.component.html' })
export class ProjectListComponent implements OnInit {
  private readonly service = inject(ProjectService); projects: Project[] = []; loading = true; error = ''; deletingId?: number;
  ngOnInit(): void { this.service.list().subscribe({ next: (projects) => { this.projects = projects; this.loading = false; }, error: () => { this.error = 'Unable to load projects.'; this.loading = false; } }); }
  remove(project: Project): void { if (!project.id || !window.confirm(`Delete project "${project.code}"?`)) return; this.deletingId = project.id; this.service.remove(project.id).subscribe({ next: () => { this.projects = this.projects.filter((item) => item.id !== project.id); this.deletingId = undefined; }, error: (error) => { this.error = error?.error?.message ?? 'Unable to delete the project.'; this.deletingId = undefined; } }); }
}
