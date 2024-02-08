# Hydrogen template: Skeleton

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **minimal setup** of components, queries and tooling to get started with Hydrogen.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## What's included

- Remixshop
- Hydrogen
- Oxygen
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher

```bash
npm create @shopify/hydrogen@latest
```

## Building for production

```bash
npm run build
```

## Local development

```bash
npm run dev
```

# Git Policy

## Repo **Naming Conventions:**

- The name should start with the project name
- Separate project name words with hyphens
- Separate stack with an underscore
- All letters must be lowercase.
- Avoid special characters.
- if the repo is for a library or template
  - it must start tech-stack name along with a hyphen
  - Separate project name words with hyphens
- Examples:
  - project-name_frontend
  - project-name_backend
  - project-name_wp
  - project-name_theme
  - react-abc
  - react-abc-def

## **Access** [🔗](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization#permissions-for-each-role) **:**

- **Access will be provided only for users registered by company email (**[**intuji.com**](http://intuji.com/)**)**
- Admin
  - Project Owner
  - Project Manager
  - Team Lead
  - Project Lead (both frontend and backend)
- Maintain
  - Developers
- Triage
  - QA
- Write
- Read
  - Designer (if have to)

##

## **Branches**

1. **Default branch**

The default branch should be created at the time of creating the repo.

- Dev (Primary branch): `dev`
  - Everything and the default branch
  - Protected branch, only by project lead can merge PR
- Staging: `staging`
  - for deployment to the staging server
  - Cannot push code directly by the developer, need to use PR
- Main: `main`
  - for stable, production-ready code.
  - Cannot push code directly by the developer, need to use PR

2. **Category**

Start branch names with a prefix to indicate the type of branch: `feature`, `bugfix`, `hotfix`, `test` or `release`

-       *   Feature branches: _`feature`_Use feature branches to develop new features or enhancements.
  - Create branches based on the feature or user story being implemented.
  - Branch off from a designated development branch (e.g. main).
  - Regularly rebase or merge the latest changes from the parent branch into the feature branch to keep it up to date.
  - Encourage small, focused feature branches that address a specific functionality or user story.
  - Bugfix branches: \_`bugfix`\_Use the bugfix branch to resolve issues or bugs found in the codebase.
  - Create branches based on the specific bug or issue being addressed
  - Regularly rebase or merge the latest changes from the parent branch into the bugfix branch to avoid conflicts.
  - Branch off from the appropriate development branch (e.g., main).
  - Aim to keep bugfix branches small and focused on a single issue to facilitate easier testing and review.
  - Hotfix branches: `hotfix`Use the hotfix branch to change code with a temporary solution and/or without following the usual process.
  - It must be done usually in an emergency case
  - Test branches: `test`Use the test branch only for experimenting with codes and external libraries
  - It must be outside of an issue
  - Release branches: \_`release`\_Use release branches to prepare for a new release or version.
  - The branch must be related to the version. ex: 1.0.0
    - First 1 for the major release
    - then for the minor release
    - last 0 for hotfixes
  - Create a release branch when the codebase is in a stable state and ready for release.
  - Branch off from the development branch
  - Perform necessary release-related tasks such as versioning, final bug fixes, and documentation updates.
  - Test the release branch rigorously and involve QA or testing teams for verification.
  - Once the release is ready, merge the release branch into the main branch (e.g., main or master), tag it with a version number, (tag it with a version number, build assets zips), and potentially create a release on your chosen Git hosting platform.

3. **Reference:**
   - After the category, there should be a "/" followed by a reference to the issue/ticket you are working on. If there's no reference, just add `no-ref`.
   - After the reference, there should be another "/" followed by a description that sums up the purpose of this specific branch. This description should be short and "kebab-cased”.
   - By default, you can use the title of the issue/ticket you are working on. Just replace any special character with "-".
4. **Examples:**
   - You need to add, refactor, or remove a feature: `feature/issue-42/create-new-button-component` or `feature/[clickup-task-id]/login-form`
     - Click task ID. it looks like - `DP-8432`
   - You need to fix a bug: `bugfix/issue-342/button-overlap-form-on-mobile`
   - You need to fix a bug fast (possibly with a temporary solution) : `hotfix/no-ref/registration-form-not-working`
   - You need to experiment outside of an issue/ticket: `test/no-ref/refactor-components-with-atomic-design`
     - You need to release a new feature: `release/no-ref/1.2.1` or `release/no-ref/2.0.0`
     - The first number for a major release
     - The second number for a minor release
     - The last number for hotfixes

##

## **Issues:**

- Better if every task/issue had a separate issue
- The issue must have a proper and clear title
- The description must be clear
- **Use prefixes** to reflect the kind of property that a label expresses.
- If you know who will gonna work on this issue then you can agree to set assignees immediately when new issues are created.
- Assign or create a separate branch for each issue.
- Use (But Don’t Overuse) Labels and use consistent colors across all labels of a particular kind.
  - bug - red
  - help wanted - green
- Never forget to close issues when completed.

## **Commits:**

1. **Category**
   - A commit message should start with a category of change. You can pretty much use the following 4 categories for everything: `feat`, `fix`,  `revert`,`refactor`, and `chore`.
     - `feat`: when a commit adds a new feature to your application or library.
     - `fix`: when a commit represents a bug fix for your application.
     - `revert`: when a commit represents a code that is reverted to the previous.
     - `refactor`: when a code is optimized and doesn't remove or change any feature.
     - `chore` is for everything else (writing documentation, formatting, adding tests, cleaning useless code, etc.)
2. **Statement(s)**
   - Should separated by a colon.
   - Keep commit messages concise describing the changes,
   - Each statement should start with a verb conjugated imperatively.
   - Statements should be separated from themselves with a ";".
   - Must be around 50 characters or less.
   - Take the time to review and edit commit messages before finalizing them.
3. **Examples**

```sql
git commit -m 'feat: add new button component; add new button components to templates'
git commit -m 'fix: add the stop directive to the button component to prevent propagation'
git commit -m 'refactor: rewrite button component in TypeScript'
git commit -m 'chore: write button documentation'
git commit -m 'release this feature to prod'
```

##

## Readme ([**readme.md**](https://github.com/WEBO-Digital/sell-and-parker-frontend#readme))

- Must include title and description of the project
- Must include git policy (can change according to requirement but not completely)
- Better if included useful links (for eg: dev URL, prod URL, Figma)
- Must include the required environment to run the application.
- Must include the process of running the application

```sql
git pull origin [repo-url]
insert .env file
npm install / yarn
npm run dev or npm start / yarn dev or yarn start
```

##

## **Git Ignore:***

- Use a .gitignore file to exclude unnecessary files and directories from version control.
- Include common patterns for files generated by IDEs, build systems or operating systems.
- Customize the .gitignore file to meet the specific needs of your project and programming language.
- Must ignore:
  - _node_modules/_ (node folder)
  - _.cache_ (cache files and folder)
  - _.env_ or _.env._\* (environment variable configuration files, please include .env.example)
  - Misc files
    - ._DS_Store_,
    - _Thumbs.db,_
    - _desktop.ini_
  - .vscode
    - _sftp.json_
