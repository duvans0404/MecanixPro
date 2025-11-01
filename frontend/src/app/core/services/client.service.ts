
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientI } from '../../shared/models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = '/api/clients';

  constructor(private http: HttpClient) { }

  getClients(): Observable<ClientI[]> {
    return this.http.get<ClientI[]>(this.apiUrl);
  }

  getClient(id: string | number): Observable<ClientI> {
    return this.http.get<ClientI>(`${this.apiUrl}/${id}`);
  }

  addClient(client: Partial<ClientI>): Observable<ClientI> {
    return this.http.post<ClientI>(this.apiUrl, client);
  }

  updateClient(id: string | number, client: Partial<ClientI>): Observable<ClientI> {
    return this.http.put<ClientI>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Alias para compatibilidad con componentes modernos
  create(client: Omit<ClientI, 'id'>): Observable<ClientI> {
    return this.addClient(client as Partial<ClientI>);
  }

  update(id: string | number, client: Partial<ClientI>): Observable<ClientI> {
    return this.updateClient(id, client);
  }
}
