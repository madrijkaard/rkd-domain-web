import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { Domain } from '../../models/domain';

@Component({ selector: 'app-domain-list', standalone: true, imports: [RouterLink], templateUrl: './domain-list.component.html' })
export class DomainListComponent implements OnInit {
  private readonly service = inject(DomainService);
  domains: Domain[] = [];
  loading = true;
  deletingId?: number;
  error = '';
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.service.list().subscribe({ next: (domains) => { this.domains = domains; this.loading = false; }, error: () => { this.error = 'Unable to load domains. Check whether the API is running.'; this.loading = false; } }); }
  remove(domain: Domain): void {
    if (!domain.id || !window.confirm(`Delete domain "${domain.code}"?`)) return;
    this.deletingId = domain.id;
    this.error = '';
    this.service.remove(domain.id).subscribe({
      next: () => { this.domains = this.domains.filter((item) => item.id !== domain.id); this.deletingId = undefined; },
      error: (error) => { this.error = this.apiMessage(error, 'Unable to delete the domain.'); this.deletingId = undefined; },
    });
  }

  private apiMessage(error: unknown, fallback: string): string {
    const response = error as { error?: { message?: string } | string };
    return typeof response?.error === 'string' ? response.error : response?.error?.message ?? fallback;
  }
}
