# RKD Domain Web

<p align="center">
  A focused Angular workspace for designing business domains, configurable attributes, reusable option lists, and domain relationships.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 20">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.9">
  <img src="https://img.shields.io/badge/style-SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS">
  <img src="https://img.shields.io/badge/runtime-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/API-rkd--domain--core-6E56CF?style=for-the-badge" alt="RKD Domain Core API">
  <img src="https://img.shields.io/badge/UI-dark%20mode-20232A?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Dark mode interface">
  <img src="https://img.shields.io/badge/package%20manager-npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm">
</p>

## ✨ About the project

RKD Domain Web is the Angular frontend for the RKD Domain Core platform.

It provides a practical interface for creating and maintaining business domains, linking related domains, defining configurable attributes, and managing reusable option lists. The application communicates with the `rkd-domain-core` REST API and is designed around a clear, lightweight configuration workflow.

The interface includes light and dark themes, expandable relationship management, inline feedback for API errors, and focused forms for each resource type.

## 📚 Table of contents

- [Technologies](#-technologies)
- [Features](#-features)
- [Project structure](#-project-structure)
- [Getting started](#-getting-started)
- [API integration](#-api-integration)
- [Available scripts](#-available-scripts)
- [License](#-license)

## 🛠 Technologies

| Technology | Purpose |
| --- | --- |
| [Angular 20](https://angular.dev/) | Frontend application framework |
| [TypeScript](https://www.typescriptlang.org/) | Typed application logic and domain models |
| [Angular Router](https://angular.dev/guide/routing) | Navigation between domain, attribute, and option screens |
| [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms) | Form state, validation, and submission |
| [RxJS](https://rxjs.dev/) | Asynchronous HTTP and UI data flows |
| [SCSS](https://sass-lang.com/) | Responsive layout, themes, and component styling |
| [Node.js](https://nodejs.org/) / [npm](https://www.npmjs.com/) | Runtime and dependency management |
| [Angular CLI](https://angular.dev/tools/cli) | Development server, builds, and tests |

## 🚀 Features

### Domain management

- List all domains and display their status and number of related domains.
- Create a domain with its code and description.
- Edit an existing domain.
- Delete domains with a confirmation step.
- Display the backend message when deletion is blocked by attributes or relationships.

### Related domains

- Manage domain relationships while creating or editing a domain.
- Keep the relationship editor collapsed by default to preserve screen space.
- Expand the section to see available and linked domains side by side.
- Add and remove relationships before saving.
- Prevent the current domain from appearing as an available relationship.

### Attribute management

- List attributes inside the domain editing screen.
- Create and edit attributes with code, description, type, and required status.
- Support `NUMBER`, `DECIMAL`, `TEXT`, `DATE`, `DATE_TIME`, `MONEY`, `OPTION`, and `JSON` types.
- Delete attributes with confirmation.
- Surface backend validation messages when an attribute cannot be deleted.

### Option list management

- Create option lists for `OPTION` attributes.
- Edit option code, description, and values.
- Add and remove value rows while editing.
- Delete option lists with confirmation.
- Display API messages when an option is still referenced by another record.

### User experience

- Light and dark themes persisted in browser local storage.
- Responsive layout for desktop and smaller screens.
- Clear loading, validation, confirmation, and error states.
- Dedicated routes for each editing workflow.

## 📁 Project structure

```text
src/
├── app/
│   ├── models/              # Domain, attribute, and option interfaces
│   ├── pages/
│   │   ├── domain-list/     # Domain table and delete actions
│   │   ├── domain-form/     # Domain form and related-domain editor
│   │   ├── attribute-form/  # Attribute create/edit workflow
│   │   └── option-form/     # Option list create/edit workflow
│   ├── services/            # HTTP services for API resources
│   ├── app.routes.ts        # Application routes
│   ├── app.ts               # Root component and theme handling
│   └── app.html             # Application shell
├── styles.scss              # Global layout, themes, and shared components
├── main.ts                  # Angular bootstrap entry point
└── index.html               # Browser entry document
angular.json                # Angular CLI configuration
package.json                # Scripts and dependencies
package-lock.json           # Locked dependency versions
└── README.md                # Project documentation
```

### Main navigation flow

```text
Domains
├── Create domain
│   ├── Related domains
│   └── Save domain
└── Edit domain
    ├── Related domains
    ├── Attributes
    │   ├── Add attribute
    │   └── Edit attribute
    │       └── OPTION → Add/Edit/Delete option
    └── Delete domain
```

## 🧭 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) installed;
- npm, usually included with Node.js;
- The `rkd-domain-core` backend running at `http://localhost:8080`.

### Install dependencies

From the project root:

```bash
npm install
```

### Start the development server

```bash
npm start
```

The application will be available at:

```text
http://localhost:4200
```

The frontend expects the backend API at:

```text
http://localhost:8080
```

Start the backend and its PostgreSQL database before creating or loading data through the interface.

### Production build

```bash
npm run build
```

The generated files are placed in the Angular `dist/` directory.

## 🔌 API integration

The frontend currently communicates with these backend resources:

| Resource | Base path | Main operations |
| --- | --- | --- |
| Domains | `/domain` | List, create, update, delete |
| Attributes | `/attribute` | Create, update, delete |
| Options | `/option` | Find, create, update, delete |

Domain relationships are sent using IDs:

```json
{
  "code": "DENGUE",
  "description": "Dengue",
  "relatedDomainIds": [2, 3]
}
```

Backend errors are read from the API response and displayed to the user, including `INVALID_ACTION` responses caused by existing attributes, relationships, or option references.

## 📦 Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Angular development server |
| `npm run build` | Create a production build |
| `npm run watch` | Rebuild continuously in development mode |
| `npm test` | Run the Angular test suite |
| `npm run ng -- <command>` | Execute an Angular CLI command |

## 📄 License

This project is distributed under the terms described in [LICENSE](LICENSE).
