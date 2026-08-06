# Issue tracker: GitHub

Issues and PRDs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## Wayfinding operations

- Map: issue labelled `wayfinder:map`.
- Child ticket: issue labelled `wayfinder:<type>`, linked as a GitHub sub-issue where supported; otherwise include `Part of #<map>`.
- Blocking: GitHub native issue dependencies where supported; otherwise include `Blocked by: #<n>`.
- Claim: assign issue to driving developer before work.
- Resolve: comment resolution, close issue, append context pointer to map.

Use `gh issue create`, `gh issue view`, `gh issue comment`, `gh issue edit`, and `gh issue close`.
