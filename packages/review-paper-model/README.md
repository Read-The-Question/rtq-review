# RTQ review paper model

Read-only server-side contracts for the RTQ content reviewer. This package owns
the boundary between a validated `rtq-content` checkout and review-facing paper
data; it deliberately exports no TOML or asset write operation.

The current foundation provides serializable model types, a safe content-root
status check, and containment-checked resolution for existing paper collections
and TOML files. Collection discovery and TOML parsing are added by the next PRD
task.

## Checks

```bash
pnpm format:check
pnpm types
pnpm test
```
