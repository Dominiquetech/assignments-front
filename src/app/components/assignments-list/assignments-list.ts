import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment';
import { AuthService } from '../../services/auth';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-assignments-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './assignments-list.html',
  styleUrl: './assignments-list.scss'
})
export class AssignmentsListComponent implements OnInit {
  assignments: any[] = [];
  displayedColumns = ['nom', 'auteur', 'matiere', 'dateDeRendu', 'rendu', 'note', 'actions'];
  total = 0;
  page = 1;
  limit = 10;

  get nbRendus() { return this.assignments.filter(a => a.rendu).length; }
  get nbEnAttente() { return this.assignments.filter(a => !a.rendu).length; }

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
      this.assignments = res.assignments;
      this.total = res.total;
      this.cdr.markForCheck();
    });
  }

  onPage(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.load();
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