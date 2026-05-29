import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeApiService } from '../../../../core/services/employee-api';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css',
})
export class DepartmentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly employeeApiService = inject(EmployeeApiService);

  @Output() departmentSaved = new EventEmitter<void>();

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  departmentForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  get f() {
    return this.departmentForm.controls;
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.departmentForm.invalid || this.isSubmitting) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.employeeApiService
      .createDepartment({
        name: this.departmentForm.value.name!.trim(),
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Departamento guardado correctamente.';
          this.departmentForm.reset({ name: '' });
          this.departmentSaved.emit();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error?.error?.message ?? 'No se pudo guardar el departamento.';
        },
      });
  }
}