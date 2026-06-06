---
name: user-screens
description: User-facing screens implemented — Home (article list), Article Detail, About/Resume — all under src/user/ with layout shell
metadata:
  type: project
---

Three user-facing screens implemented matching stitch designs in `src/stitch/stitch/kullanici_ekranlari/`:

**Layout shell** — `src/user/layout/layout.ts` (UserLayout): sticky header + router-outlet + footer + mobile bottom nav. Sidebar lives inside individual pages (not the shell) because About uses full-width layout.

**Reusable components under `src/user/components/`:**
- `header/user-header` — sticky top bar, desktop nav, Log In + Write Post buttons
- `sidebar/user-sidebar` — category filter sidebar (desktop sticky, input: categories + activeCategoryId, output: categorySelected)
- `footer/user-footer` — brand + copyright + footer links
- `bottom-nav/user-bottom-nav` — mobile fixed bottom nav (hidden md+)
- `article-card/article-card` — featured (wide side-by-side) and standard card; input: article, categoryName, featured
- `comment-item/comment-item` — single comment row with like + reply; input: Comment interface

**Pages:**
- `home/home` — article grid + category filter + newsletter CTA; loads paginated articles + categories via signals
- `article-detail/article-detail` — full article + hero + like toggle + comment form; route param `:id`
- `about/about` — bio hero + career timeline + portfolio grid with filter tabs; static data (no API endpoints for profile)

**Route structure** — `user.routes.ts` uses `UserLayout` as shell with children: `/home`, `/articles/:id`, `/about`.

**Assumptions:**
- No cover image in API (ArticleDto has no imageUrl) — gradient placeholder used everywhere
- Comments API does not exist yet — placeholder comments rendered statically
- Portfolio/bio data is static — no profile API endpoint
- `/feed` nav link exists in header but has no route yet (future work)

[[stitch-designs]]
