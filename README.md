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

This project supports [Nix](https://nixos.org/) for reproducible development environments and builds.

### Prerequisites

- Install Nix with flakes support: [https://nixos.org/download.html](https://nixos.org/download.html)
- Enable flakes in your Nix configuration

### Development with Nix

Enter the development shell with all dependencies:
```bash
nix develop
```

Or use [direnv](https://direnv.net/) for automatic environment loading:
```bash
# Allow direnv for this project
direnv allow

# The environment will be loaded automatically when you cd into the directory
```

### Building with Nix

Build the application:
```bash
nix build
```

Run the application directly:
```bash
nix run
```

### What's Included

The Nix flake provides:
- Rust toolchain with rust-analyzer
- Node.js and Bun
- All required system dependencies for Tauri (Linux: WebKitGTK, etc.)
- Cargo Tauri CLI
