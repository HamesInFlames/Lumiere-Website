# AGENTS.md — Universal AI Agent Configuration

## Project
- Name: Lumiere Patisserie Website
- Company: Kim Consultant (kimconsultant.net)
- Developer: James
- Stack: React 19 + Vite 7, Express backend, Resend API
- Hosting: Railway (dual-service deployment)
- Repo: github.com/HamesInFlames/Lumiere-Website
- Design: Swiper carousels, Motion animations

## Code conventions
- TypeScript for all new code
- React functional components with hooks only
- Motion library for animations (NOT framer-motion)
- ESM imports, no CommonJS
- Commit format: type(scope): description

## File structure
- /src/components — reusable UI components
- /src/pages — route-level page components
- /src/lib — utilities and helpers
- /tasks/todo.md — current task list
- /tasks/decisions.md — architecture decisions
- /tasks/status.md — session continuity

## Workflow
- Read tasks/todo.md before starting work
- Update tasks/status.md after each session
- Log decisions in tasks/decisions.md
- Run `npm run lint` and `npm run build` before committing
- Test at 1440px and 375px viewports

## Do NOT
- Install packages without documenting in decisions.md
- Modify Railway deployment config without approval
- Delete or overwrite .env files
- Change Motion to another animation library
- Touch the optimized product images in /public
