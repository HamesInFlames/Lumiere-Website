@AGENTS.md

# Claude Code — Lumière Pâtisserie website

## Role
Architect and reviewer. Cursor does most implementation; you plan, review diffs, and handle cross-cutting changes.

## Session workflow
1. Read `tasks/todo.md` and `tasks/status.md`.
2. Plan mode first for multi-file work.
3. Verify: `npm run lint` and `npm run build` pass, then screenshot at 1440px and 375px.
4. Update `tasks/status.md` before ending.

## Gemini delegation (when the Gemini MCP is connected)
- The repo is ~744 MB but only ~154 KB is source; the bulk is optimized images in `/public`. Never read or glob image folders.
- Use Gemini for whole-repo analysis, current third-party API docs (Google Search grounding), and a second-opinion review (`gemini_code_review`).
