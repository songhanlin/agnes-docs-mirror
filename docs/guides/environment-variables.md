agnes supports various environment variables that allow you to customize its behavior. This guide provides a comprehensive list of available environment variables grouped by their functionality.

## Model Configuration

These variables control the [language models](/docs/getting-started/providers) and their behavior.

### Basic Provider Configuration

These are the minimum required variables to get started with agnes.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_PROVIDER` | Specifies the LLM provider to use | [See available providers](/docs/getting-started/providers#available-providers) | None (must be [configured](/docs/getting-started/providers#configure-provider-and-model)) |
| `AGNES_MODEL` | Specifies which model to use from the provider | Model name (e.g., "gpt-4", "claude-sonnet-4-20250514") | None (must be [configured](/docs/getting-started/providers#configure-provider-and-model)) |
| `AGNES_FAST_MODEL` | Overrides the provider's default fast model used for auxiliary calls (tool-selection, classification, session titles) | Model name (e.g., "gpt-4o-mini", "google/gemini-2.5-flash") | Provider-specific default |
| `AGNES_TEMPERATURE` | Sets the [temperature](https://medium.com/@kelseyywang/a-comprehensive-guide-to-llm-temperature-%EF%B8%8F-363a40bbc91f) for model responses | Float between 0.0 and 1.0 | Model-specific default |
| `AGNES_MAX_TOKENS` | Sets the maximum number of tokens for each model response (truncates longer responses) | Positive integer (e.g., 4096, 8192) | Model-specific default |

**Examples**

```bash
# Basic model configuration

# Override the fast model used for auxiliary calls (tool-selection, classification, etc.)

# Set a lower limit for shorter interactions

# Set a higher limit for tasks requiring longer output (e.g. code generation)
```

### Advanced Provider Configuration

These variables are needed when using custom endpoints, enterprise deployments, or specific provider implementations.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_PROVIDER__TYPE` | The specific type/implementation of the provider | [See available providers](/docs/getting-started/providers#available-providers) | Derived from AGNES_PROVIDER |
| `AGNES_PROVIDER__HOST` | Custom API endpoint for the provider | URL (e.g., "https://api.openai.com") | Provider-specific default |
| `AGNES_PROVIDER__API_KEY` | Authentication key for the provider | API key string | None |
| `GEMINI3_THINKING_LEVEL` | Sets the [thinking level](/docs/getting-started/providers#gemini-3-thinking-levels) for Gemini 3 models globally | `low`, `high` | `low` |

**Examples**

```bash
# Advanced provider configuration
```

### Custom Model Definitions

Define custom model configurations with provider-specific parameters and context limits. This is useful for enabling provider beta features (like extended context windows) or configuring models with specific settings.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_PREDEFINED_MODELS` | Define custom model configurations | JSON array of model objects | None |

**Model Configuration Fields:**

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | No | number | Optional numeric identifier |
| `name` | Yes | string | Model name used to reference this configuration |
| `provider` | Yes | string | Provider name (e.g., "databricks", "openai", "anthropic") |
| `alias` | No | string | Display name for the model |
| `subtext` | No | string | Additional descriptive text |
| `context_limit` | No | number | Override the default context window size in tokens |
| `request_params` | No | object | Provider-specific parameters included in API requests |

:::info
The `id`, `alias`, and `subtext` fields are currently not used.
:::

When a custom model's `context_limit` is specified, it takes precedence over pattern-matching but can still be overridden by explicit environment variables like [`AGNES_CONTEXT_LIMIT`](#model-context-limit-overrides).

**Examples**

```bash
# Enable Anthropic's 1M context window with beta header
  {
    "id": 1,
    "name": "claude-sonnet-4-1m",
    "provider": "anthropic",
    "alias": "Claude Sonnet 4 (1M context)",
    "subtext": "Anthropic",
    "context_limit": 1000000,
    "request_params": {
      "anthropic_beta": ["context-1m-2025-08-07"]
    }
  }
]'

# Define multiple custom models
  {
    "id": 1,
    "name": "gpt-4-custom",
    "provider": "openai",
    "alias": "GPT-4 (200k)",
    "context_limit": 200000
  },
  {
    "id": 2,
    "name": "internal-model",
    "provider": "databricks",
    "alias": "Internal Model (500k)",
    "context_limit": 500000
  }
]'

