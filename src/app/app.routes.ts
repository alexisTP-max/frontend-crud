import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { EmployeeCrudComponent } from './features/employees/pages/employee-crud/employee-crud';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'employees',
        component: EmployeeCrudComponent,
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];