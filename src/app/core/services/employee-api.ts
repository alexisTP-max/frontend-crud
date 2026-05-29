import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Area } from '../../shared/models/area.model';
import { Department } from '../../shared/models/department.model';
import { Employee } from '../../shared/models/employee.model';

export interface EmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  departmentId: number;
  areaId: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  createDepartment(payload: { name: string }): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/departments`, payload);
  }

  getAreas(departmentId?: number): Observable<Area[]> {
    const url = departmentId
      ? `${this.apiUrl}/areas?departmentId=${departmentId}`
      : `${this.apiUrl}/areas`;

    return this.http.get<Area[]>(url);
  }

  createArea(payload: { name: string; departmentId: number }): Observable<Area> {
    return this.http.post<Area>(`${this.apiUrl}/areas`, payload);
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  createEmployee(payload: EmployeePayload): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees`, payload);
  }

  updateEmployee(id: number, payload: Partial<EmployeePayload>): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/employees/${id}`, payload);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employees/${id}`);
  }
}