# Gemini 3 with high thinking level
  {
    "name": "gemini-3-pro",
    "provider": "google",
    "request_params": {"thinking_level": "high"}
  }
]'
```

Custom context limits and request parameters are applied when the model is used. Custom context limits are displayed in agnes CLI's [token usage indicator](/docs/guides/sessions/smart-context-management#token-usage).

### Claude Thinking Configuration

These variables control Claude's reasoning behavior. Supported on Anthropic and Databricks providers.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `CLAUDE_THINKING_TYPE` | Controls Claude reasoning mode | `adaptive`, `enabled`, `disabled` | `adaptive` for Claude 4.6+ models, otherwise `disabled` |
| `CLAUDE_THINKING_BUDGET` | Maximum tokens allocated for Claude's internal reasoning process when `CLAUDE_THINKING_TYPE=enabled` | Positive integer (minimum 1024) | 16000 |

**Examples**

```bash
# Claude 4.6 adaptive thinking

# Explicit extended thinking with the default budget

# Explicit extended thinking with a larger budget for complex tasks

# Disable Claude thinking entirely
```

:::tip Viewing Thinking Output
To see Claude's thinking output in the **CLI**, you also need to set `AGNES_CLI_SHOW_THINKING=1`. In **agnes Desktop**, thinking output is shown automatically in a collapsible "Show reasoning" toggle.
:::

### Planning Mode Configuration

These variables control agnes's [planning functionality](/docs/guides/context-engineering/creating-plans).

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_PLANNER_PROVIDER` | Specifies which provider to use for planning mode | [See available providers](/docs/getting-started/providers#available-providers) | Falls back to AGNES_PROVIDER |
| `AGNES_PLANNER_MODEL` | Specifies which model to use for planning mode | Model name (e.g., "gpt-4", "claude-sonnet-4-20250514")| Falls back to AGNES_MODEL |

**Examples**

```bash
# Planning mode with different model
```

### Provider Retries

Configurable retry parameters for LLM providers. 

#### AWS Bedrock

| Variable | Purpose | Default |
|---------------------|-------------|---------|
| `BEDROCK_MAX_RETRIES` | The max number of retry attempts before giving up | 6 |
| `BEDROCK_INITIAL_RETRY_INTERVAL_MS` | How long to wait (in milliseconds) before the first retry | 2000 |
| `BEDROCK_BACKOFF_MULTIPLIER` | The factor by which the retry interval increases after each attempt | 2 (doubles every time) |
| `BEDROCK_MAX_RETRY_INTERVAL_MS` | The cap on the retry interval in milliseconds |  120000 |

**Examples**

```bash
```

#### Databricks

| Variable | Purpose | Default |
|---------------------|-------------|---------|
| `DATABRICKS_MAX_RETRIES` | The max number of retry attempts before giving up | 3 |
| `DATABRICKS_INITIAL_RETRY_INTERVAL_MS` | How long to wait (in milliseconds) before the first retry | 1000 |
| `DATABRICKS_BACKOFF_MULTIPLIER` | The factor by which the retry interval increases after each attempt | 2 (doubles every time) |
| `DATABRICKS_MAX_RETRY_INTERVAL_MS` | The cap on the retry interval in milliseconds |  30000 |

**Examples**

```bash
```


## Session Management

These variables control how agnes manages conversation sessions and context.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_CONTEXT_STRATEGY` | Controls how agnes handles context limit exceeded situations | "summarize", "truncate", "clear", "prompt" | "prompt" (interactive), "summarize" (headless) |
| `AGNES_MAX_TURNS` | [Maximum number of turns](/docs/guides/sessions/smart-context-management#maximum-turns) allowed without user input | Integer (e.g., 10, 50, 100) | 1000 |
| `AGNES_GATEWAY_MAX_TURNS` | Maximum number of turns for gateway sessions (e.g., Telegram). Overrides `AGNES_MAX_TURNS` for gateway traffic only, so chat platforms can keep a stricter cap than CLI/desktop sessions. | Integer (e.g., 5, 10, 25) | Falls back to `AGNES_MAX_TURNS`, then 5 |
| `AGNES_SUBAGENT_MAX_TURNS` | Sets the maximum turns allowed for a [subagent](/docs/guides/context-engineering/subagents) to complete before timeout. Can be overridden by [`settings.max_turns`](/docs/guides/recipes/recipe-reference#settings) in recipes or subagent tool calls. | Integer (e.g., 25) | 25 |
| `AGNES_MAX_BACKGROUND_TASKS` | Sets the maximum number of concurrent background [subagent](/docs/guides/context-engineering/subagents) tasks agnes can run at once | Integer (e.g., 1, 5, 10) | 5 |
| `CONTEXT_FILE_NAMES` | Specifies custom filenames for [hint/context files](/docs/guides/context-engineering/using-agneshints#custom-context-files) | JSON array of strings (e.g., `["CLAUDE.md", ".agneshints"]`) | `[".agneshints"]` |
| `AGNES_DISABLE_SESSION_NAMING` | Disables automatic AI-generated session naming; avoids the background model call and keeps the default "CLI Session" (agnes CLI) or "New Chat" (agnes Desktop) | "1", "true" (case-insensitive) to enable | false |
| `AGNES_DISABLE_TOOL_CALL_SUMMARY` | Disables the per-tool-call AI-generated summary title, keeping the fallback title instead. Saves one provider call per tool invocation. | "1", "true" (case-insensitive) to enable | false |
| `AGNES_PROMPT_EDITOR` | [External editor](/docs/guides/agnes-cli-commands#external-editor-mode) to use for composing prompts instead of CLI input | Editor command (e.g., "vim", "code --wait") | Unset (uses CLI input) |
| `AGNES_CLI_THEME` | [Theme](/docs/guides/agnes-cli-commands#themes) for CLI response  markdown | "light", "dark", "ansi" | "dark" |
| `AGNES_CLI_LIGHT_THEME` | Custom [bat theme](https://github.com/sharkdp/bat#adding-new-themes) for syntax highlighting when using light mode | bat theme name (e.g., "Solarized (light)", "OneHalfLight") | "GitHub" |
| `AGNES_CLI_DARK_THEME` | Custom [bat theme](https://github.com/sharkdp/bat#adding-new-themes) for syntax highlighting when using dark mode | bat theme name (e.g., "Dracula", "Nord") | "zenburn" |
| `AGNES_CLI_NEWLINE_KEY` | Customize the keyboard shortcut for [inserting newlines in CLI input](/docs/guides/agnes-cli-commands#keyboard-shortcuts) | Single character (e.g., "n", "m") | "j" (Ctrl+J) |
| `AGNES_CLI_SHOW_THINKING` | Shows model reasoning/thinking output in CLI responses. Some models (e.g., DeepSeek-R1, Kimi, Gemini) expose their internal reasoning process — this variable makes it visible in the CLI. | Set to any value to enable | Disabled |
| `AGNES_RANDOM_THINKING_MESSAGES` | Controls whether to show amusing random messages during processing | "true", "false" | "true" |
| `AGNES_CLI_SHOW_COST` | Toggles display of model cost estimates in CLI output | "1", "true" (case-insensitive) to enable | false |
| `AGNES_MAX_CODE_BLOCK_LINES` | Line count threshold before code blocks are truncated in CLI output. Full content is saved to a temp file. | Positive integer | 50 |
| `AGNES_TRUNCATED_SHOW_LINES` | Number of lines shown before the "... (N more lines)" message when a code block is truncated | Positive integer | 20 |
| `AGNES_NO_CODE_TRUNCATION` | Disable code block truncation entirely — all code blocks are shown in full | "1", "true" (case-insensitive) to enable | false |
| `AGNES_AUTO_COMPACT_THRESHOLD` | Set the percentage threshold at which agnes [automatically summarizes your session](/docs/guides/sessions/smart-context-management#automatic-compaction). | Float between 0.0 and 1.0 (disabled at 0.0) | 0.8 |
| `AGNES_TOOL_CALL_CUTOFF` | Number of tool calls to keep in full detail before summarizing older tool outputs to help maintain efficient context usage  | Integer (e.g., 5, 10, 20) | 10 |
| `AGNES_MOIM_MESSAGE_TEXT` | Injects persistent text into agnes's [working memory](/docs/guides/context-engineering/using-persistent-instructions) every turn. Useful for behavioral guardrails or persistent reminders. | Any text string | Not set |
| `AGNES_MOIM_MESSAGE_FILE` | Path to a file whose contents are injected into agnes's [working memory](/docs/guides/context-engineering/using-persistent-instructions) every turn. Supports `~/`. Max 64 KB per file. | File path | Not set |

**Examples**

```bash
# Automatically summarize when context limit is reached

# Always prompt user to choose (default for interactive mode)

# Set a low limit for step-by-step control

# Set a moderate limit for controlled automation

# Set a reasonable limit for production

# Raise the per-gateway cap without changing CLI/desktop limits
# (applies to Telegram and other gateway sessions only)

# Customize the default subagent turn limit
# Note: This can be overridden per-recipe or per-subagent using the max_turns setting

# Use multiple context files

# Disable automatic AI-generated session naming (useful for CI/headless runs)

# Use vim for composing prompts

# Set the ANSI theme for the session

# Customize syntax highlighting themes (uses bat themes)

# Use Ctrl+N instead of Ctrl+J for newline

# Disable random thinking messages for less distraction

# Show reasoning/thinking output from models that support it (e.g., DeepSeek-R1, Kimi, Gemini)

# Enable model cost display in CLI

# Show code blocks up to 100 lines before truncating

# Disable code block truncation entirely (show all lines inline)

# Automatically compact sessions when 60% of available tokens are used

# Keep more tool calls in full detail (useful for debugging or verbose workflows)

# Inject a persistent reminder into agnes's working memory every turn

# Load persistent instructions from a file (supports ~/)
```

### Model Context Limit Overrides

These variables allow you to override the default context window size (token limit) for your models. This is particularly useful when using [LiteLLM proxies](https://docs.litellm.ai/docs/providers/litellm_proxy) or custom models that don't match agnes's predefined model patterns.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_CONTEXT_LIMIT` | Override context limit for the main model | Integer (number of tokens) | Model-specific default or 128,000 |
| `AGNES_INPUT_LIMIT` | Override input prompt limit for ollama requests (maps to `num_ctx`) | Integer (number of tokens) | Falls back to `AGNES_CONTEXT_LIMIT` or model default |
| `AGNES_PLANNER_CONTEXT_LIMIT` | Override context limit for the [planner model](/docs/guides/context-engineering/creating-plans) | Integer (number of tokens) | Falls back to `AGNES_CONTEXT_LIMIT` or model default |

**Examples**

```bash
# Set context limit for main model (useful for LiteLLM proxies)
# Override ollama input prompt limit

# Set context limit for planner
```

For more details and examples, see [Model Context Limit Overrides](/docs/guides/sessions/smart-context-management#model-context-limit-overrides).

## Tool Configuration

These variables control how agnes handles [tool execution](/docs/guides/managing-tools/agnes-permissions) and [tool management](/docs/guides/managing-tools/).

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_MODE` | Controls how agnes handles tool execution | "auto", "approve", "chat", "smart_approve" | "smart_approve" |
| `AGNES_TOOLSHIM` | Enables/disables tool call interpretation | "1", "true" (case-insensitive) to enable | false |
| `AGNES_TOOLSHIM_OLLAMA_MODEL` | Specifies the model for [tool call interpretation](/docs/experimental/ollama) | Model name (e.g. llama3.2, qwen2.5) | System default |
| `AGNES_CLI_MIN_PRIORITY` | Controls verbosity of [tool output](/docs/guides/managing-tools/adjust-tool-output) | Float between 0.0 and 1.0 | 0.0 |
| `AGNES_CLI_TOOL_PARAMS_TRUNCATION_MAX_LENGTH` | Maximum length for tool parameter values before truncation in CLI output (not in debug mode) | Integer | 40 |
| `AGNES_DEBUG` | Enables debug mode to show full tool parameters without truncation. Can also be toggled during a session using the `/r` [slash command](/docs/guides/agnes-cli-commands#slash-commands) | "1", "true" (case-insensitive) to enable | false |
| `AGNES_SEARCH_PATHS` | Prepends additional directories to PATH for extension commands | JSON array of paths (for example, `["/usr/local/bin", "~/custom/bin"]`) | System PATH only |
| `AGNES_MAX_TOOL_RESPONSE_SIZE` | Maximum character count for a single tool response before it is written to a temporary file instead of being included inline in the conversation | Positive integer (e.g., 100000, 200000) | 200000 |
| `AGNES_SHELL` | Overrides the shell used for Developer extension shell commands | Shell executable path or name (for example, `/bin/zsh`, `pwsh`, `C:\cygwin64\bin\bash.exe`) | Unix: `/bin/bash` if present, otherwise `$SHELL`, otherwise `sh`. Windows: `cmd` |

**Examples**

```bash
# Enable tool interpretation

# Add custom tool directories for extensions

# Lower the tool response size limit for smaller-context models

# Use zsh for Developer extension shell commands
```

```bat
REM Windows: use a POSIX-like shell instead of cmd.exe
set AGNES_SHELL=C:\cygwin64\bin\bash.exe
```

### Enhanced Code Editing

These variables configure [AI-powered code editing](/docs/guides/enhanced-code-editing) for the Developer extension's `str_replace` tool. All three variables must be set and non-empty for the feature to activate.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_EDITOR_API_KEY` | API key for the code editing model | API key string | None |
| `AGNES_EDITOR_HOST` | API endpoint for the code editing model | URL (e.g., "https://api.openai.com/v1") | None |
| `AGNES_EDITOR_MODEL` | Model to use for code editing | Model name (e.g., "gpt-4o", "claude-sonnet-4") | None |

**Examples**

This feature works with any OpenAI-compatible API endpoint, for example:

```bash
# OpenAI configuration

# Anthropic configuration (via OpenAI-compatible proxy)

# Local model configuration
```

## Security and Privacy

These variables control security features, credential storage, and anonymous usage data collection.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_ALLOWLIST` | Controls which extensions can be loaded | URL for [allowed extensions](/docs/guides/allowlist) list | Unset |
| `AGNES_DISABLE_KEYRING` | Disables the system keyring for secret storage | Set to any value (e.g., "1", "true", "yes") to disable. The actual value doesn't matter, only whether the variable is set. | Unset (keyring enabled) |
| `SECURITY_PROMPT_ENABLED` | Enable [prompt injection detection](/docs/guides/security/prompt-injection-detection) to identify potentially harmful commands | true/false | false |
| `SECURITY_PROMPT_THRESHOLD` | Sensitivity threshold for prompt injection detection (higher = stricter) | Float between 0.01 and 1.0 | 0.8 |
| `SECURITY_PROMPT_CLASSIFIER_ENABLED` | Enable ML-based prompt injection detection for advanced threat identification | true/false | false |
| `SECURITY_PROMPT_CLASSIFIER_ENDPOINT` | Classification endpoint URL for ML-based prompt injection detection | URL (e.g., "https://api.example.com/classify") | Unset |
| `SECURITY_PROMPT_CLASSIFIER_TOKEN` | Authentication token for `SECURITY_PROMPT_CLASSIFIER_ENDPOINT` | String | Unset |
| `AGNES_TELEMETRY_ENABLED` | Enable or disable [anonymous usage data collection](/docs/guides/usage-data) | true/false | false |

**Examples**

```bash
# Enable prompt injection detection with default threshold

# Enable with custom threshold (stricter)

# Enable ML-based detection with external endpoint

# Control anonymous usage data collection
```

:::tip
When the keyring is disabled (or cannot be accessed and agnes [falls back to file-based storage](/docs/troubleshooting/known-issues#keyring-cannot-be-accessed-automatic-fallback)), secrets are stored here:

* macOS/Linux: `~/.config/agnes/secrets.yaml`
* Windows: `%APPDATA%\Block\agnes\config\secrets.yaml`
:::

### macOS Sandbox for agnes Desktop

Optional [macOS sandbox](/docs/guides/sandbox) for agnes Desktop that restricts file access, network connections, and process execution using Apple's `sandbox-exec` technology.

| Variable | Purpose | Values | Default |
|----------|---------|--------|---------|
| `AGNES_SANDBOX` | Enable the sandbox with [customizable security controls](/docs/guides/sandbox#configuration) | `true` or `1` to enable | `false` |

## Network Configuration

These variables configure network proxy settings for agnes.

### OAuth Callback Port

By default, agnes starts a temporary local server on a random port to receive OAuth callbacks. Enterprise identity providers that require exact `redirect_uri` matching (and forbid wildcard ports) will reject the callback. Set this variable to use a fixed port instead.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_OAUTH_CALLBACK_PORT` | Fixed port for the local OAuth callback server | Port number (e.g., 8080, 9999) | Random (OS-assigned) |

**Examples**

```bash
# Use a fixed port so your IdP's redirect_uri whitelist can match exactly
```

Then register the appropriate redirect URI in your identity provider:
- For MCP server OAuth: `http://127.0.0.1:8080/oauth_callback`
- For Databricks OAuth: `http://localhost:8080`

### HTTP Proxy

agnes supports standard HTTP proxy environment variables for users behind corporate firewalls or proxy servers.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `HTTP_PROXY` | Proxy URL for HTTP connections | URL (e.g., `http://proxy.company.com:8080`) | None |
| `HTTPS_PROXY` | Proxy URL for HTTPS connections (takes precedence over `HTTP_PROXY` when both are set) | URL (e.g., `http://proxy.company.com:8080`) | None |
| `NO_PROXY` | Hosts to bypass the proxy | Comma-separated list (e.g., `localhost,127.0.0.1,.internal.com`) | None |

**Examples**

```bash
# Configure proxy for all connections

# Or with authentication
```

Alternatively, proxy settings can be configured through your operating system's network settings. If you encounter connection issues, see [Corporate Proxy or Firewall Issues](/docs/troubleshooting/known-issues#corporate-proxy-or-firewall-issues) for troubleshooting steps.

## Observability

Beyond agnes's built-in [logging system](/docs/guides/logs), you can export telemetry to external observability platforms for advanced monitoring, performance analysis, and production insights.

### Observability Configuration

Configure agnes to export telemetry to any [OpenTelemetry](https://opentelemetry.io/docs/) compatible platform.

To enable export, set a collector endpoint:

```bash
```

You can control each signal (traces, metrics, logs) independently with `OTEL_{SIGNAL}_EXPORTER`:

| Variable pattern | Purpose | Values |
|---|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Base OTLP endpoint (applies `/v1/traces`, etc.) | URL |
| `OTEL_EXPORTER_OTLP_{SIGNAL}_ENDPOINT` | Override endpoint for a specific signal | URL |
| `OTEL_{SIGNAL}_EXPORTER` | Exporter type per signal | `otlp`, `console`, `none` |
| `OTEL_SDK_DISABLED` | Disable all OTel export | `true` |

Additional variables like `OTEL_SERVICE_NAME`, `OTEL_RESOURCE_ATTRIBUTES`,
and `OTEL_EXPORTER_OTLP_TIMEOUT` are also supported.
See the [OTel environment variable spec][otel-env] for the full list.

**Examples:**
```bash
# Export everything to a local collector

# Export only traces, disable metrics and logs

# Debug traces to console (no collector needed)

# Sample 10% of traces (reduce volume in production)
```

[otel-env]: https://opentelemetry.io/docs/specs/otel/configuration/sdk-environment-variables/

### Langfuse Integration

These variables configure the [Langfuse integration for observability](/docs/tutorials/langfuse).

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `LANGFUSE_PUBLIC_KEY` | Public key for Langfuse integration | String | None |
| `LANGFUSE_SECRET_KEY` | Secret key for Langfuse integration | String | None |
| `LANGFUSE_URL` | Custom URL for Langfuse service | URL String | Default Langfuse URL |
| `LANGFUSE_INIT_PROJECT_PUBLIC_KEY` | Alternative public key for Langfuse | String | None |
| `LANGFUSE_INIT_PROJECT_SECRET_KEY` | Alternative secret key for Langfuse | String | None |

## agnes Server

These variables configure the `agnesd` server process. They are most often used when [running `agnesd` on a remote machine](/docs/guides/remote-agnes-server) and connecting agnes Desktop to it, but they apply to any `agnesd` invocation.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_HOST` | Interface the server binds to. Use `0.0.0.0` to accept connections from other machines; `localhost` or `127.0.0.1` restricts to the local machine. | Hostname or IP | `127.0.0.1` |
| `AGNES_PORT` | TCP port the server listens on | Port number | `3000` |
| `AGNES_TLS` | Enable TLS with a self-signed certificate. Required when connecting agnes Desktop to a remote `agnesd`. | `true`, `false` | `true` |
| `AGNES_SERVER__SECRET_KEY` | Shared secret required in the `X-Secret-Key` header on all client requests. When set, it is also enforced on the `agnes serve` ACP endpoint. | Secret string | Random (auto-generated) |

**Examples**

```bash
# Start a agnesd server reachable on the local network over TLS
agnesd agent
```

When TLS is enabled, `agnesd` prints a `AGNESD_CERT_FINGERPRINT=...` line on startup. Clients (such as agnes Desktop) need this fingerprint to verify the self-signed certificate. See [Running a Remote agnes Server](/docs/guides/remote-agnes-server) for the full setup.

## Recipe Configuration

These variables control recipe discovery and management.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_RECIPE_PATH` | Additional directories to search for recipes | Colon-separated paths on Unix, semicolon-separated on Windows | None |
| `AGNES_RECIPE_GITHUB_REPO` | GitHub repository to search for recipes | Format: "owner/repo" (e.g., "aaif-goose/agnes-recipes") | None |
| `AGNES_RECIPE_RETRY_TIMEOUT_SECONDS` | Global timeout for recipe success check commands | Integer (seconds) | Recipe-specific default |
| `AGNES_RECIPE_ON_FAILURE_TIMEOUT_SECONDS` | Global timeout for recipe on_failure commands | Integer (seconds) | Recipe-specific default |

**Examples**

```bash
# Add custom recipe directories

# Configure GitHub recipe repository

# Set global recipe timeouts
```

## Development & Testing

These variables are primarily used for development, testing, and debugging agnes itself.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_PATH_ROOT` | Override the root directory for all agnes data, config, and state files | Absolute path to directory | Platform-specific defaults |

**Default locations:**
- macOS: `~/Library/Application Support/Block/agnes/`
- Linux: `~/.local/share/agnes/`
- Windows: `%APPDATA%\Block\agnes\`

When set, agnes creates `config/`, `data/`, and `state/` subdirectories under the specified path. Useful for isolating test environments, running multiple configurations, or CI/CD pipelines.

**Examples**

```bash
# Temporary test environment

# Isolated environment for a single command
AGNES_PATH_ROOT="/tmp/agnes-isolated" agnes run --recipe my-recipe.yaml

# CI/CD usage
AGNES_PATH_ROOT="$(mktemp -d)" agnes run --recipe integration-test.yaml

# Use with developer tools
AGNES_PATH_ROOT="/tmp/agnes-test" ./scripts/agnes-db-helper.sh status
```

## Variables Controlled by agnes

These variables are automatically set by agnes during command execution.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `AGNES_TERMINAL` | Indicates that a command is being executed by agnes, enables [customizing shell behavior](#customizing-shell-behavior) | "1" when set | Unset |
| `AGENT` | Generic agent identifier for cross-tool compatibility, enables tools and scripts to detect when they're being run by agnes | "agnes" when set | Unset |
| `AGENT_SESSION_ID` | The current session ID for [session-isolated workflows](#using-session-ids-in-workflows), automatically available to STDIO extensions and the Developer extension shell commands | Session ID string (e.g., `20260217_5`) | Unset (only set in extension/shell contexts) |

### Customizing Shell Behavior

Sometimes you want agnes to use different commands or have different shell behavior than your normal terminal usage. Common use cases include:
- Skipping expensive shell initialization (e.g. syntax highlighting, custom prompts)
- Blocking interactive commands that would hang the agent (e.g., `git commit`)
- Redirecting to agent-friendly tools (e.g., `rg` instead of `find`)
- Building cross-agent tools and scripts that detect AI agent execution
- Integrating with MCP servers and LLM gateways

This is most useful when using agnes CLI, where shell commands are executed directly in your terminal environment.

**How it works:**

agnes provides the `AGNES_TERMINAL` and `AGENT` variables you can use to detect whether agnes is the executing agent.

1. When agnes runs commands:
   - `AGNES_TERMINAL` is automatically set to "1"
   - `AGENT` is automatically set to "agnes"
2. Your shell configuration can detect this and change behavior while keeping your normal terminal usage unchanged

**Examples:**

```bash
# In ~/.zshenv (for zsh users) or ~/.bashrc (for bash users)

# Block git commit when run by agnes
if [[ -n "$AGNES_TERMINAL" ]]; then
  git() {
    if [[ "$1" == "commit" ]]; then
      echo "❌ BLOCKED: git commit is not allowed when run by agnes"
      return 1
    fi
    command git "$@"
  }
fi
```

```bash
# Guide agnes toward better tool choices
if [[ -n "$AGNES_TERMINAL" ]]; then
  alias find="echo 'Use rg instead: rg --files | rg <pattern> for filenames, or rg <pattern> for content search'"
fi
```

```bash
# Detect AI agent execution using standard naming convention
if [[ -n "$AGENT" ]]; then
  echo "Running under AI agent: $AGENT"
  # Apply agent-specific behavior if needed
  if [[ "$AGENT" == "agnes" ]]; then
    echo "Detected agnes - applying agnes-specific settings"
  fi
fi
```

### Using Session IDs in Workflows

STDIO extensions (local extensions that communicate via standard input/output) and the Developer extension's shell commands automatically receive the `AGENT_SESSION_ID` environment variable. This enables you to create session-isolated workflows and make it easier to:
- Coordinate work across multiple tool calls using session-isolated handoff paths
- Isolate worktrees or temporary files by session
- Debug correlation between artifacts and session history

The following example shows how a recipe might use the session ID to hand off information between steps:

```bash
# Create session-specific handoff directory
mkdir -p ~/Desktop/${AGENT_SESSION_ID}/handoff
echo "Results from step 1" > ~/Desktop/${AGENT_SESSION_ID}/handoff/output.txt

# Later steps in the recipe can read from the same location
cat ~/Desktop/${AGENT_SESSION_ID}/handoff/output.txt
```

## Environment Variable Passthrough

The Developer extension's `shell` tool inherits environment variables from your session. This enables workflows that depend on environment configuration, such as authenticated CLI operations and build processes.

See [Environment Variables in Shell Commands](/docs/mcp/developer-mcp#environment-variables-in-shell-commands) for details.

## Enterprise Environments

When deploying agnes in enterprise environments, administrators might need to control behavior and infrastructure, or enforce consistent settings across teams. The following environment variables are commonly used:

**Network and Infrastructure** - Control how agnes connects to external services and internal infrastructure:
- [Network Configuration](#network-configuration) - Proxy configuration and network settings
- [Advanced Provider Configuration](#advanced-provider-configuration) - Point to internal LLM endpoints (e.g., Databricks, custom deployments)
- [Model Context Limit Overrides](#model-context-limit-overrides) - Configure context limits for LiteLLM proxies and custom models

**Security and Privacy** - Control security and privacy features:
- [Security and Privacy](#security-and-privacy) - Manage security and privacy settings such as extension loading, secrets storage, and usage data collection

**Compliance and Monitoring** - Track usage and export telemetry for auditing:

- [Observability](#observability) - Export telemetry to monitoring platforms (OTLP, Langfuse)

## Notes

- Environment variables take precedence over configuration files.
- For security-sensitive variables (like API keys), consider using the system keyring instead of environment variables.
- Some variables may require restarting agnes to take effect.
- When using the planning mode, if planner-specific variables are not set, agnes will fall back to the main model configuration.
