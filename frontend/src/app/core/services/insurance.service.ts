
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InsuranceI } from '../../shared/models/insurance.model';
@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private apiUrl = '/api/insurances';

  constructor(private http: HttpClient) { }

  getInsurances(): Observable<InsuranceI[]> {
    return this.http.get<InsuranceI[]>(this.apiUrl);
  }

  getInsuranceById(id: number): Observable<InsuranceI> {
    return this.http.get<InsuranceI>(`${this.apiUrl}/${id}`);
  }

  createInsurance(insurance: Partial<InsuranceI>): Observable<InsuranceI> {
    return this.http.post<InsuranceI>(this.apiUrl, insurance);
  }

  updateInsurance(id: number, insurance: Partial<InsuranceI>): Observable<InsuranceI> {
    return this.http.put<InsuranceI>(`${this.apiUrl}/${id}`, insurance);
  }

  deleteInsurance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
