import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Login // Default landing page
    },
    {
        path: 'admin/dashboard',
        component: AdminDashboard // Dashboard page route
    }
];