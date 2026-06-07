import { Routes } from '@angular/router';
import { adminAuthGuard } from '../auth/guards/admin-auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
    canActivate: [adminAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'articles',
        loadComponent: () => import('./article-list/article-list').then((m) => m.ArticleList),
      },
      {
        path: 'articles/new',
        loadComponent: () => import('./article-editor/article-editor').then((m) => m.ArticleEditor),
      },
      {
        path: 'articles/:id/edit',
        loadComponent: () => import('./article-editor/article-editor').then((m) => m.ArticleEditor),
      },
      {
        path: 'categories',
        loadComponent: () => import('./category-list/category-list').then((m) => m.CategoryList),
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import('./category-editor/category-editor').then((m) => m.CategoryEditor),
      },
      {
        path: 'categories/:id/edit',
        loadComponent: () =>
          import('./category-editor/category-editor').then((m) => m.CategoryEditor),
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then((m) => m.Settings),
      },
    ],
  },
];
