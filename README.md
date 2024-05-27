# Front End | Cigweld

This is the front end for Cigweld, built using Hydrogen. [Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) is Shopify’s stack specifically designed for headless commerce, enabling highly customized and dynamic storefronts. It integrates seamlessly with [Remix](https://remix.run/), Shopify’s comprehensive full-stack web framework, providing a robust and efficient development experience.

## Getting started

**Requirements:**

- Node.js version 20.0.0 or higher

## Building for production

```bash
npm run build
```

## Local development

```bash
npm run dev
```

# Git Policy

## Naming Conventions (Branches) 🌴

1. **Category**

   A git branch should start with a category. Pick one of these: `feature`, `bugfix`, `hotfix`, or `test`.

   - `feature` is for adding, refactoring or removing a feature
   - `bugfix` is for fixing a bug
   - `hotfix` is for changing code with a temporary solution and/or without following the usual process (usually because of an emergency)
   - `test` is for experimenting outside of an issue/ticket

2. **Reference**

   After the category, there should be a "/" followed by the reference of the issue/ticket you are working on. If there's no reference, just add `no-ref`.

3. **Description**

   After the reference, there should be another "/" followed by a description which sums up the purpose of this specific branch. This description should be short and "kebab-cased".

   By default, you can use the title of the issue/ticket you are working on. Just replace any special character by "-".

4. **Examples**:

   - You need to add, refactor or remove a feature: `feature/issue-42/create-new-button-component`
   - You need to fix a bug: `bugfix/issue-342/button-overlap-form-on-mobile`
   - You need to fix a bug really fast (possibly with a temporary solution)
     : `hotfix/no-ref/registration-form-not-working`
   - You need to experiment outside of an issue/ticket: `test/no-ref/refactor-components-with-atomic-design`

## Naming Conventions (Commits) 📌

1.  **Category**

    A commit message should start with a category of change. You can pretty much use the following 4 categories for everything: `feat`, `fix`, `refactor`, and `chore`.

    - `feat` is for adding a new feature
    - `fix` is for fixing a bug
    - `refactor` is for changing code for peformance or convenience purpose (e.g. readibility)
    - `chore` is for everything else (writing documentation, formatting, adding tests, cleaning useless code etc.)

2.  **Statement(s)**

After the colon, the commit description should consist in short statements describing the changes.
Each statement should start with a verb conjugated in an imperative way. Statements should be seperated from themselves with a ";".

3. **Examples**:

   - `git commit -m 'feat: add new button component; add new button components to templates'`
   - `git commit -m 'fix: add the stop directive to button component to prevent propagation'`
   - `git commit -m 'refactor: rewrite button component in TypeScript'`
   - `git commit -m 'chore: write button documentation'`

## Links 🔗

- [Figma Design](https://www.figma.com/design/rPcBr8hLmkM16HNQjyf9Qd/Portal-25th-JAN?node-id=3025-48353&t=WwoJxRrAhbGKr3dR-0)
- [Style guide](https://www.figma.com/design/rPcBr8hLmkM16HNQjyf9Qd/Portal-25th-JAN?node-id=2168-126323&t=WwoJxRrAhbGKr3dR-0).
- [**Development Preview Site** i.e `staging` branch](https://cig-front.webo.dev/)
- [**Client's Preview Site** i.e `uat` branch](https://cig-uat.webo.dev/)
