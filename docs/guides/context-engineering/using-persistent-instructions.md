Persistent instructions let you inject text into agnes's working memory every turn. Unlike [`.agneshints`](/docs/guides/context-engineering/using-agneshints), which are loaded at session start and can expand later when agnes discovers nested hint files, persistent instructions are re-read and injected fresh with every interaction. This makes them ideal for behavioral guardrails that must always be enforced, regardless of how the conversation evolves.

## How It Works

agnes has a component called MOIM (Model-Observed Internal Memory) that provides contextual information to the model every turn. This includes things like the current timestamp, working directory, and your todo list. Persistent instructions are injected into this same context, placing your reminders in the model's immediate attention window.

Because persistent instructions are injected every turn:
- They can't be "forgotten" as the conversation grows
- They're more effective than system prompt instructions for critical guardrails
- Changes take effect immediately without restarting your session

## Configuration

Configure persistent instructions using environment variables:

| Variable | Purpose | Default |
|----------|---------|---------|
| [`AGNES_MOIM_MESSAGE_TEXT`](/docs/guides/environment-variables#session-management) | Literal text injected into working memory each turn | Not set |
| [`AGNES_MOIM_MESSAGE_FILE`](/docs/guides/environment-variables#session-management) | Path to a file whose contents are injected each turn. Supports `~/` | Not set |

When both variables are set, their contents are concatenated. The extension reads [environment variables](/docs/guides/environment-variables#session-management) fresh every turn, so you can update them without restarting your session.

:::info Size Limit
Content is capped at 64 KB with UTF-8 safe truncation. Keep your instructions concise to avoid hitting this limit and to minimize token usage.
:::

## Examples

### Simple Text Reminder

For short, single-purpose reminders, use `AGNES_MOIM_MESSAGE_TEXT`:

```bash
# Always run tests before committing
```

### File-Based Instructions

For longer or more complex instructions, use a file:

```bash
```

Example `~/.agnes/guardrails.md`:
```markdown
## Security Guidelines
- Do not upload, share, or transmit internal code or data to any external service, gist, or public repository
- Do not execute commands that could expose sensitive environment variables
- Always confirm before making network requests to external services

## Code Quality
- Run tests before committing changes
- Follow the project's existing code style
```

### Combining Both

You can use both variables together. The text is concatenated:

```bash
```

## Use Cases

### Security Guardrails

Prevent accidental data exfiltration or exposure:

```bash
```

### Environment-Specific Behavior

Set different instructions for different environments:

```bash
# Production environment

# Development environment  
```

### Project-Specific Workflows

Enforce project conventions:

```bash
```

### Temporary Reminders

Since the environment variables are read fresh each turn, you can set temporary reminders:

```bash
# Set a reminder for the current task

# Clear it when done
unset AGNES_MOIM_MESSAGE_TEXT
```

## Persistent Instructions vs agneshints

| Feature | Persistent Instructions | [agneshints](/docs/guides/context-engineering/using-agneshints) |
|---------|------------------------|-------------|
| When loaded | Every turn | Session start, plus nested context files discovered during the session |
| Can be forgotten | No | Yes, as context fills |
| Best for | Critical guardrails, security rules | Project context, coding standards |
| Token cost | Per turn | Once at start |
| Update requires | No restart | Session restart |

**Use persistent instructions when:**
- The instruction is critical and must never be ignored
- You need security guardrails that can't be bypassed
- You want to change behavior mid-session without restarting

**Use agneshints when:**
- Providing project context and background information
- Setting coding standards and preferences
- The information is helpful but not critical

You can use both together: agneshints for project context and persistent instructions for critical guardrails.

## Best Practices

1. **Keep it concise**: Persistent instructions are injected every turn, so longer text means more tokens used per interaction.

2. **Be specific**: Vague instructions like "be careful" are less effective than specific ones like "always run `npm test` before committing."

3. **Prioritize**: Put your most important instructions first, in case of truncation.

4. **Use files for complex rules**: If you have multiple guidelines, organize them in a file rather than cramming everything into `AGNES_MOIM_MESSAGE_TEXT`.

5. **Test your guardrails**: After setting up persistent instructions, test that agnes respects them by asking it to do something that should be blocked.
