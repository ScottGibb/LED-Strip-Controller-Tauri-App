# Nix Configuration for LED Strip Controller

This directory contains Nix flake configuration for reproducible builds and development environments.

## Quick Start

### Prerequisites

1. Install Nix with flakes enabled:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
   ```

2. (Optional) Install direnv for automatic environment loading:
   ```bash
   # On NixOS
   nix-env -iA nixos.direnv
   
   # On other systems with Nix
   nix-env -iA nixpkgs.direnv
   ```

### Development Environment

Enter the development shell:
```bash
nix develop
```

This provides:
- Rust toolchain (stable) with rust-analyzer
- Node.js 20
- Bun package manager
- Cargo Tauri CLI
- All system dependencies (WebKitGTK, GTK3, etc. on Linux)

### Using direnv

If you have direnv installed:
```bash
# Allow direnv for this project
direnv allow

# Environment will auto-load when entering the directory
cd /path/to/LED-Strip-Controller-Tauri-App
```

### Building the Application

Build the application package:
```bash
nix build
```

The built application will be available in the `result` directory.

### Running the Application

Run directly without building:
```bash
nix run
```

## Development Workflow

1. Enter the Nix shell:
   ```bash
   nix develop
   ```

2. Install frontend dependencies:
   ```bash
   bun install
   ```

3. Start development server:
   ```bash
   bun run tauri dev
   ```

## CI/CD Integration

The project includes a GitHub Actions workflow (`.github/workflows/nix-build.yaml`) that:
- Verifies the flake configuration
- Builds the development shell on Linux and macOS
- Tests that all required tools are available

## Supported Platforms

- Linux (x86_64, aarch64)
- macOS (x86_64, aarch64)

## Troubleshooting

### Flake not found
Ensure you're in the project root directory where `flake.nix` is located.

### Missing dependencies
Run `nix flake update` to update dependencies to the latest versions.

### Build failures
Check that you have sufficient disk space and that all substituters are accessible.

## Further Reading

- [Nix Flakes Documentation](https://nixos.wiki/wiki/Flakes)
- [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)
- [direnv Documentation](https://direnv.net/)
