# RabbitMQ Documentation: Dynamic Tutorial Code Loading – Proof of Concept

## 1. Overview

This proof of concept explores an approach to display executable code examples directly from the official [rabbitmq-tutorials](https://github.com/rabbitmq/rabbitmq-tutorials) repository within the RabbitMQ documentation website.

Currently, documentation pages may contain code snippets that are maintained separately from their corresponding executable source files. This can lead to duplicated code and inconsistencies when examples are updated.

The proposed approach fetches the actual source files from the tutorial repository and renders them directly in Docusaurus documentation pages.

The documentation and tutorial repositories remain independently maintained.

## 2. Implementation Workflow

The implementation follows this workflow:

1. Define tutorial names, source directories and filenames in a reusable configuration.
2. Fetch the corresponding files from the official RabbitMQ tutorials GitHub repository.
3. Save the downloaded files under a generated directory.
4. Import the generated source files into MDX pages using `raw-loader`.
5. Render the source code using Docusaurus `CodeBlock`.
6. Automatically execute the fetching script before starting the development server and before creating a production build.

## 3. Project Structure

The proof of concept introduces the following files and directories:

```text
project-root/
├── docs/
│   └── tutorial-basics/
│       ├── tutorial2.mdx
│       └── tutorial3.mdx
│
├── scripts/
│   └── fetch-tutorial-code.mjs
│
├── generated/
│   ├── tutorial2/
│   │   ├── new_task.py
│   │   └── worker.py
│   │
│   └── tutorial3/
│       ├── receive_logs.py
│       └── emit_log.py
│
├── package.json
└── README.md
```

### 3.1 Fetching Script

**File:** `scripts/fetch-tutorial-code.mjs`

A reusable Node.js script fetches tutorial source files from the official GitHub repository.

Tutorials and their source files are defined through a configuration object. Adding another tutorial requires only adding its configuration, without modifying the fetching logic.

The script creates the corresponding output directories and saves the downloaded source files using their original filenames.

### 3.2 Generated Source Files

**Directory:** `generated/`

Contains files downloaded automatically from the official tutorial repository.

These files are generated during development startup and production builds rather than maintained manually.

### 3.3 MDX Documentation Pages

The proof of concept currently demonstrates two tutorial pages:

- `docs/tutorial-basics/tutorial2.mdx` – Work Queues
- `docs/tutorial-basics/tutorial3.mdx` – Publish/Subscribe

Each MDX page imports its corresponding generated source files using `raw-loader` and displays them through Docusaurus `CodeBlock`.

This ensures that the displayed code comes from the actual executable tutorial source rather than a separately maintained copy.

## 4. Package Configuration

The following scripts are added to `package.json`:

```json
{
  "scripts": {
    "fetch:tutorials": "node scripts/fetch-tutorial-code.mjs",
    "prestart": "npm run fetch:tutorials",
    "prebuild": "npm run fetch:tutorials",
    "start": "docusaurus start",
    "build": "docusaurus build"
  }
}
```

The existing Docusaurus scripts and other package configuration are retained.

The `prestart` and `prebuild` lifecycle scripts ensure that the required source files are fetched before Docusaurus starts or builds.

## 5. Dependencies

The implementation uses `raw-loader` to import source files as text into MDX.

Install it using:

```bash
npm install raw-loader
```

The dependency is recorded in `package.json` and `package-lock.json`.

## 6. Running the Proof of Concept

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The following operations happen automatically:

- The fetching script executes.
- Tutorial source files are downloaded from GitHub.
- Generated files are made available to the MDX pages.
- Docusaurus starts the development server.

For a production build:

```bash
npm run build
```

The fetching script executes before the Docusaurus production build.

No manual source-file copying is required.

## 7. Current Demonstration

The implementation currently covers:

| Tutorial | Topic | Source files |
|---|---|---|
| Tutorial 2 | Work Queues | `new_task.py`, `worker.py` |
| Tutorial 3 | Publish/Subscribe | `receive_logs.py`, `emit_log.py` |

The same fetching mechanism can be extended to additional tutorials and programming languages by adding configuration entries.

## 8. Benefits

- **Single source of truth:** Documentation displays code from the executable tutorial repository.
- **Reduced duplication:** No need to maintain separate copies of code snippets in MDX files.
- **Consistency:** Documentation examples remain aligned with their corresponding source files whenever the fetching process runs.
- **Reusability:** A single fetching mechanism supports multiple tutorials and source files.
- **Independent repositories:** The documentation and executable tutorial repositories can continue to be maintained separately.
- **Simplified maintenance:** Adding another tutorial requires configuration rather than additional fetching logic.

## 9. Considerations and Future Improvements

- The current implementation requires network access during development startup and production builds.
- Files are currently fetched from the `main` branch. Pinning a specific commit SHA would improve build reproducibility.
- Error handling and caching can be extended for larger numbers of tutorials.
- The approach should be evaluated against the existing RabbitMQ website build pipeline and contribution