import { Department } from './department.model';

export interface Area {
    id: number;
    name: string;
    departmentId: number;
    department?: Department;
}