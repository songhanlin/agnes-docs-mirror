agnes provides a command-line interface (CLI) with several commands for managing sessions, configurations and extensions. This guide covers all available CLI commands and interactive session features.

## Flag Naming Conventions

agnes CLI follows consistent patterns for flag naming to make commands intuitive and predictable:

- **`--session-id`**: Used for session identifiers (e.g., `20251108_1`)
- **`--schedule-id`**: Used for schedule job identifiers (e.g., `daily-report`)
- **`-n, --name`**: Used for human-readable names
- **`--path`**: Used for file paths (legacy support)
- **`-o, --output`**: Used for output file paths
- **`-r, --resume` or `-r, --regex`**: Context-dependent (resume for sessions, regex for filters)
- **`-v, --verbose`**: Used for verbose output
- **`-l, --limit`**: Used for limiting result counts
- **`-f, --format`**: Used for specifying output formats
- **`-w, --working_dir`**: Used for working directory filters

### Core Commands

#### help
Display the help menu.

**Usage:**
```bash
agnes --help
```

---

#### configure
Configure agnes settings - providers, extensions, etc.

**Usage:**
```bash
agnes configure
```

:::tip Type to Filter
When selecting from menus in `agnes configure`, start typing to filter options in real-time. This works for lists of providers, extensions, and tools.
:::

---

#### info [options]
Shows agnes information, including the version, configuration file location, session storage, and logs.

**Options:**
- **`-v, --verbose`**: Show detailed configuration settings, including environment variables and enabled extensions

**Usage:**
```bash
agnes info
```

---

#### version
Check the current agnes version you have installed.

**Usage:**
```bash
agnes --version
```

---

#### update [options]
Update the agnes CLI to a newer version.

**Options:**
- **`--canary, -c`**: Update to the canary (development) version instead of the stable version
- **`--reconfigure, -r`**: Forces agnes to reset configuration settings during the update process

**Usage:**
```bash
# Update to latest stable version
agnes update

# Update to latest canary version
agnes update --canary

# Update and reconfigure settings
agnes update --reconfigure
```

---

#### completion
Generate shell-specific scripts to enable tab completion of agnes commands, subcommands, and options. The script is printed to stdout, so you need to redirect it to the appropriate location for your shell and then reload or source your shell configuration.

Once installed, you can:
- Press Tab to see available commands and subcommands
- Complete command names and flags automatically
- Discover options without checking `--help`

**Arguments:**
- **`<SHELL>`**: The shell to generate completions for. Supported shells: `bash`, `elvish`, `fish`, `nu`, `powershell`, `zsh`

**Usage:**
```bash
# Generate completion script for your shell (outputs to stdout)
agnes completion bash
agnes completion zsh
agnes completion fish
agnes completion nu
```

**Installation by Shell:**

<Tabs groupId="shells">
<TabItem value="zsh" label="Zsh" default>

Add this line to your `~/.zshrc`:

```bash
eval "$(agnes completion zsh)"
```

Then reload your shell:
```bash
source ~/.zshrc
```

</TabItem>
<TabItem value="bash" label="Bash">

Add this line to your `~/.bashrc` or `~/.bash_profile`:

```bash
eval "$(agnes completion bash)"
```

Then reload your shell:
```bash
source ~/.bashrc
```

</TabItem>
<TabItem value="fish" label="Fish">

```bash
agnes completion fish > ~/.config/fish/completions/agnes.fish
```

Then restart your terminal or run `exec fish`.

</TabItem>
<TabItem value="nu" label="Nushell">

```nu
let autoload_dir = ($nu.user-autoload-dirs | first)
mkdir $autoload_dir
agnes completion nu | save --force ($autoload_dir | path join "agnes.nu")
```

Then restart Nushell or run:
```nu
source (($nu.user-autoload-dirs | first) | path join "agnes.nu")
```

</TabItem>
<TabItem value="powershell" label="PowerShell">

Add this line to your PowerShell profile:

