import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { Attribute, Domain } from '../../models/domain';
import { AttributeService } from '../../services/attribute.service';
import { OptionService } from '../../services/option.service';

@Component({ selector: 'app-attribute-list', standalone: true, imports: [RouterLink], templateUrl: './attribute-list.component.html' })
export class AttributeListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute); private readonly domains = inject(DomainService); private readonly attributes = inject(AttributeService); private readonly options = inject(OptionService);
  domain?: Domain; loading = true; error = ''; deletingId?: number;
  ngOnInit(): void { this.load(Number(this.route.snapshot.paramMap.get('domainId'))); }
  load(domainId: number): void { this.domains.find(domainId).subscribe({ next: (domain) => { this.domain = domain; this.loading = false; }, error: () => { this.error = 'Unable to load the attributes.'; this.loading = false; } }); }
  remove(attribute: Attribute): void { if (!attribute.id || !window.confirm(`Delete attribute "${attribute.code}"?`)) return; this.deletingId = attribute.id; const removeAttribute = () => this.attributes.remove(attribute.id!).subscribe({ next: () => { if (this.domain) this.domain.attributes = this.domain.attributes?.filter((item) => item.id !== attribute.id); this.deletingId = undefined; }, error: (error) => { this.error = error?.error?.message ?? 'Unable to delete the attribute.'; this.deletingId = undefined; } }); if (attribute.type === 'OPTION' && attribute.option?.id) this.options.remove(attribute.option.id).subscribe({ next: removeAttribute, error: () => { this.error = 'Unable to delete the option before removing the attribute.'; this.deletingId = undefined; } }); else removeAttribute(); }
}
