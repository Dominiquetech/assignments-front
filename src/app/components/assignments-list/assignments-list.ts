import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-assignments-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, FormsModule, DatePipe,
    MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatPaginatorModule, MatSnackBarModule,
    MatCardModule, MatDialogModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule
  ],
  templateUrl: './assignments-list.html',
  styleUrl: './assignments-list.scss'
})
export class AssignmentsListComponent implements OnInit {

  // Données
  assignmentsOriginal: any[] = [];
  assignments: any[] = [];
  displayedColumns = ['nom', 'auteur', 'matiere', 'dateDeRendu', 'rendu', 'note', 'actions'];
  total = 0;
  page = 1;
  limit = 10;

  // ✅ Stats déclarées ici
  nbRendus = 0;
  nbEnAttente = 0;

  // Filtres
  searchText = '';
  filtreMatiere = '';
  filtreStatut = '';
  noteMin: number | null = null;
  noteMax: number | null = null;

  matieres = [
    'Base de données',
    'Technologies Web',
    'Angular',
    'Node.js',
    'Grails'
  ];

  constructor(
    private assignmentService: AssignmentService,
    public auth: AuthService,
    public router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.assignmentService.getAll(this.page, this.limit).subscribe(res => {
      this.assignmentsOriginal = res.assignments;
      this.assignments = res.assignments;
      this.total = res.total;
      this.nbRendus = res.assignments.filter((a: any) => a.rendu).length;
      this.nbEnAttente = res.assignments.filter((a: any) => !a.rendu).length;
      this.cdr.markForCheck();
    });
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.load();
  }

  appliquerFiltres() {
  // Si aucun filtre actif → charger normalement avec pagination
  if (!this.searchText && !this.filtreMatiere && !this.filtreStatut && 
      this.noteMin === null && this.noteMax === null) {
    this.load();
    return;
  }

  // Sinon → charger TOUS les assignments et filtrer
  this.assignmentService.getAll(1, 99999).subscribe((res: any) => {
    const data = res.assignments ?? res.docs ?? res.data ?? [];
    const texte = this.searchText.toLowerCase();

    this.assignments = data.filter((a: any) => {
      const matchTexte = !texte ||
        a.auteur?.toLowerCase().includes(texte) ||
        a.matiere?.toLowerCase().includes(texte) ||
        a.nom?.toLowerCase().includes(texte);
      const matchMatiere = !this.filtreMatiere || a.matiere === this.filtreMatiere;
      const matchStatut = !this.filtreStatut ||
        (this.filtreStatut === 'rendu' && a.rendu) ||
        (this.filtreStatut === 'non rendu' && !a.rendu);
      const matchNoteMin = this.noteMin === null || a.note >= this.noteMin;
      const matchNoteMax = this.noteMax === null || a.note <= this.noteMax;
      return matchTexte && matchMatiere && matchStatut && matchNoteMin && matchNoteMax;
    });

    this.total = this.assignments.length;
    this.cdr.markForCheck();
  });
}
  resetFiltres() {
  this.searchText = '';
  this.filtreMatiere = '';
  this.filtreStatut = '';
  this.noteMin = null;
  this.noteMax = null;
  this.page = 1;
  this.load(); // ← recharge normalement avec pagination
}

  voir(id: string) { this.router.navigate(['/assignments', id]); }
  modifier(id: string) { this.router.navigate(['/assignments', id, 'edit']); }

  supprimer(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Voulez-vous vraiment supprimer cet assignment ?' }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.assignmentService.delete(id).subscribe(() => {
        this.snack.open('✅ Assignment supprimé', 'OK', { duration: 2000 });
        this.load();
      });
    });
  }
}