---
sidebar_position: 90
title: Running a Remote agnes Server
sidebar_label: Remote Server
---

# Running a Remote agnes Server

agnes Desktop normally runs its own `agnesd` server process in the background on the same machine. You can also run `agnesd` separately — for example, on a remote VM or a different machine on your network — and point agnes Desktop at it.

This is useful when you want agnes to run somewhere with more compute, a stable IP, or shared access, while still driving it from a local Desktop UI.

This guide covers:

1. [Starting a `agnesd` server on a remote machine](#1-start-the-agnesd-server)
2. [Verifying it is reachable](#2-verify-the-server-is-up)
3. [Locating the certificate fingerprint](#3-find-the-certificate-fingerprint)
4. [Configuring agnes Desktop to connect to it](#4-configure-agnes-desktop)
5. [Running `agnesd` as a background service on macOS](#running-agnesd-as-a-background-service-macos)
6. [Troubleshooting](#troubleshooting)

:::warning TLS is required
agnes Desktop will refuse to connect to a remote `agnesd` server over plain HTTP. TLS is enabled by default (`AGNES_TLS=true`), so make sure you have not disabled it.
:::

## Initial Setup

### 1. Start the `agnesd` server

On the remote machine, launch `agnesd` with the host, port, TLS, and a shared secret key:

```bash
AGNES_HOST=0.0.0.0 \
AGNES_PORT=3000 \
AGNES_TLS=true \
AGNES_SERVER__SECRET_KEY='YOUR_SECRET' \
/Applications/Agnes.app/Contents/Resources/bin/agnesd agent
```

On Linux or Windows the path to the `agnesd` binary will differ — use the one bundled with your agnes installation, or a standalone `agnesd` build.

| Variable | Purpose |
|----------|---------|
| `AGNES_HOST` | Interface to bind to. Use `0.0.0.0` to accept connections from other machines. Binding to `localhost` or `127.0.0.1` will only accept local connections. |
| `AGNES_PORT` | TCP port to listen on. |
| `AGNES_TLS` | Must be `true`. agnes Desktop will not connect to a plain HTTP server. |
| `AGNES_SERVER__SECRET_KEY` | Shared secret. The client must send this in the `X-Secret-Key` header. Treat it like a password. |

:::tip
Pick a long, random value for `AGNES_SERVER__SECRET_KEY` and store it in a password manager — the same value goes into agnes Desktop later.
:::

### 2. Verify the server is up

First, confirm `agnesd` is actually listening on the port you expect:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

Then test the endpoints from the server itself. The `-k` flag tells `curl` to accept the self-signed TLS certificate that `agnesd` generates:

```bash
# Connectivity only
curl -i https://127.0.0.1:3000/status -k

# Authenticated endpoint (real test)
curl -i https://127.0.0.1:3000/config/read -k \
  -H 'Content-Type: application/json' \
  -H 'X-Secret-Key: YOUR_SECRET' \
  --data '{"key":"AGNES_PROVIDER","is_secret":false}'
```

A `200` response from the second call confirms that TLS is up, the secret key is being accepted, and the server is ready to receive client requests.

If you intend to reach the server from another machine, also test from there using the server's hostname or VPN address — not `127.0.0.1`.

### 3. Find the certificate fingerprint

Because `agnesd` generates a self-signed TLS certificate, agnes Desktop pins it by SHA-256 fingerprint rather than relying on a public certificate authority.

When TLS is enabled, `agnesd` logs the fingerprint on startup. It looks like:

```text
AGNESD_CERT_FINGERPRINT=AA:BB:CC:DD:EE:FF:...
```

To capture it, either:

- Run `agnesd` interactively and read it from the terminal output, or
- Tail the log file you redirect to when running as a service (see [Running `agnesd` as a background service](#running-agnesd-as-a-background-service-macos)):

```bash
grep AGNESD_CERT_FINGERPRINT ~/Library/Logs/AgnesExternal/agnesd.out.log
```

Make a note of the fingerprint — you will paste it into agnes Desktop in the next step.

:::note
The fingerprint changes whenever `agnesd` regenerates its certificate (for example, if you delete the cert file). If agnes Desktop suddenly refuses to connect after a server restart, re-check the fingerprint.
:::

### 4. Configure agnes Desktop

On the client machine, open agnes Desktop and navigate to **Settings → agnes Server**:

| Setting | Value |
|---------|-------|
| **Use external server** | Enabled |
| **URL** | `https://your-server-host:3000` (use the hostname or IP that the client can reach — for example a VPN/tailnet address) |
| **Secret Key** | The same value you used for `AGNES_SERVER__SECRET_KEY` |
| **Certificate Fingerprint** | The `AGNESD_CERT_FINGERPRINT` value from the server logs |

After saving, agnes Desktop will route all backend requests to the remote `agnesd`. If the connection fails, see [Troubleshooting](#troubleshooting).

## Running `agnesd` as a Background Service (macOS)

Running `agnesd` in a terminal session is fine for testing, but for everyday use you probably want it managed as a background service so it starts at login and restarts on failure. On macOS, this is done with `launchd`.

Create a LaunchAgent plist at `~/Library/LaunchAgents/com.agnes.agnesd.external.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.agnes.agnesd.external</string>

    <key>ProgramArguments</key>
    <array>
      <string>/Applications/Agnes.app/Contents/Resources/bin/agnesd</string>
      <string>agent</string>
    </array>

    <key>EnvironmentVariables</key>
    <dict>
      <key>AGNES_HOST</key><string>0.0.0.0</string>
      <key>AGNES_PORT</key><string>3000</string>
      <key>AGNES_TLS</key><string>true</string>
      <key>AGNES_SERVER__SECRET_KEY</key><string>YOUR_SECRET</string>
    </dict>

    <key>RunAtLoad</key><true/>
    <key>KeepAlive</key><true/>

    <key>StandardOutPath</key>
    <string>/Users/YOUR_USERNAME/Library/Logs/AgnesExternal/agnesd.out.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/YOUR_USERNAME/Library/Logs/AgnesExternal/agnesd.err.log</string>
  </dict>
</plist>
```

Replace `YOUR_SECRET` and `YOUR_USERNAME` with appropriate values, and make sure the log directory exists:

```bash
mkdir -p ~/Library/Logs/AgnesExternal
```

Then load and start the service:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.agnes.agnesd.external.plist
launchctl kickstart -k gui/$(id -u)/com.agnes.agnesd.external
```

To stop or remove it later:

```bash
launchctl bootout gui/$(id -u)/com.agnes.agnesd.external
```

:::tip
Because the secret key is stored in plain text in the plist, the file should be readable only by your user. macOS LaunchAgents under `~/Library/LaunchAgents/` are already user-scoped, but you can tighten further with `chmodundefined~/Library/LaunchAgents/com.agnes.agnesd.external.plist`.
:::

## Troubleshooting

### Server only accepts local connections

If `curl` works from the server but the client machine times out or gets "connection refused", check what interface `agnesd` is bound to. If `AGNES_HOST` is `localhost` or `127.0.0.1`, only loopback connections are accepted.

Set `AGNES_HOST=0.0.0.0` to accept connections on all interfaces, then restart `agnesd`. You can verify with:

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

The output should show the address as `*:3000` or the specific external IP, not `127.0.0.1:3000`.

### TLS is not enabled

In the server's startup logs:

- If you see `listening on http://...`, TLS is **not** enabled. agnes Desktop will not connect. Set `AGNES_TLS=true` and restart `agnesd`.
- If you see `listening on https://...`, TLS is enabled and you are good to go.

The startup logs also contain the `AGNESD_CERT_FINGERPRINT=...` line you need for the agnes Desktop configuration. Search the server's stdout (or log file, if running under `launchd`) for `AGNESD_CERT_FINGERPRINT` to find it.

### Client cannot authenticate (401 / Unauthorized)

A `401` from the server, or a agnes Desktop error indicating that the secret was rejected, almost always means that `AGNES_SERVER__SECRET_KEY` on the server does not match the **Secret Key** in agnes Desktop's settings.

To check the secret end-to-end without involving agnes Desktop, run the authenticated `curl` from [step 2](#2-verify-the-server-is-up) using exactly the value you have configured on the client. If that returns `200`, the secret is correct and the problem is in the client configuration; if it returns `401`, the secret on the server is different from what you are sending.

If you rotate the secret on the server, you must also update it in agnes Desktop's settings — they are not synchronized automatically.

### Certificate fingerprint mismatch

If agnes Desktop refuses to connect with a certificate or fingerprint error, the most common causes are:

- The server regenerated its certificate (for example, after deleting the cert file). Look at the latest startup logs for the current `AGNESD_CERT_FINGERPRINT` and update agnes Desktop.
- You copied the fingerprint with extra whitespace or pasted the wrong value.

## Related

- [Environment Variables](/docs/guides/environment-variables) — full reference for all `AGNES_*` variables
- [Configuration Files](/docs/guides/config-files) — persistent client-side configuration