```powershell
agnes completion powershell | Out-String | Invoke-Expression
```

Then reload your profile:
```powershell
. $PROFILE
```

</TabItem>
</Tabs>

:::tip Testing
After installing and reloading your shell, test completion by typing `agnes ` and pressing Tab to see available commands, or `agnes session --` and Tab to see available options.
:::

---

### Session Management

:::info Session Storage Migration
Starting with version 1.10.0, agnes uses a SQLite database (`sessions.db`) instead of individual `.jsonl` files.
Your existing sessions are automatically imported to the database. Legacy `.jsonl` files remain on disk but are no longer managed by agnes.
:::

#### session [options]
Start or resume interactive chat sessions.

**Basic Options:**
- **`--session-id <session_id>`**: Specify a session by its ID (e.g., '20251108_1')
- **`-n, --name <name>`**: Give the session a name
- **`--path <path>`**: Legacy parameter for specifying session by file path
- **`-r, --resume`**: Resume a previous session
- **`--fork`**: Create a new duplicate session with copied history. Must be used with `--resume`. Provide `--name` or `--session-id` to fork a specific session. Otherwise, forks the most recent session.
- **`--history`**: Show previous messages when resuming a session
- **`--container <container_id>`**: Run extensions inside a [Docker container](/docs/tutorials/agnes-in-docker#running-extensions-in-docker-containers).
- **`--debug`**: Enable debug mode to output complete tool responses, detailed parameter values, and full file paths
- **`--max-tool-repetitions <NUMBER>`**: Set the maximum number of times the same tool can be called consecutively with identical parameters. Helps prevent infinite loops.
- **`--max-turns <NUMBER>`**: Set the maximum number of turns allowed without user input (default: 1000)

**Extension Options:**
- **`--with-extension <command>`**: Add stdio extensions
- **`--with-streamable-http-extension <url>`**: Add remote extensions over Streamable HTTP
- **`--with-builtin <id>`**: Enable built-in extensions (e.g., 'developer', 'computercontroller')

**Usage:**
```bash
# Start a basic session
agnes session -n my-project

# Resume a previous session
agnes session --resume -n my-project
agnes session --resume --session-id 20251108_2
agnes session --resume --path ./session.json    # exported session
agnes session --resume --path ./session.jsonl   # legacy session storage

# Fork a specific session by name
agnes session --resume --fork --name my-project

# Fork the most recent session and show message history
agnes session --resume --fork --history

# Start with extensions
agnes session --with-extension "npx -y @modelcontextprotocol/server-memory"
agnes session --with-builtin developer
agnes session --with-streamable-http-extension "http://localhost:8080/mcp"

# Advanced: Mix multiple extension types
agnes session \
  --with-extension "echo hello" \
  --with-streamable-http-extension "http://localhost:8080/mcp" \
  --with-builtin "developer"

# Control session behavior
agnes session -n my-session --debug --max-turns 25
```

---

#### session list [options]
List all saved sessions.

**Options:**
- **`-f, --format <format>`**: Specify output format (`text` or `json`). Default is `text`
- **`--ascending`**: Sort sessions by date in ascending order (oldest first)
- **`-w, --working_dir <path>`**: Filter sessions by working directory
- **`-l, --limit <number>`**: Limit the number of results

**Usage:**
```bash
# List all sessions in text format (default)
agnes session list

# List sessions in JSON format
agnes session list --format json

# Sort sessions by date in ascending order
agnes session list --ascending

# Filter sessions by working directory
agnes session list -w ~/projects/myapp

# List only theundefinedmost recent sessions
agnes session list --limit 10
```

---

#### session remove [options]
Remove one or more saved sessions.

**Options:**
- **`--session-id <session_id>`**: Remove a specific session by its session ID
- **`-n, --name <name>`**: Remove a specific session by its name
- **`-r, --regex <pattern>`**: Remove sessions matching a regex pattern
- **`--path <path>`**: Remove a specific session by its file path (legacy)

**Usage:**
```bash
# Interactive removal (prompts you to choose sessions)
agnes session remove

# Remove a specific session by ID
agnes session remove --session-id 20251108_3

# Remove a specific session by name
agnes session remove -n my-project

# Remove all sessions starting with "project-"
agnes session remove -r "project-.*"

# Remove all sessions containing "migration"
agnes session remove -r ".*migration.*"
```

:::caution
Session removal is permanent and cannot be undone. agnes will show which sessions will be removed and ask for confirmation before deleting.
:::

---

#### session export [options]
Export sessions in different formats for backup, sharing, migration, or documentation purposes.

**Options:**
- **`--session-id <session_id>`**: Export a specific session by ID
- **`-n, --name <name>`**: Export a specific session by name
- **`--path <path>`**: Export a specific session by file path (legacy)
- **`-o, --output <file>`**: Save exported content to a file (default: stdout)
- **`--format <format>`**: Output format: `markdown`, `json`, `yaml`. Default is `markdown`

**Export Formats:**
- **`json`**: Complete session backup preserving all data including conversation history, metadata, and settings
- **`yaml`**: Complete session backup in YAML format
- **`markdown`**: Default format that creates a formatted, readable version of the conversation for documentation and sharing

**Usage:**
```bash
# Interactive export
agnes session export

# Export specific session as JSON for backup
agnes session export -n my-session --format json -o session-backup.json

# Export specific session as readable markdown
agnes session export -n my-session -o session.md

# Export to stdout in different formats
agnes session export --session-id 20251108_4 --format json
agnes session export -n my-session --format yaml

# Export session by path (legacy)
agnes session export --path ./my-session.jsonl -o exported.md
```

---

#### session diagnostics [options]
Generate a comprehensive diagnostics bundle for troubleshooting issues with a specific session.

**Options:**
- **`--session-id <session_id>`**: Generate diagnostics for a specific session by ID
- **`-n, --name <name>`**: Generate diagnostics for a specific session by name
- **`--path <path>`**: Generate diagnostics for a specific session by file path (legacy)
- **`-o, --output <file>`**: Save diagnostics bundle to a specific file path (default: `diagnostics_{session_id}.zip`)

**What's included:**
- **System Information**: App version, operating system, architecture, and timestamp
- **Session Data**: Complete conversation messages and history for the specified session
- **Configuration Files**: Your [configuration files](/docs/guides/config-files) (if they exist)
- **Log Files**: Recent application logs for debugging

**Usage:**
```bash
# Generate diagnostics for a specific session by ID
agnes session diagnostics --session-id 20251108_5

# Generate diagnostics for a session by name
agnes session diagnostics -n my-project-session

# Save diagnostics to a custom location
agnes session diagnostics --session-id 20251108_5 -o /path/to/my-diagnostics.zip

# Interactive selection (prompts you to choose a session)
agnes session diagnostics
```

:::warning Privacy Notice
Diagnostics bundles contain your session messages and system information. If your session includes sensitive data (API keys, personal information, proprietary code), review the contents before sharing publicly.
:::

:::tip
Generate diagnostics before reporting bugs to provide technical details that help with faster resolution. The ZIP file can be attached to GitHub issues or shared with support.
:::

---

### Task Execution

#### run [options]
Execute commands from an instruction file or stdin. Check out the [full guide](/docs/guides/running-tasks) for more info.

**Input Options:**
- **`-i, --instructions <FILE>`**: Path to instruction file containing commands. Use `-` for stdin
- **`-t, --text <TEXT>`**: Input text to provide to agnes directly
- **`--system <TEXT>`**: Provide additional system instructions to customize the agent's behavior
- **`--recipe <RECIPE_FILE_NAME> <OPTIONS>`**: Load a custom recipe in current session
- **`--params <KEY=VALUE>`**: Key-value parameters to pass to the recipe file. Can be specified multiple times
- **`--sub-recipe <RECIPE>`**: Specify sub-recipes to include alongside the main recipe. Can be specified multiple times

**Session Options:**
- **`-s, --interactive`**: Continue in interactive mode after processing initial input
- **`-n, --name <name>`**: Name for this run session (e.g. `daily-tasks`)
- **`-r, --resume`**: Resume from a previous run
- **`--path <PATH>`**: Path for this run session (e.g. `./playground.jsonl`). Used for legacy file-based session storage.
- **`--container <container_id>`**: Run extensions [inside a Docker container](/docs/tutorials/agnes-in-docker#running-extensions-in-docker-containers).
- **`--no-session`**: Run agnes commands without creating or storing a session file

**Extension Options:**
- **`--with-extension <COMMAND>`**: Add stdio extensions (can be used multiple times)
- **`--with-streamable-http-extension <URL>`**: Add remote extensions over Streamable HTTP (can be used multiple times)
- **`--with-builtin <name>`**: Add builtin extensions by name (e.g., 'developer' or multiple: 'developer,github')

**Control Options:**
- **`--debug`**: Output complete tool responses, detailed parameter values, and full file paths
- **`--max-tool-repetitions <NUMBER>`**: Maximum number of times the same tool can be called consecutively with identical parameters. Helps prevent infinite loops
- **`--max-turns <NUMBER>`**: Maximum number of turns allowed without user input (default: 1000)
- **`--explain`**: Show a recipe's title, description, and parameters
- **`--render-recipe`**: Print the rendered recipe instead of running it
- **`-q, --quiet`**: Quiet mode. Suppress non-response output, printing only the model response to stdout
- **`--output-format <FORMAT>`**: Output format (`text`, `json`, or `stream-json`). Default is `text`. Use JSON structured output for automation and scripting: `json` for results after completion, `stream-json` for events as they occur
- **`--provider`**: Specify the provider to use for this session (overrides environment variable)
- **`--model`**: Specify the model to use for this session (overrides environment variable)

**Usage:**
```bash
# Run from instruction file
agnes run --instructions plan.md

# Load a recipe with a prompt that agnes executes and then exits  
agnes run --recipe recipe.yaml

# Load a recipe and stay in an interactive session
agnes run --recipe recipe.yaml --interactive

# Load a recipe in debug mode
agnes run --recipe recipe.yaml --debug

# Show recipe details
agnes run --recipe recipe.yaml --explain

# Run a recipe with parameters
agnes run --recipe recipe.yaml --params environment=production --params region=us-west-2

# Run instructions from a file without session storage
agnes run --no-session -i instructions.txt

# Run with a specified provider and model
agnes run --provider anthropic --model claude-4-sonnet -t "initial prompt"

# Run with limited turns before prompting user
agnes run --recipe recipe.yaml --max-turns 10
```

---

#### recipe
Used to validate recipe files, manage recipe sharing, list available recipes, and open recipes in agnes desktop.

**Commands:**
- **`deeplink <RECIPE_NAME>`**: Generate a shareable link for a recipe file
  - **`-p, --param <KEY=VALUE>`**: Pre-fill recipe parameter (can be specified multiple times)
- **`list [OPTIONS]`**: List all available recipes from local directories and configured GitHub repositories
  - **`--format <FORMAT>`**: Output format (`text` or `json`). Default is `text`
  - **`-v, --verbose`**: Show verbose information including recipe titles and full file paths
- **`open <RECIPE_NAME>`**: Open a recipe file directly in agnes desktop
  - **`-p, --param <KEY=VALUE>`**: Pre-fill recipe parameter (can be specified multiple times)
- **`validate <RECIPE_NAME>`**: Validate a recipe file

**Usage:**
```bash
# Generate a shareable link
agnes recipe deeplink my-recipe.yaml

# Generate a deeplink and provide parameter values
agnes recipe deeplink my-recipe.yaml -p environment=production -p region=us-west-2

# List all available recipes
agnes recipe list

# List recipes with detailed information
agnes recipe list --verbose

# List recipes in JSON format for automation
agnes recipe list --format json

# Open a recipe in agnes desktop
agnes recipe open my-recipe.yaml

# Open a recipe by name
agnes recipe open my-recipe

# Open a recipe and provide parameter value
agnes recipe open my-recipe --param name=myproject

# Validate a recipe file
agnes recipe validate my-recipe.yaml

# Get help about recipe commands
agnes recipe help
```

---

#### plugin
Install and update git-backed plugins that provide skills or other Open Plugins components.

**Commands:**
- **`install [OPTIONS] <URL>`**: Install a plugin from a git repository URL
  - **`--auto-update`**: Automatically check for updates before plugin skills are loaded
- **`update <NAME>`**: Update an installed git-backed plugin by name

**Usage:**
```bash
# Install a plugin from a git repository
agnes plugin install https://github.com/example/my-agnes-plugin.git

# Install a plugin and enable automatic update checks
agnes plugin install --auto-update https://github.com/example/my-agnes-plugin.git

# Update an installed plugin manually
agnes plugin update my-plugin
```

Installed plugins are stored under `~/.agents/plugins/<plugin-name>/`. For more about plugin-provided skills, hooks, and update behavior, see the [Plugins guide](/docs/guides/context-engineering/plugins).

---

#### schedule
Automate recipes by running them on a [schedule](/docs/guides/recipes/session-recipes.md#schedule-recipe).

**Commands:**
- `add <OPTIONS>`: Create a new scheduled job. Copies the current version of the recipe to `~/.local/share/agnes/scheduled_recipes`
- `list`: View all scheduled jobs
- `remove`: Delete a scheduled job
- `sessions`: List sessions created by a scheduled recipe
- `run-now`: Run a scheduled recipe immediately
- `cron-help`: Show cron expression examples and help

**Options:**
- `--schedule-id <NAME>`: A unique ID for the scheduled job (e.g. `daily-report`)
- `--cron "* * * * * *"`: Specifies when a job should run using a [cron expression](https://en.wikipedia.org/wiki/Cron#Cron_expression)
- `--recipe-source <PATH>`: Path to the recipe YAML file
- `-l, --limit <NUMBER>`: Max number of sessions to display when using the `sessions` command

**Usage:**
```bash
agnes schedule <COMMAND>

# Add a new scheduled recipe which runs every day atundefinedAM
agnes schedule add --schedule-id daily-report --cron "0block/goose9 * * *" --recipe-source ./recipes/daily-report.yaml

# List all scheduled jobs
agnes schedule list

# List theundefinedmost recent agnes sessions created by a scheduled job
agnes schedule sessions --schedule-id daily-report -l 10

# Run a recipe immediately
agnes schedule run-now --schedule-id daily-report

# Remove a scheduled job
agnes schedule remove --schedule-id daily-report
```

---

#### mcp
Run an enabled MCP server specified by `<name>` (e.g. `'Google Drive'`).

**Usage:**
```bash
agnes mcp <name>
```

---

#### acp
Run agnes as an Agent Client Protocol (ACP) agent server over stdio. This enables agnes to work with ACP-compatible clients like Zed.

ACP is an emerging protocol specification that standardizes communication between AI agents and client applications, making it easier for clients to integrate with various AI agents.

**Usage:**
```bash
agnes acp
```

:::info
This command is automatically invoked by ACP-compatible clients and is not typically run directly by users. The client manages the lifecycle of the `agnes acp` process. See [Using agnes in ACP Clients](/docs/guides/acp-clients) for details.
:::

---

### Project Management

#### project
Start working on your last project or create a new one. For detailed usage examples and workflows, see [Managing Projects Guide](/docs/guides/managing-projects).

**Alias**: `p`

**Usage:**
```bash
agnes project
```

---

#### projects
Choose one of your projects to start working on.

**Alias**: `ps`

**Usage:**
```bash
agnes projects
```

---

### Terminal Integration

#### @agnes / @g
Ask agnes questions directly from your shell prompt, with command history included in the context. These aliases are created when you set up [terminal integration](/docs/guides/terminal-integration.md).

**Examples:**
```bash
# Ask questions with command history context
@agnes create a python script to process these files
@agnes create a PR description summarizing these changes
@g how do I fix these permission denied errors?
```

---

## Interactive Session Features

### Slash Commands

Once you're in an interactive session (via `agnes session` or `agnes run --interactive`), you can use these slash commands. All commands support tab completion. Press `/ + <Tab>` to cycle through available commands.

**Available Commands:**
- **`/?` or `/help`** - Display the help menu
- **`/builtin <names>`** - Add builtin extensions by name (comma-separated)
- **`/clear`** - Clear the current chat history
- **`/endplan`** - Exit plan mode and return to 'normal' agnes mode
- **`/exit` or `/quit`** - Exit the session
- **`/extension <command>`** - Add a stdio extension (format: ENV1=val1 command args...)
- **`/mode <name>`** - Set the agnes mode to use ('auto', 'approve', 'chat', 'smart_approve')
- **`/plan <message_text>`** - Enter 'plan' mode with optional message. Create a plan based on the current messages and ask user if they want to act on it
- **`/prompt <n> [--info] [key=value...]`** - Get prompt info or execute a prompt
- **`/prompts [--extension <name>]`** - List all available prompts, optionally filtered by extension
- **`/recipe [filepath]`** - Generate a recipe from the current conversation and save it to the specified filepath (must end with .yaml). If no filepath is provided, it will be saved to ./recipe.yaml
- **`/compact`** - Compact and summarize the current conversation to reduce context length while preserving key information
- **`/r`** - Toggle full tool output display (show complete tool parameters without truncation)
- **`/skills`** - List available skills
- **`/t`** - Toggle between `light`, `dark`, and `ansi` themes. [More info](#themes).
- **`/t <name>`** - Set theme directly (light, dark, ansi)

**Examples:**
```bash
# Create a plan for triaging test failures
/plan let's create a plan for triaging test failures

# List all prompts from the developer extension
/prompts --extension developer

# Switch to chat mode
/mode chat

# Add a builtin extension during the session
/builtin developer

# Clear the current conversation history
/clear
```
You can also create [custom slash commands for running recipes](/docs/guides/context-engineering/slash-commands) in agnes Desktop or the CLI. 

---

### Themes

The `/t` command controls the syntax highlighting theme for markdown content in agnes CLI responses. This affects the styles used for headers, code blocks, bold/italic text, and other markdown elements in the response output.

**Commands:**
- `/t` - Cycles through themes: `light` → `dark` → `ansi` → `light`
- `/t light` - Sets `light` theme (subtle light colors)
- `/t dark` - Sets `dark` theme (subtle darker colors)
- `/t ansi` - Sets `ansi` theme (most visually distinct option with brighter colors)

**Configuration:**
- The default theme is `dark`
- The theme setting is saved to the [configuration file](/docs/guides/config-files) as `AGNES_CLI_THEME` and persists between sessions
- The saved configuration can be overridden for the session using the `AGNES_CLI_THEME` [environment variable](/docs/guides/environment-variables#session-management)

**Custom Syntax Highlighting:**

You can customize the underlying syntax highlighting theme used for code blocks by setting:
- `AGNES_CLI_LIGHT_THEME` - Theme used when in light mode (default: "GitHub")
- `AGNES_CLI_DARK_THEME` - Theme used when in dark mode (default: "zenburn")

These accept any [bat theme name](https://github.com/sharkdp/bat#adding-new-themes). Popular options include "Dracula", "Nord", "Solarized (light)", "Solarized (dark)", "OneHalfDark", and "Monokai Extended". Run `bat --list-themes` to see all available themes.

:::info
Syntax highlighting styles only affect the font, not the overall terminal interface. The `light` and `dark` themes have subtle differences in font color and weight.

The agnes CLI theme is independent from the agnes Desktop theme.
:::

**Examples:**
```bash
# Set ANSI theme for the session via environment variable
agnes session --name use-custom-theme

# Toggle theme during a session
/t

# Set the light theme during a session
/t light
```

---

## Navigation and Controls

### Keyboard Shortcuts

**Session Control:**
- **`Ctrl+C`** - Clear the current line if text is entered, interrupt the current request if processing, or exit the session if line is empty
- **`Ctrl+J`** - Add a newline. Can customize the character via `AGNES_CLI_NEWLINE_KEY` in the [config file](/docs/guides/config-files) (e.g. `AGNES_CLI_NEWLINE_KEY: n`) or as an [environment variable](/docs/guides/environment-variables#session-management). Avoid "c" and common terminal shortcuts like "r", "w", "z".

**Navigation:**
- **`Cmd+Up/Down arrows`** - Navigate through command history
- **`Ctrl+R`** - Interactive command history search (reverse search). [More info](#command-history-search).

---

### External Editor Mode

For composing longer prompts or working with complex code snippets, you can configure agnes to use your preferred text editor instead of CLI input. This replaces the standard CLI input and keyboard shortcuts for the entire session.

**How it works:**
1. agnes opens your configured editor with a template file
2. Type your prompt after the `# Your prompt:` heading (conversation history is shown below for context)
3. Save the file and close/exit the editor to send your prompt to agnes
4. agnes processes your prompt and reopens the editor with the response added to the conversation history
5. Repeat steps 2-4 for each message in the conversation

You can use any editor that accepts a file path argument, such as vim, nano, emacs, and VS Code.

**Configuration:**

<Tabs>
  <TabItem value="envvar" label="Environment Variable" default>

  Applies to the current session only.

  ```bash
  # For terminal editors like vim or nano
  export AGNES_PROMPT_EDITOR=vim

  # Or for GUI editors like VS Code (use --wait flag)
  export AGNES_PROMPT_EDITOR="code --wait"
  ```

  </TabItem>
  <TabItem value="config" label="Config File">

  Persists across all sessions unless overridden by the environment variable.
  
  1. Navigate to the agnes [configuration file](/docs/guides/config-files). For example, navigate to `~/.config/agnes/config.yaml` on macOS.
  2. Add `AGNES_PROMPT_EDITOR` and set it to your preferred editor:
  
  ```yaml
  # For terminal editors like vim or nano
  AGNES_PROMPT_EDITOR: vim

  # Or for GUI editors like VS Code (use --wait flag)
  AGNES_PROMPT_EDITOR: code --wait
  ```

  </TabItem>
</Tabs>

**Using GUI Editors:**

GUI editors require a `--wait` or equivalent flag to ensure agnes waits for you to finish editing before continuing. Without this flag, the editor opens but agnes immediately proceeds as if you're done. Terminal editors like vim and nano don't need this flag.

---

### Command History Search

The `Ctrl+R` shortcut provides interactive search through your stored CLI [command history](/docs/guides/logs#command-history). This feature makes it easy to find and reuse recent commands without retyping them. When you type a search term, agnes searches backwards through your history for matches.

**How it works:**
1. Press `Ctrl+R` in your agnes CLI session
2. Type a search term
3. Navigate through the results using:
   - `Ctrl+R` to cycle backwards through earlier matches
   - `Ctrl+S` to cycle forward through newer matches
4. Press `Return` (or `Enter`) to run the found command, or `Esc` to cancel

For example, instead of retyping this long command:

```
analyze the performance issues in the sales database queries and suggest optimizations
```

Use the `"sales database"` or `"optimization"` search term to find and rerun it.

**Search tips:**
- **Distinctive terms work best**: Choose unique words or phrases to help filter the results
- **Partial matches and multiple words are supported**: You can search for phrases like `"gith"` and `"run the unit test"`
