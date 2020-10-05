# find-usigned-commits

The DARMA-tasking/find-usigned-commits/ is a JavaScript action that checks if there are any unsigned commits in PR.

## Workflow example

```yml
name: PR checks (unsigned commits)

on:
  pull_request

jobs:
  check:
    name: Find unsigned commits
    runs-on: ubuntu-latest
    steps:
      - uses: DARMA-tasking/find-usigned-commits@master
        with:
          repo_owner: ${{ github.event.pull_request.repo.owner.login }}
          repo_name: ${{ github.event.pull_request.repo.name }}
          pr_number: ${{ github.event.pull_request.number }}
```

## Development

Install the dependencies

```bash
$ npm install
```

Run lint

```bash
$ npm run lint

> find-unsigned-commits@1.0.0 lint /home/strz/repos/darma/src/find-unsigned-commits
> eslint .
```

## Distribution

Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules. Packaging the action will create a packaged action in the `dist/` folder.

Run prepare

```bash
$ npm run prepare
```

Since the packaged index.js is run from the `dist/` folder, it needs to be added

```bash
$ git add dist/
```

GitHub Actions will run the entry point from the `action.yml`

```yml
runs:
  using: "node12"
  main: "dist/index.js" # <== entry point
```

To do everything at once (lint and prepare) do

```bash
$ npm run all
```
