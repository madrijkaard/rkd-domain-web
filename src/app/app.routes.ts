import { Routes } from '@angular/router';
import { DomainListComponent } from './pages/domain-list/domain-list.component';
import { DomainFormComponent } from './pages/domain-form/domain-form.component';
import { AttributeFormComponent } from './pages/attribute-form/attribute-form.component';
import { OptionFormComponent } from './pages/option-form/option-form.component';
import { DomainRelationshipsComponent } from './pages/domain-relationships/domain-relationships.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'domains' },
  { path: 'domains', component: DomainListComponent },
  { path: 'domains/relationships', component: DomainRelationshipsComponent },
  { path: 'domains/new', component: DomainFormComponent },
  { path: 'domains/:id/edit', component: DomainFormComponent },
  { path: 'domains/:domainId/attributes/new', component: AttributeFormComponent },
  { path: 'domains/:domainId/attributes/:attributeId/edit', component: AttributeFormComponent },
  { path: 'domains/:domainId/attributes/:attributeId/option/new', component: OptionFormComponent },
  { path: 'domains/:domainId/attributes/:attributeId/option/:optionId/edit', component: OptionFormComponent },
  { path: '**', redirectTo: 'domains' }
];
