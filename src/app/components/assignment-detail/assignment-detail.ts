import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService } from '../../services/assignment';
import { AuthService } from '../../services/auth';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, DatePipe, MatCardModule, MatButtonModule,
    MatChipsModule, MatIconModule, MatSnackBarModule
  ],
  templateUrl: './assignment-detail.html',
  styleUrl: './assignment-detail.scss'
})
export class AssignmentDetailComponent implements OnInit {
  assignment: any = null;

  matiereImages: { [key: string]: { image: string, prof: string } } = {
    'Base de données': {
      image: 'https://cdn-icons-png.flaticon.com/512/2906/2906274.png',
      prof: 'Prof. Martin'
    },
    'Technologies Web': {
      image: 'https://cdn-icons-png.flaticon.com/512/1183/1183672.png',
      prof: 'Prof. Dupont'
    },
    'Angular': {
      image: 'https://cdn-icons-png.flaticon.com/512/226/226775.png',
      prof: 'Prof. Bernard'
    },
    'Node.js': {
      image: 'https://cdn-icons-png.flaticon.com/512/5968/5968322.png',
      prof: 'Prof. Leclerc'
    },
    'MongoDB': {
      image: 'https://cdn-icons-png.flaticon.com/512/6277/6277699.png',
      prof: 'Prof. Rousseau'
    },
    'Grails': {
      image: 'https://cdn-icons-png.flaticon.com/512/226/226777.png',
      prof: 'Prof. Moreau'
    }
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private assignmentService: AssignmentService,
    public auth: AuthService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.assignmentService.getOne(id).subscribe({
      next: (a) => {
        this.assignment = a;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  getMatiere(nom: string) {
    return this.matiereImages[nom] || { image: '', prof: 'Professeur inconnu' };
  }

  modifier() {
    this.router.navigate(['/assignments', this.assignment._id, 'edit']);
  }

  supprimer() {
    if (!confirm('Supprimer ?')) return;
    this.assignmentService.delete(this.assignment._id).subscribe(() => {
      this.snack.open('✅ Supprimé', 'OK', { duration: 2000 });
      this.router.navigate(['/assignments']);
    });
  }
}