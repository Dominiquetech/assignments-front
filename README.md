# Assignments App — Front-end

Application Angular pour la gestion des assignments.

## Technologies utilisées

- Angular 21
- Angular Material
- TypeScript
- JWT pour l'authentification

## Fonctionnalités

- Authentification login/register avec JWT
- Gestion des rôles (admin / élève)
- Liste des assignments avec pagination
- Recherche et filtres (nom, auteur, matière, statut)
- Ajout d'assignment avec formulaire Stepper
- Modification et suppression (admin uniquement)
- Dialog de confirmation pour la suppression
- Vue détail avec image de la matière et nom du prof
- Notifications SnackBar
- Design responsive avec Angular Material

## Installation locale

### Prérequis
- Node.js v18+
- Angular CLI v21+

### Étapes

1. Cloner le repo
```bash
git clone https://github.com/Dominiquetech/assignments-front.git
cd assignments-front
```

2. Installer les dépendances
```bash
npm install
```

3. Lancer l'application
```bash
ng serve
```

L'application tourne sur `http://localhost:4200`

## Compte admin de test
- Email : admin@admin.com
- Mot de passe : admin123

## URLs de production
- Front-end : https://assignments-front-si1y.onrender.com
- Back-end : https://assignments-back-lxvq.onrender.com

## Structure du projet