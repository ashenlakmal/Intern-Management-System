import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Login // Default landing page
    },
    {
        path: 'admin/dashboard',
        component: AdminDashboardComponent // Dashboard page route
    }
];