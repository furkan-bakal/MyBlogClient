import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Parameterized route: ids are not known at build time, so render on demand.
    path: 'articles/:id',
    renderMode: RenderMode.Server,
  },
  {
    // Admin panel is auth-gated and has parameterized edit routes; render on demand
    // instead of prerendering (avoids redirect-at-build and unknown-param issues).
    path: 'admin',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
