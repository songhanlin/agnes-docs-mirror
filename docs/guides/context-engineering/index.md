<h1 className={styles.pageTitle}>Context Engineering</h1>
<p className={styles.pageDescription}>
  Context engineering is about building background knowledge, preferences, and workflows that help agnes work more effectively. Instead of repeating instructions, you define them once and teach agnes how you work.
</p>

<div className={styles.categorySection}>
  <h2 className={styles.categoryTitle}>📚 Documentation & Guides</h2>
  <div className={styles.cardGrid}>
    <Card 
      title="Using agneshints"
      description="Use AGENTS.md, .agneshints, and other files to provide project context, preferences, and instructions that agnes loads automatically."
      link="/docs/guides/context-engineering/using-agneshints"
    />
    <Card 
      title="Using Skills"
      description="Create reusable instruction sets containing workflows, scripts, and other resources that agnes can load on demand."
      link="/docs/guides/context-engineering/using-skills"
    />
    <Card 
      title="Plugins"
      description="Install, update, and manage packages that extend agnes with skills, hooks, and other reusable components."
      link="/docs/guides/context-engineering/plugins"
    />
    <Card 
      title="Hooks"
      description="Run scripts when agnes starts sessions, submits prompts, calls tools, edits files, or executes shell commands."
      link="/docs/guides/context-engineering/hooks"
    />
    <Card 
      title="Custom Slash Commands"
      description="Create custom shortcuts to quickly run reusable instructions in any chat session with simple slash commands."
      link="/docs/guides/context-engineering/slash-commands"
    />
    <Card 
      title="Prompt Templates"
      description="Customize the built-in prompts that define how agnes responds, plans, compacts context, and creates recipes."
      link="/docs/guides/context-engineering/prompt-templates"
    />
    <Card 
      title="Subagents"
      description="Delegate focused tasks to isolated agnes instances that can run sequentially or in parallel."
      link="/docs/guides/context-engineering/subagents"
    />
    <Card 
      title="Using agnesignore"
      description="Prevent agnes from accessing sensitive files and directories by defining global or project-specific ignore rules."
      link="/docs/guides/context-engineering/using-agnesignore"
    />
    <Card 
      title="Creating Plans"
      description="Use planning mode to break complex work into clear, manageable steps before agnes starts implementation."
      link="/docs/guides/context-engineering/creating-plans"
    />
    <Card 
      title="Persistent Instructions"
      description="Inject critical reminders into agnes's working memory every turn. Ideal for security guardrails and behavioral rules that must never be forgotten."
      link="/docs/guides/context-engineering/using-persistent-instructions"
    />
    <Card 
      title="Memory Extension"
      description="Teach agnes persistent knowledge it can recall across sessions. Save commands, code snippets, and preferences for consistent assistance."
      link="/docs/mcp/memory-mcp"
    />
    <Card 
      title="Research → Plan → Implement Pattern"
      description="See how slash commands make it easy to integrate instructions into interactive RPI workflows."
      link="/docs/tutorials/rpi"
    />
  </div>
</div>

<div className={styles.categorySection}>
  <h2 className={styles.categoryTitle}>📝 Featured Blog Posts</h2>
  <div className={styles.cardGrid}>
    <Card 
      title="What's in my .agneshints file"
      description="A deep dive into .agneshints vs Memory Extension, and how to optimize your agnes configuration for better performance."
      link="/blog/2025/06/05/whats-in-my-agneshints-file"
    />
    <Card 
      title="Stop Your AI Agent From Making Unwanted Changes"
      description="Teach your AI agent how to commit early and often so you can control changes and roll back safely."
      link="/blog/2025/12/10/stop-ai-agent-unwanted-changes"
    />
    <Card 
      title="The AI Skeptic's Guide to Context Windows"
      description="Why do AI agents forget? Learn how context windows, tokens, and agnes help you manage memory and long conversations."
      link="/blog/2025/08/18/understanding-context-windows"
    />
    <Card
      title="Hooks: run your own scripts on every agnes event"
      description="Learn how lifecycle hooks let you react to session, prompt, tool, file, and shell events with your own scripts."
      link="/blog/2026/05/14/agnes-hooks"
    />
  </div>
</div>
