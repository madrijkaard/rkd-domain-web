import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attribute } from '../models/domain';

type AttributePayload = Omit<Attribute, 'id' | 'option'>;

@Injectable({ providedIn: 'root' })
export class AttributeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080';
  create(attribute: AttributePayload): Observable<Attribute> { return this.http.post<Attribute>(`${this.apiUrl}/attribute`, attribute); }
  update(id: number, attribute: AttributePayload): Observable<Attribute> { return this.http.put<Attribute>(`${this.apiUrl}/attribute/${id}`, attribute); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/attribute/${id}`); }
}
