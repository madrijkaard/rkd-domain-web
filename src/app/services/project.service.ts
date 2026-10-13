import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project';

export type ProjectPayload = Pick<Project, 'code' | 'description'> & { status?: boolean };

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080';
  list(status?: boolean): Observable<Project[]> { return this.http.get<Project[]>(`${this.apiUrl}/project${status === undefined ? '' : `?status=${status}`}`); }
  find(id: number): Observable<Project> { return this.http.get<Project>(`${this.apiUrl}/project/${id}`); }
  create(project: ProjectPayload): Observable<Project> { return this.http.post<Project>(`${this.apiUrl}/project`, project); }
  update(id: number, project: ProjectPayload): Observable<Project> { return this.http.put<Project>(`${this.apiUrl}/project/${id}`, project); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/project/${id}`); }
}
