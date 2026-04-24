import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-assignment-add',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatStepperModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatCheckboxModule, MatSnackBarModule, MatCardModule
  ],
  templateUrl: './assignment-add.html',
  styleUrl: './assignment-add.scss'
})
export class AssignmentAddComponent {
  matieres = ['Base de données', 'Technologies Web', 'Angular', 'Node.js', 'MongoDB', 'Grails'];

  step1: FormGroup;
  step2: FormGroup;
  step3: FormGroup;

  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.step1 = this.fb.group({
      nom: ['', Validators.required],
      auteur: ['', Validators.required]
    });
    this.step2 = this.fb.group({
      matiere: ['', Validators.required],
      dateDeRendu: ['', Validators.required]
    });
    this.step3 = this.fb.group({
      note: [null, [Validators.min(0), Validators.max(20)]],
      remarques: [''],
      rendu: [false]
    });
  }

  submit() {
    const data = { ...this.step1.value, ...this.step2.value, ...this.step3.value };
    this.assignmentService.create(data).subscribe({
      next: () => {
        this.snack.open('Assignment créé !', 'OK', { duration: 2000 });
        this.router.navigate(['/assignments']);
      },
      error: () => this.snack.open('Erreur lors de la création', 'Fermer', { duration: 3000 })
    });
  }
}