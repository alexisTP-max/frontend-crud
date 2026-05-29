import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeApiService } from '../../../../core/services/employee-api';
import { Department } from '../../../../shared/models/department.model';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './area-form.html',
  styleUrl: './area-form.css',
})
export class AreaFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly employeeApiService = inject(EmployeeApiService);

  @Input() departments: Department[] = [];
  @Output() areaSaved = new EventEmitter<void>();

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  areaForm = this.fb.group({
    departmentId: [0, [Validators.required, Validators.min(1)]],
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  get f() {
    return this.areaForm.controls;
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.areaForm.invalid || this.isSubmitting) {
      this.areaForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.employeeApiService
      .createArea({
        name: this.areaForm.value.name!.trim(),
        departmentId: Number(this.areaForm.value.departmentId),
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Área guardada correctamente.';
          this.areaForm.reset({
            departmentId: 0,
            name: '',
          });
          this.areaSaved.emit();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error?.error?.message ?? 'No se pudo guardar el área.';
        },
      });
  }
}