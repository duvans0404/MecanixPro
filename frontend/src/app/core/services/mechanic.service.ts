
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MechanicI } from '../../shared/models/mechanic.model';
@Injectable({
  providedIn: 'root'
})
export class MechanicService {
  private apiUrl = '/api/mechanics';

  constructor(private http: HttpClient) { }

  getMechanics(): Observable<MechanicI[]> {
    return this.http.get<MechanicI[]>(this.apiUrl);
  }

  getMechanicById(id: number): Observable<MechanicI> {
    return this.http.get<MechanicI>(`${this.apiUrl}/${id}`);
  }

  createMechanic(mechanic: Partial<MechanicI>): Observable<MechanicI> {
    return this.http.post<MechanicI>(this.apiUrl, mechanic);
  }

  updateMechanic(id: number, mechanic: Partial<MechanicI>): Observable<MechanicI> {
    return this.http.put<MechanicI>(`${this.apiUrl}/${id}`, mechanic);
  }

  deleteMechanic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
