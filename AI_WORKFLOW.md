# AI Workflow Note

## How AI Was Used

AI was used as a development accelerator throughout the implementation.

It was primarily used for:

* Initial project structure
* Database schema suggestions
* API route scaffolding
* Tiptap integration
* Form and UI scaffolding
* Validation patterns
* Test-case generation
* Documentation structure
* Reviewing potential edge cases

AI was treated as an implementation assistant rather than the architectural decision maker.

## What I Decided

I made the main architectural decisions based on the assignment requirements and the implementation timebox.

The main decisions were:

* Next.js modular monolith
* PostgreSQL for persistence
* Drizzle ORM
* Tiptap for rich-text editing
* Simulated authentication
* Server-side authorization
* `.txt` / `.md` import
* Explicit Save rather than autosave

I intentionally avoided introducing microservices, WebSockets, Redis, object storage, OAuth, or other infrastructure that was not necessary to satisfy the core requirements.

## What I Changed or Rejected

AI-generated suggestions were reviewed rather than copied blindly.

Examples of changes/rejections included:

* Avoiding unnecessary distributed architecture for a small application
* Keeping authentication simulated instead of implementing OAuth
* Keeping file import limited to `.txt` and `.md` to fit the timebox
* Separating authorization business logic so it could be tested independently
* Adding server-side validation instead of relying only on browser validation
* Escaping imported text before storing it as editor HTML

## Verification

AI-generated code was validated through:

* Local application testing
* Create/edit/save/reopen flows
* Sharing between Praveen and Kumar
* Unauthorized document access testing
* File import testing
* Invalid file testing
* Automated authorization tests
* ESLint
* Production build

The final implementation was therefore verified through both functional testing and engineering checks rather than relying solely on generated code.

## Reflection

The most useful role for AI in this project was accelerating repetitive implementation while keeping architectural decisions and correctness verification under developer control.

For a production system, I would apply the same workflow but add stronger automated testing, security review, dependency review, observability, and deployment validation.
