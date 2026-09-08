import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Domain } from '../models/domain';

export type DomainPayload = Pick<Domain, 'code' | 'description'> & { relatedDomainIds: number[]; status?: boolean };

@Injectable({ providedIn: 'root' })
export class DomainService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080';
  list(status?: boolean): Observable<Domain[]> { return this.http.get<Domain[]>(`${this.apiUrl}/domain${status === undefined ? '' : `?status=${status}`}`); }
  find(id: number): Observable<Domain> { return this.http.get<Domain>(`${this.apiUrl}/domain/${id}`); }
  create(domain: DomainPayload): Observable<Domain> { return this.http.post<Domain>(`${this.apiUrl}/domain`, domain); }
  update(id: number, domain: DomainPayload): Observable<Domain> { return this.http.put<Domain>(`${this.apiUrl}/domain/${id}`, domain); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/domain/${id}`); }
}
