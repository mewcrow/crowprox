# CrowProx

This extension allows you to proxy browser traffic or individual tabs through proxy servers.
Currently tested in Chromium with a local proxy (Hiddify on port 12334).

## Features

- **Per-tab proxying**
  - Click the extension icon or add a host to the list in the settings.
- **Proxy mode switching**
  - _Fixed Servers_: Routes all traffic through the proxy, except for hosts in the bypass list.
  - _OnRequest (in development)_: Selectively proxies only a specific list of hosts.
- **Flexible configuration**
  - Supports `http`, `https`, `socks4`, `socks5`, and `quic` protocols.
  - Editable bypass host list.

## Installation & Development

The project uses the [WXT](https://wxt.dev/) browser extension framework.

```bash
pnpm install
pnpm dev
```
