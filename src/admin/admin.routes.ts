import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.Layout),
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
        path: 'categories',
        loadComponent: () => import('./category-list/category-list').then((m) => m.CategoryList),
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import('./category-editor/category-editor').then((m) => m.CategoryEditor),
      },
    ],
  },
];
