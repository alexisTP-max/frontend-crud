import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeApiService } from '../../../../core/services/employee-api';
import { Area } from '../../../../shared/models/area.model';
import { Department } from '../../../../shared/models/department.model';
import { Employee } from '../../../../shared/models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly employeeApiService = inject(EmployeeApiService);

  @Input() departments: Department[] = [];
  @Input() selectedEmployee: Employee | null = null;

  @Output() employeeSaved = new EventEmitter<void>();
  @Output() formCleared = new EventEmitter<void>();

  areas: Area[] = [];
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  employeeForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    hireDate: ['', [Validators.required]],
    departmentId: [0, [Validators.required, Validators.min(1)]],
    areaId: [0, [Validators.required, Validators.min(1)]],
  });

  get f() {
    return this.employeeForm.controls;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedEmployee'] && this.selectedEmployee) {
      this.employeeForm.patchValue({
        firstName: this.selectedEmployee.firstName,
        lastName: this.selectedEmployee.lastName,
        email: this.selectedEmployee.email,
        hireDate: this.selectedEmployee.hireDate.split('T')[0],
        departmentId: this.selectedEmployee.departmentId,
        areaId: this.selectedEmployee.areaId,
      });

      this.loadAreas(this.selectedEmployee.departmentId);
    }
  }

  onDepartmentChange(): void {
    const departmentId = Number(this.employeeForm.value.departmentId);

    this.employeeForm.patchValue({ areaId: 0 });
    this.areas = [];

    if (departmentId > 0) {
      this.loadAreas(departmentId);
    }
  }

  private loadAreas(departmentId: number): void {
    this.employeeApiService.getAreas(departmentId).subscribe({
      next: (areas) => {
        this.areas = areas;
      },
      error: () => {
        this.areas = [];
      },
    });
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.employeeForm.invalid || this.isSubmitting) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      firstName: this.employeeForm.value.firstName!.trim(),
      lastName: this.employeeForm.value.lastName!.trim(),
      email: this.employeeForm.value.email!.trim(),
      hireDate: this.employeeForm.value.hireDate!,
      departmentId: Number(this.employeeForm.value.departmentId),
      areaId: Number(this.employeeForm.value.areaId),
    };

    const request$ = this.selectedEmployee
      ? this.employeeApiService.updateEmployee(this.selectedEmployee.id, payload)
      : this.employeeApiService.createEmployee(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = this.selectedEmployee
          ? 'Empleado actualizado correctamente.'
          : 'Empleado guardado correctamente.';
        this.clearForm(false);
        this.employeeSaved.emit();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message ?? 'No se pudo guardar el empleado.';
      },
    });
  }

  clearForm(emitEvent = true): void {
    this.employeeForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      hireDate: '',
      departmentId: 0,
      areaId: 0,
    });

    this.areas = [];
    this.errorMessage = '';
    this.selectedEmployee = null;

    if (emitEvent) {
      this.formCleared.emit();
    }
  }
}