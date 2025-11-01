
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  roles?: string[];
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateRoleRequest {
  role: string;
}

export interface UsersResponse {
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/auth/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<UsersResponse>(this.apiUrl).pipe(
      map((response: UsersResponse) => response.users || [])
    );
  }

  updateUserRole(userId: number, role: string): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/${userId}/role`, { role });
  }
}

