import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../../../../shared/models/employee.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-table.html',
  styleUrl: './employee-table.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class EmployeeTableComponent {
  @Input() employees: Employee[] = [];
  @Input() isLoading = false;
  @Input() firstLoadDone = false;

  @Output() editRequested = new EventEmitter<Employee>();
  @Output() deleteRequested = new EventEmitter<number>();
  @Output() refreshRequested = new EventEmitter<void>();
}