import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Option } from '../models/domain';

export type OptionPayload = Pick<Option, 'code' | 'description' | 'values'> & { status?: boolean };

@Injectable({ providedIn: 'root' })
export class OptionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080';

  find(id: number): Observable<Option> { return this.http.get<Option>(`${this.apiUrl}/option/${id}`); }
  create(option: OptionPayload): Observable<Option> { return this.http.post<Option>(`${this.apiUrl}/option`, option); }
  update(id: number, option: OptionPayload): Observable<Option> { return this.http.put<Option>(`${this.apiUrl}/option/${id}`, option); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/option/${id}`); }
}
