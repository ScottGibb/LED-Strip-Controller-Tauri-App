# LED Strip Controller Tauri App

[![MegaLinter](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/mega-linter.yaml/badge.svg)](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/mega-linter.yaml) [![Continuous Build](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/continuous-build.yaml/badge.svg)](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/continuous-build.yaml) [![publish](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/publish.yaml/badge.svg)](https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App/actions/workflows/publish.yaml)

See my initial [Concepts](./docs/INITIAL_CONCEPTS.md) for more diagrams regarding what the App could look like.

## Demo

todo: Video goes here!

## Dev Environments

```bash
  cd led-strip-controller-tauri-app
  bun install
```

For Desktop development, run:

```bash
  bun run tauri dev
```

For Android development, run:

```bash
  bun run tauri android dev
```

For iOS development, run:

```bash
  bun run tauri ios dev

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
