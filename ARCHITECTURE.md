# Architecture Note

## 1. Architecture Overview

The application is implemented as a modular monolith using Next.js.

The main layers are:

```text
Presentation
    |
    v
API / Application Layer
    |
    v
Business Rules
    |
    v
Persistence
```

### Presentation

The React/Next.js frontend provides:

* Dashboard
* Document editor
* Sharing dialog
* User switcher
* File import

Tiptap is used for rich-text editing.

### API / Application Layer

Next.js API routes handle:

* Document creation and retrieval
* Document updates
* Sharing
* User switching
* File import

### Business Rules

Authorization is separated from UI concerns.

The server determines whether a user can:

* Read a document
* Edit a document
* Share a document

The frontend only reflects these permissions for UX purposes.

### Persistence

PostgreSQL stores:

```text
users
documents
document_shares
```

Drizzle ORM provides type-safe database access.

---

## 2. Data Model

```text
User
 |
 +----< Document
 |
 +----< DocumentShare >---- Document
```

### User

Represents a demo application user.

### Document

Contains:

* title
* rich-text content
* owner
* timestamps

### DocumentShare

Represents access granted to another user.

It contains:

* document
* user
* permission
* created timestamp

---

## 3. Authorization

Authorization is enforced server-side.

For example:

```text
Owner
  → Read
  → Edit
  → Share

Shared user + EDIT
  → Read
  → Edit

Shared user + READ
  → Read

Unshared user
  → No access
```

This is important because hiding a UI button is not a security mechanism.

The API independently verifies permissions before returning or modifying protected resources.

---

## 4. File Import

The upload flow is:

```text
File
  |
  v
Server validation
  |
  +-- extension
  +-- file size
  +-- authenticated user
  |
  v
Read text
  |
  v
Escape HTML
  |
  v
Create Document
  |
  v
Open in editor
```

The current implementation supports `.txt` and `.md`.

Original uploaded files are not retained because the assignment only requires importing the content into an editable document.

---

## 5. Why a Modular Monolith?

A modular monolith was chosen because the assignment has a relatively small domain and a short implementation window.

It provides:

* Clear module boundaries
* Simple local development
* Low operational complexity
* Single deployment
* Shared type definitions
* Easy database transactions

Introducing microservices, queues, Redis, or event streaming would increase complexity without providing meaningful value for the current scale.

---

## 6. Production Evolution

If this application became a production collaborative editor, I would evolve it incrementally.

### Authentication

Replace simulated authentication with OAuth/OIDC and establish proper session management.

### Collaboration

Introduce WebSockets and, depending on collaboration requirements, a CRDT-based synchronization model.

### Persistence

Add:

* database indexes
* pagination
* optimistic concurrency/versioning
* document revision history

### File Storage

Store original uploaded files in object storage such as S3 and process larger documents asynchronously.

### Reliability

Add:

* structured logging
* monitoring
* tracing
* rate limiting
* audit logging
* CI/CD
* automated integration tests

The current design intentionally leaves room for these capabilities without requiring them for the assignment.
