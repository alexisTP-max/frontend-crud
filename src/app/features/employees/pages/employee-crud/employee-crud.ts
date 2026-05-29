import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { EmployeeApiService } from '../../../../core/services/employee-api';
import { Department } from '../../../../shared/models/department.model';
import { Employee } from '../../../../shared/models/employee.model';
import { AreaFormComponent } from '../../../areas/components/area-form/area-form';
import { DepartmentFormComponent } from '../../../departments/components/department-form/department-form';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form';
import { EmployeeTableComponent } from '../../components/employee-table/employee-table';

@Component({
  selector: 'app-employee-crud',
  standalone: true,
  imports: [
    CommonModule,
    DepartmentFormComponent,
    AreaFormComponent,
    EmployeeFormComponent,
    EmployeeTableComponent,
  ],
  templateUrl: './employee-crud.html',
  styleUrl: './employee-crud.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EmployeeCrudComponent implements OnInit {
  private readonly employeeApiService = inject(EmployeeApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  departments: Department[] = [];
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;

  isLoadingEmployees = false;
  isLoadingDepartments = false;
  firstLoadDone = false;

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoadingDepartments = true;

    this.employeeApiService.getDepartments()
      .pipe(finalize(() => {
        this.isLoadingDepartments = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (departments) => {
          this.departments = [...departments];
        },
        error: (error) => {
          console.error('Error loading departments', error);
          this.departments = [];
        },
      });
  }

  loadEmployees(): void {
    this.isLoadingEmployees = true;

    this.employeeApiService.getEmployees()
      .pipe(finalize(() => {
        this.isLoadingEmployees = false;
        this.firstLoadDone = true;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (employees) => {
          this.employees = [...employees];
        },
        error: (error) => {
          console.error('Error loading employees', error);
          this.employees = [];
        },
      });
  }

  onDepartmentSaved(): void {
    this.loadDepartments();
  }

  onAreaSaved(): void {
    this.loadDepartments();
  }

  onEmployeeSaved(): void {
    this.selectedEmployee = null;
    this.loadEmployees();
  }

  onEditEmployee(employee: Employee): void {
    this.selectedEmployee = { ...employee };
  }

  onDeleteEmployee(employeeId: number): void {
    this.employeeApiService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.employees = this.employees.filter((employee) => employee.id !== employeeId);

        if (this.selectedEmployee?.id === employeeId) {
          this.selectedEmployee = null;
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting employee', error);
      },
    });
  }

  onFormCleared(): void {
    this.selectedEmployee = null;
  }
}