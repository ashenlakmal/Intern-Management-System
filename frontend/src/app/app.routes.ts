import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { Interns } from './pages/interns/interns';
import { Projects } from './pages/projects/projects';

export const routes: Routes = [
    {
        path: '',
        component: Login // Default landing page
    },
    {
        path: 'admin/dashboard',
        component: AdminDashboardComponent // Dashboard page route
    },
    {
        path: 'admin/interns',
        component: Interns // Interns page route
    },
    {
        path: 'admin/projects',
        component: Projects // Projects page route
    }

];