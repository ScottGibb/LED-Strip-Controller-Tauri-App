# LED Strip Controller Tauri App

[![MegaLinter](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/mega-linter.yaml/badge.svg)](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/mega-linter.yaml) [![Continuous Build](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/continuous-build.yaml/badge.svg)](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/continuous-build.yaml) [![publish](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/publish.yaml/badge.svg)](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/publish.yaml)

This app is the desktop/mobile UI for controlling the LED Strip Controller hardware.  
It is built with Tauri, React, and TypeScript and provides:

- connection setup over **Serial/USB** or **TCP/IP**
- control pages for **master** settings and **per-strip** settings
- configurable colour and mode controls

See [INITIAL_CONCEPTS.md](./docs/INITIAL_CONCEPTS.md) for early design notes and diagrams.

## LED Strip Controller Project

This repository is part of a wider project:

- **App (this repo):** https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App
- **Project manifest / hub:** https://github.com/ScottGibb/LED-Strip-Controller-Manifest

## Demo

todo: Video goes here!

## Development

```bash
cd led-strip-controller-tauri-app
bun install
```

Run desktop development:

```bash
bun run tauri dev
```

Run Android development:

```bash
bun run tauri android dev
```

Run iOS development:

```bash
bun run tauri ios dev
```

## Nix Setup

This project provides a [Nix](https://nixos.org/) package for easy installation.

### Prerequisites

- Install Nix with flakes support: [https://nixos.org/download.html](https://nixos.org/download.html)
- Enable flakes in your Nix configuration

### Installation

Install directly from the flake:

```bash
nix profile add github:ScottGibb/LED-Strip-Controller-Tauri-App
```

Or add to your home-manager configuration:

```nix
{
  inputs.led-strip-controller.url = "github:ScottGibb/LED-Strip-Controller-Tauri-App";
  
  # In your home-manager config:
  home.packages = [
    inputs.led-strip-controller.packages.${system}.default
  ];
}
```

### Running

After installation, run the application:

```bash
led-strip-controller-tauri
```

Or run directly without installing:

```bash
nix run github:ScottGibb/LED-Strip-Controller-Tauri-App
```

### Building from Source

Build locally:

```bash
nix build
```
