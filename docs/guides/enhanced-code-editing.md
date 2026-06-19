The [Developer extension](/docs/mcp/developer-mcp) supports using AI models for enhanced code editing through the `str_replace` command. When configured, it intelligently applies code changes using an AI model instead of simple string replacement.

The use of models specializing in code editing can reduce the load on the main LLM providers while increasing accuracy, quality, and speed and lowering cost. This enhanced approach provides:

- **Context-aware editing**: The AI understands code structure and can make more intelligent changes
- **Better formatting**: Maintains consistent code style and formatting
- **Error prevention**: Can catch and fix potential issues during the edit
- **Flexible model support**: Works with any OpenAI-compatible API
- **Clean implementation**: Uses proper control flow instead of exception handling for configuration checks

## Configuration

Set these [environment variables](/docs/guides/environment-variables#enhanced-code-editing) to enable AI-powered code editing:

```bash
```

**All three environment variables must be set and non-empty for the feature to activate.** 

This optional feature is completely backwards compatible - if not configured, the extension works exactly as before with simple string replacement.

### Supported Providers

Any OpenAI-compatible API endpoint should work. Examples:

**OpenAI:**
```bash
```

**Anthropic (via OpenAI-compatible proxy):**
```bash
```

**Morph:**
```bash
```

**Relace:**
```bash
```

**Local/Custom endpoints:**
```bash
```

## How It Works

When the `str_replace` tool is used to edit code:

1. **Configuration Check**: agnes checks if all three environment variables are properly set and non-empty.

2. **With AI Enabled**: If configured, agnes sends the original code and your requested change to the configured AI model for processing.

3. **Fallback**: If the AI API is not configured or the API call fails, it falls back to simple string replacement.

4. **User Feedback**: The first time you use `str_replace` without AI configuration, you'll see a helpful message explaining how to enable the feature.
