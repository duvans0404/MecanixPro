
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PartI } from '../models/part.model';


@Injectable({
  providedIn: 'root'
})
export class PartService {
  private apiUrl = '/api/parts';

  constructor(private http: HttpClient) { }

  getParts(): Observable<PartI[]> {
    return this.http.get<PartI[]>(this.apiUrl);
  }

  getPartById(id: number): Observable<PartI> {
    return this.http.get<PartI>(`${this.apiUrl}/${id}`);
  }

  createPart(part: Partial<PartI>): Observable<PartI> {
    return this.http.post<PartI>(this.apiUrl, part);
  }

  updatePart(id: number, part: Partial<PartI>): Observable<PartI> {
    return this.http.put<PartI>(`${this.apiUrl}/${id}`, part);
  }

  deletePart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
