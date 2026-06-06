import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout').then((m) => m.UserLayout),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home').then((m) => m.Home),
        title: 'Home — Modern Editorial',
      },
      {
        path: 'articles/:id',
        loadComponent: () =>
          import('./article-detail/article-detail').then((m) => m.ArticleDetail),
        title: 'Article — Modern Editorial',
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about').then((m) => m.About),
        title: 'About — Modern Editorial',
      },
    ],
  },
];
