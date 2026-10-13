import { Routes } from '@angular/router';
import { DomainListComponent } from './pages/domain-list/domain-list.component';
import { DomainFormComponent } from './pages/domain-form/domain-form.component';
import { AttributeFormComponent } from './pages/attribute-form/attribute-form.component';
import { AttributeListComponent } from './pages/attribute-form/attribute-list.component';
import { OptionFormComponent } from './pages/option-form/option-form.component';
import { DomainRelationshipsComponent } from './pages/domain-relationships/domain-relationships.component';
import { ProjectListComponent } from './pages/domain-list/project-list.component';
import { ProjectFormComponent } from './pages/domain-form/project-form.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects' },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: ProjectFormComponent },
  { path: 'projects/:id/edit', component: ProjectFormComponent },
  { path: 'projects/:projectId/domains', component: DomainListComponent },
  { path: 'projects/:projectId/domains/new', component: DomainFormComponent },
  { path: 'projects/:projectId/domains/:id/edit', component: DomainFormComponent },
  { path: 'domains', component: DomainListComponent },
  { path: 'domains/relationships', component: DomainRelationshipsComponent },
  { path: 'domains/new', component: DomainFormComponent },
  { path: 'domains/:id/edit', component: DomainFormComponent },
  { path: 'domains/:domainId/attributes', component: AttributeListComponent },
  { path: 'domains/:domainId/attributes/new', component: AttributeFormComponent },
  { path: 'domains/:domainId/attributes/:attributeId/edit', component: AttributeFormComponent },
  { path: 'domains/:domainId/attributes/:attributeId/option/new', component: OptionFormComponent },
  { path: 'domains/:domainId/attributes/:attributeId/option/:optionId/edit', component: OptionFormComponent },
  { path: '**', redirectTo: 'domains' }
];
