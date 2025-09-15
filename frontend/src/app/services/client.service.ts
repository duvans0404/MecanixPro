import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClientI } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  
  private clients: ClientI[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      address: 'Calle 123 #45-67, Bogotá',
      phone: '300-123-4567',
      email: 'juan.perez@email.com',
      password: 'password123',
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'María González',
      address: 'Carrera 78 #90-12, Medellín',
      phone: '310-987-6543',
      email: 'maria.gonzalez@email.com',
      password: 'password123',
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      address: 'Avenida 56 #34-89, Cali',
      phone: '315-555-1234',
      email: 'carlos.rodriguez@email.com',
      password: 'password123',
      status: 'ACTIVE',
      active: true,
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05')
    }
  ];

  constructor() { }

  getClients(): Observable<ClientI[]> {
    return of(this.clients);
  }

  getClient(id: string): Observable<ClientI | undefined> {
    const client = this.clients.find(c => c.id.toString() === id);
    return of(client);
  }

  getClientById(id: number): Observable<ClientI | undefined> {
    const client = this.clients.find(c => c.id === id);
    return of(client);
  }

  addClient(client: any): Observable<ClientI> {
    const newClient: ClientI = {
      ...client,
      id: this.clients.length + 1,
      status: client.active ? 'ACTIVE' : 'INACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clients.push(newClient);
    return of(newClient);
  }

  createClient(client: ClientI): Observable<ClientI> {
    const newClient: ClientI = {
      ...client,
      id: this.clients.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clients.push(newClient);
    return of(newClient);
  }

  updateClient(id: string, client: any): Observable<ClientI> {
    const clientId = parseInt(id);
    const index = this.clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      this.clients[index] = {
        ...this.clients[index],
        ...client,
        id: clientId,
        status: client.active ? 'ACTIVE' : 'INACTIVE',
        updatedAt: new Date()
      };
      return of(this.clients[index]);
    }
    throw new Error('Client not found');
  }

  deleteClient(id: string): Observable<void> {
    const clientId = parseInt(id);
    const index = this.clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      this.clients.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Client not found');
  }
}
