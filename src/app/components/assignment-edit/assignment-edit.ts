import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment';
import { CommonModule } from '@angular/common';
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
  selector: 'app-assignment-edit',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatCheckboxModule,
    MatSnackBarModule, MatCardModule
  ],
  templateUrl: './assignment-edit.html',
  styleUrl: './assignment-edit.scss'
})
export class AssignmentEditComponent implements OnInit {
  form!: FormGroup;
  id!: string;
  matieres = ['Base de données', 'Technologies Web', 'Angular', 'Node.js', 'MongoDB', 'Grails'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private assignmentService: AssignmentService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      nom: ['', Validators.required],
      auteur: ['', Validators.required],
      matiere: ['', Validators.required],
      dateDeRendu: ['', Validators.required],
      note: [null, [Validators.min(0), Validators.max(20)]],
      remarques: [''],
      rendu: [false]
    });
    this.assignmentService.getOne(this.id).subscribe(a => {
      this.form.patchValue({ ...a, dateDeRendu: new Date(a.dateDeRendu) });
    });
  }

submit() {
  if (this.form.invalid) return;

  const { rendu, note } = this.form.value;
  if (rendu && (note === null || note === undefined || note === '' || isNaN(note))) {
    this.snack.open('⚠️ Impossible de marquer comme rendu sans note !', 'Fermer', {
      duration: 4000,
      panelClass: ['snack-warn']
    });
    return;
  }

  this.assignmentService.update(this.id, this.form.value).subscribe({
    next: () => {
      this.snack.open('✅ Assignment modifié !', 'OK', { duration: 2000 });
      this.router.navigate(['/assignments']);
    },
    error: () => this.snack.open('❌ Erreur', 'Fermer', { duration: 3000 })
  });
}
}