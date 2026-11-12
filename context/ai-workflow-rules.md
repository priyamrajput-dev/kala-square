# AI Workflow Rules - Kalasquare - To Prevent Hallucination

## Approach

Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and what the current state of progress is. Always implement against these specs. Do NOT infer or invent behavior from scratch.

## Scoping Rules

- Work on one feature unit or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do NOT combine unrelated system boundaries in a single implementation step.

## When To Split Work

Split an implementation step if it combines:
- UI changes and backend API changes
- Artist CRUD and Home Page Manager
- Multiple unrelated API routes
- Behavior that is not clearly defined in the context files

If a change cannot be verified end-to-end quickly, the scope is too broad. Split it.

## Handling Missing Requirements

- Do NOT invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an Open Question in `progress-tracker.md` before continuing.

## Protected Foundation Components

Do NOT modify generated third-party foundation components unless explicitly instructed.
- `packages/config/*`
- Third-party library internals

Project-specific styling, layout, and feature logic must be implemented in app-level components, not by modifying foundation components.

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:
- System architecture or boundaries
- Storage model decisions
- Code conventions or standards
- Feature scope

Progress state must reflect the actual state of the implementation, not the intended state.

## Before Moving To The Next Unit

1. The current unit works end-to-end within its defined scope.
2. No invariant in `architecture-context.md` was violated.
3. `progress-tracker.md` reflects the completed work.
4. Prompt DONE check has passed.

## How Prompts Are Given

- One prompt at a time. Next prompt only after previous prompt is DONE.
- Prompts are in English. Conversation with the user is in Hinglish.
- After each prompt, update `progress-tracker.md` and commit with git.
