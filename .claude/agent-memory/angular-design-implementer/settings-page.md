---
name: settings-page
description: Admin settings page implementation status and design decisions
metadata:
  type: project
---

Settings page implemented at `src/admin/settings/` (settings.ts / settings.html / settings.css).

Route added: `/admin/settings` (lazy-loaded) in `src/admin/admin.routes.ts`.

Sections: User Profile (edit toggle + avatar initials), Publication Details (blog title + meta description with char counter), Preferences (3 toggles: Dark Mode / Push Notifications / Weekly Digest), Security (collapsible password form + 2FA card), Session (logout button).

Desktop bento grid: 2-column, Profile/Security/Session cards span full width. Mobile: single-column vertical stack.

**Why:** openapi.json has no `/admin/settings` endpoints yet — all save/toggle handlers have TODO comments pointing to a future `SettingsApiService`. The component is fully wired structurally; API integration is the only missing piece.

**How to apply:** When the API endpoints are added, create `src/admin/services/settings-api.service.ts` and replace the TODO comments in settings.ts.

[[api-contract-location]]
