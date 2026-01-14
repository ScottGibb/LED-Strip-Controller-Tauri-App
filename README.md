# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Dev Environments

Template created! To get started run:
  cd led-strip-controller-tauri-app
  bun install
  bun run tauri android init
  bun run tauri ios init

For Desktop development, run:
  bun run tauri dev

For Android development, run:
  bun run tauri android dev

For iOS development, run:
  bun run tauri ios dev

## Nix Setup

This project provides a [Nix](https://nixos.org/) package for easy installation.

### Prerequisites

- Install Nix with flakes support: [https://nixos.org/download.html](https://nixos.org/download.html)
- Enable flakes in your Nix configuration

### Installation

Install directly from the flake:
```bash
nix profile install github:ScottGibb/LED-Strip-Controller-Tauri-App
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
