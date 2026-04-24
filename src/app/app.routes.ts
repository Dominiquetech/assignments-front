import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AssignmentsListComponent } from './components/assignments-list/assignments-list';
import { AssignmentDetailComponent } from './components/assignment-detail/assignment-detail';
import { AssignmentAddComponent } from './components/assignment-add/assignment-add';
import { AssignmentEditComponent } from './components/assignment-edit/assignment-edit';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'assignments', component: AssignmentsListComponent, canActivate: [authGuard] },
  { path: 'assignments/add', component: AssignmentAddComponent, canActivate: [authGuard] },
  { path: 'assignments/:id', component: AssignmentDetailComponent, canActivate: [authGuard] },
  { path: 'assignments/:id/edit', component: AssignmentEditComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];