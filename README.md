# Ajaia Docs — Collaborative Document Editor

A lightweight collaborative document editor inspired by Google Docs, built as an AI-Native full-stack application.

## Features

* Create and rename documents
* Rich-text editing with:

  * Bold
  * Italic
  * Underline
  * Headings
  * Bulleted lists
  * Numbered lists
* Explicit document save
* Persistent document storage
* `.txt` and `.md` file import
* Document sharing
* Owner and shared-document views
* `EDIT` permission for shared users
* Backend authorization
* Simulated authentication with demo users
* Automated authorization tests

## Tech Stack

* Next.js
* React
* TypeScript
* Tiptap
* Tailwind CSS
* Drizzle ORM
* PostgreSQL / Neon
* Zod
* Vitest

## Architecture

The application uses a modular monolith architecture.

```text
Browser
   |
   v
Next.js UI
   |
   v
Next.js API Routes
   |
   +---- Authentication
   |
   +---- Authorization
   |
   +---- Document Services
   |
   +---- File Import
   |
   v
Drizzle ORM
   |
   v
PostgreSQL
```

The application intentionally avoids unnecessary distributed infrastructure for this assignment.

## Getting Started

### Prerequisites

* Node.js 20+
* PostgreSQL-compatible database
* npm

### Install dependencies

```bash
npm install
```

### Environment variables

Create `.env.local`:

```env
DATABASE_URL="your_database_connection_string"
DEMO_USER_ID="your_seeded_user_id"
```

### Database setup

Push the schema:

```bash
npm run db:push
```

Seed the demo users:

```bash
npm run db:seed
```

### Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Demo Users

The application includes simulated users:

* Praveen — `Praveen@ajaia.com`
* Kumar — `Kumar@ajaia.com`

Use the user switcher in the dashboard to switch between users.

## Main Demo Flow

1. Sign in as Praveen using the demo user switcher.
2. Create a document.
3. Add rich text content.
4. Save the document.
5. Share the document with Kumar.
6. Switch to Kumar.
7. Open the shared document.
8. Edit and save the document.
9. Switch back to Praveen.
10. Verify the changes.
11. Import a `.txt` or `.md` file and edit the resulting document.

## Validation

Run the automated tests:

```bash
npm test
```

Run lint:

```bash
npm run lint
```

Run the production build:

```bash
npm run build
```

## Design Decisions

### Simulated Authentication

Real OAuth/OIDC authentication is intentionally outside the scope of this time-boxed assignment. Authentication is simulated using seeded users and an HTTP-only cookie.

The authorization model is implemented on the server.

### Explicit Save

The editor uses an explicit Save action rather than autosave. This keeps the implementation simple and predictable within the assignment timebox.

A production implementation could introduce debounced autosave, optimistic updates, and conflict/version handling.

### File Import

The application supports `.txt` and `.md` imports. Files are validated server-side and converted into editable document content.

### Database

PostgreSQL was selected because document ownership and sharing are relational concepts and benefit from transactional consistency and indexed queries.

## Scope / Limitations

This implementation intentionally does not include:

* Real OAuth/OIDC authentication
* Real-time multi-user editing
* Comments
* Version history
* Advanced Markdown parsing
* Object storage for original uploaded files

These can be added as future iterations.

## Future Improvements

With additional development time, the next improvements would be:

1. OAuth/OIDC authentication
2. Real-time collaboration using WebSockets or a CRDT-based approach
3. Version history and document recovery
4. Debounced autosave
5. Object storage for uploaded source files
6. Rate limiting and audit logging
7. Automated CI/CD and observability
