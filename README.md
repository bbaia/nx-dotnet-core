# Nx Plugin for .NET Core

[![unit tests](https://github.com/bbaia/nx-dotnet-core/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/bbaia/nx-dotnet-core/actions/workflows/unit-tests.yml)
[![e2e tests](https://github.com/bbaia/nx-dotnet-core/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/bbaia/nx-dotnet-core/actions/workflows/e2e-tests.yml)

> [Nx Plugin](https://nx.dev) to generate, run, build and test [.NET Core](https://dotnet.microsoft.com/) projects inside your Nx workspace.

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/bbaia/nx-dotnet-core/master/images/nx-dotnet-core-logo.png" width="450"></p>

🔎 **Powerful, Extensible Dev Tools**

## Prerequisite

If you have not already:

- [Install .NET core](https://docs.microsoft.com/en-us/dotnet/core/install/)
- [Create an Nx workspace](https://github.com/nrwl/nx#creating-an-nx-workspace)

## Getting Started

### Install Plugin

```
npm install @bbaia/nx-dotnet-core --save-dev
```

### Generate a project

Run `nx g @bbaia/nx-dotnet-core:new` to generate a project using the [`dotnet new`](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-new) command.

You will be prompted for entering:

- The type of project (`application` or `library`)
- The .NET Core template to use (Use `dotnet new --list --type=Project` to list all installed project templates)
- The name of your project

You can skip the interactive prompt or customize all non-prompted options from the command line:

```
nx g @bbaia/nx-dotnet-core:new <app|lib> <.NET Core template> <your-project-name> --optionName optionValue
```

| Option             | Value    | Description                                                                    |
| ------------------ | -------- | ------------------------------------------------------------------------------ |
| `tags`             | `string` | Add tags to the project (used for linting).                                    |
| `directory`        | `string` | A directory where the project is placed.                                       |
| `unitTestTemplate` | `string` | The .NET Core template to use for unit tests (ex: 'mstest', 'nunit', 'xunit'). |

> Use [Nx Console](https://nx.dev/latest/angular/getting-started/console) to spend less time looking up command line arguments!

Exemple to generate an ASP.NET Core Web API project with an NUnit test project :

```
nx g @bbaia/nx-dotnet-core:new app webapi api --unitTestTemplate nunit
```

### Manage a project

- Run `ng serve api` to serve the app. The app will automatically reload if you change any of the source files.
- Run `ng build api` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
- Run `nx test api` to execute the unit tests via `nunit`. Use the `--watch` flag to watch files for changes and rerun tests.

You will find more information on the generated `README.md` file.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Computation Memoization in the Cloud

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
