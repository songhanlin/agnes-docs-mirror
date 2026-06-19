On first use, agnes asks for permission to collect anonymous usage data to help improve the product. You can change this setting at any time.

## Usage data collected

To respect your privacy, agnes collects only anonymous usage metrics when you opt in. If enabled, the following data is collected:

- Operating system, version, and architecture
- agnes version and install method
- Provider and model used
- Extensions and tool usage counts (names only)
- Session metrics (duration, interaction count, token usage)
- Error types (e.g., "rate_limit", "auth" - no details)

Collected usage data doesn't include your conversations, code, tool arguments, error messages, or any personal data.

:::info Provider Data Handling
Depending on the [LLMs](/docs/getting-started/providers) you use with agnes, your conversations, prompts, and information accessed by agnes might be sent to the provider and subject to their data retention and privacy policies.
:::

## Change Your Preference

To change your usage data collection preference:

<Tabs groupId="interface">
  <TabItem value="ui" label="agnes Desktop" default>
    1. Click the <PanelLeft className="inline" size={16} /> button in the top-left to open the sidebar
    2. Click `Settings` in the sidebar
    3. Click the `App` tab
    4. In the `Privacy` section, toggle `Anonymous usage data` on or off
  </TabItem>
  <TabItem value="cli" label="agnes CLI">
    Use the arrow keys to move through the options and press `Enter` to select. A solid dot shows your current selection.
    1. Run `agnes configure`
    2. Choose `agnes settings`
    3. Choose `Telemetry`
    4. Your current telemetry status is shown. Select `Yes` to enable anonymous usage data collection or `No` to disable it.
    
    ```sh
    ┌   agnes-configure 
    │
    ◇  What would you like to configure?
    │  agnes settings 
    │
    ◇  What setting would you like to configure?
    │  Telemetry 
    │
    ●  Current telemetry status: Disabled
    │  
    ◇  Share anonymous usage data to help improve agnes?
    │  Yes 
    │
    └  Telemetry enabled - thank you for helping improve agnes!
    └  Configuration saved successfully to /Users/julesv/.config/agnes/config.yaml
    ```
  </TabItem>
</Tabs>

You can also set the `AGNES_TELEMETRY_ENABLED` variable directly in your [`config.yaml` file](/docs/guides/config-files), or use it as an [environment variable](/docs/guides/environment-variables#security-and-privacy) to set telemetry status for a given session.