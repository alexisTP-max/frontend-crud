import { Area } from './area.model';
import { Department } from './department.model';

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    hireDate: string;
    departmentId: number;
    areaId: number;
    department?: Department;
    area?: Area;
    createdAt?: string;
    updatedAt?: string;
}