# Ajaia Docs — Assignment Submission

## Project

A lightweight collaborative document editor inspired by Google Docs.

## Live Application

> Add the deployed application URL here after deployment.

## Source Code

> Add the GitHub repository URL here.

## Walkthrough Video

> Add the walkthrough video URL here.

## Demo Users

The application uses simulated authentication for the assignment.

* Praveen — `Praveen@ajaia.com`
* Kumar — `Kumar@ajaia.com`

The dashboard provides a user switcher to simulate authentication.

## Core Workflow

The main demonstration flow is:

1. Switch to Praveen.
2. Create a new document.
3. Rename the document.
4. Add rich text using the editor.
5. Save the document.
6. Share the document with Kumar.
7. Switch to Kumar.
8. Open the shared document.
9. Edit and save the document.
10. Switch back to Praveen and verify the changes.
11. Import a `.txt` or `.md` file.
12. Edit and save the imported document.

## Implemented Requirements

| Requirement               | Status   |
| ------------------------- | -------- |
| Document creation         | Complete |
| Document rename           | Complete |
| Rich-text editing         | Complete |
| Document persistence      | Complete |
| File import               | Complete |
| Document sharing          | Complete |
| Owner/shared distinction  | Complete |
| Server-side authorization | Complete |
| Simulated authentication  | Complete |
| Automated test            | Complete |
| Validation/error handling | Complete |
| Production build          | Complete |

## Technical Stack

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

The frontend, API routes, authorization logic, and persistence layer are organized within a single Next.js application.

PostgreSQL provides durable relational storage for users, documents, and document sharing.

## Security

Authorization is enforced server-side.

The application verifies document access before reading or modifying protected documents. UI restrictions are treated only as a user-experience mechanism and not as the security boundary.

Uploaded files are validated for supported extension and file size, and imported text is HTML-escaped before being stored as editor content.

## Testing

The project includes an automated authorization test covering:

* Owner access
* Shared `EDIT` access
* Shared `READ` access
* Unshared users

The following checks were also performed:

```bash
npm test
npm run lint
npm run build
```

## Scope Decisions

The implementation intentionally does not include:

* Real OAuth/OIDC
* Real-time collaboration
* Comments
* Version history
* Advanced Markdown parsing
* Original-file object storage

These were intentionally excluded to prioritize the required functionality within the assignment timebox.

## Next Production Improvements

If additional development time were available, the next priorities would be:

1. OAuth/OIDC authentication
2. Real-time collaboration
3. Version history and conflict handling
4. Debounced autosave
5. Object storage and asynchronous file processing
6. Rate limiting, audit logging, and observability
