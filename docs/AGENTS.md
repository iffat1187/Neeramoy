# Neeramoy Project Rules

## Project

Neeramoy is an Arogga-inspired online medicine marketplace.

Technology:

* Frontend: React + Vite
* Backend: Spring Boot + Java 25
* Database: MongoDB
* Image storage: Cloudinary
* Frontend deployment: Netlify
* Backend deployment: Render

Project root:

`D:\Neeramoy`

Frontend:

`D:\Neeramoy\frontend`

Backend:

`D:\Neeramoy\backend`

Stitch reference:

`D:\Neeramoy\stitch-reference`

---

## DESIGN PRINCIPLE

Google Stitch is a visual reference for Neeramoy.

Stitch does NOT represent the complete Neeramoy application.

Some screens are designed in Stitch and some screens are not.

Use Stitch to understand:

* visual style
* color system
* typography
* spacing
* cards
* buttons
* navigation
* product presentation
* responsive behavior
* overall visual language

When a Stitch screen exists for a requested page, use it as the primary visual reference.

When a Stitch screen does NOT exist, design the missing page consistently with the established Neeramoy visual language.

Reasonable modifications are allowed when required for:

* usability
* responsive behavior
* functionality
* consistency
* missing application requirements

Do not blindly copy Stitch code.

The actual implementation must be clean React code.

---

## FRONTEND DEVELOPMENT

The frontend must be built as a complete real-world medicine marketplace.

Build reusable components rather than duplicating page code.

Prefer:

* reusable components
* reusable layouts
* reusable product components
* reusable forms
* reusable tables
* reusable modals
* reusable status badges
* reusable data structures

Keep the architecture simple and understandable.

Do not over-engineer.

Do not introduce unnecessary libraries.

Do not change React/Vite to another framework.

---

## FRONTEND FIRST

The initial frontend must work independently from the backend.

Use realistic mock data while the backend is not connected.

Do not wait for Spring Boot APIs to build the frontend.

Later, mock services will be replaced with real API services.

The UI architecture should make this transition easy.

---

## ROUTING

Use React Router or the existing routing solution.

Customer routes and pharmacy-admin routes should be clearly separated.

Do not create duplicate routes.

Do not unnecessarily change an already established route.

---

## BACKEND PROTECTION

During frontend development:

DO NOT modify:

* Spring Boot controllers
* services
* repositories
* MongoDB configuration
* security
* backend models
* backend APIs

unless explicitly instructed.

---

## VISUAL CONSISTENCY

Neeramoy should feel like one product.

Pages that were not designed in Stitch should still use the same:

* colors
* typography
* spacing
* border radius
* shadows
* button styles
* cards
* icons
* navigation
* responsive principles

Do not invent an unrelated design language.

---

## BUG FIXING

When fixing a bug:

1. Reproduce the problem.
2. Inspect the actual cause.
3. Fix the cause.
4. Avoid unrelated changes.

Never redesign a page while fixing an unrelated bug.

For example:

If `npm run build` fails, fix the build problem.

Do not rewrite the landing page.

---

## SCOPE CONTROL

Every development task must have a clearly defined scope.

Only modify files required for that task.

Do not silently redesign or refactor unrelated pages.

Do not replace working components without a reason.

---

## VALIDATION

After meaningful frontend work run:

`npm run build`

When testing the production build locally:

`npm run preview`

Check:

* routes
* console errors
* broken images
* missing assets
* responsive layout
* navigation
* forms
* interactions

---

## COMPLETION REPORT

After every task report:

1. What was implemented.
2. Files changed.
3. Routes created/changed.
4. Build result.
5. Remaining issues.

Keep the report concise.

---

## MOST IMPORTANT RULE

Build Neeramoy as a complete product.

Use Stitch as the design reference.

Do not treat Stitch as the complete application.

When Stitch has a screen, follow its visual direction.

When Stitch does not have a screen, create the missing screen consistently with the established Neeramoy design.

Preserve existing work unless the current task explicitly requires replacing it.
