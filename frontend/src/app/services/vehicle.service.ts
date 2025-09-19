

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleI } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = '/api/vehicles';

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<VehicleI[]> {
    return this.http.get<VehicleI[]>(this.apiUrl);
  }

  getVehicleById(id: number): Observable<VehicleI> {
    return this.http.get<VehicleI>(`${this.apiUrl}/${id}`);
  }

  createVehicle(vehicle: Partial<VehicleI>): Observable<VehicleI> {
    return this.http.post<VehicleI>(this.apiUrl, vehicle);
  }

  updateVehicle(id: number, vehicle: Partial<VehicleI>): Observable<VehicleI> {
    return this.http.put<VehicleI>(`${this.apiUrl}/${id}`, vehicle);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
