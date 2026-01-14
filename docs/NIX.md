# Nix Package for LED Strip Controller

This flake provides a Nix package for installing the LED Strip Controller Tauri App.

## Quick Start

### Prerequisites

Install Nix with flakes enabled:

```bash
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install
```

### Installation Options

#### Option 1: Install with nix profile

```bash
nix profile install github:ScottGibb/LED-Strip-Controller-Tauri-App
```

Then run the application:

```bash
led-strip-controller-tauri
```

#### Option 2: Use with home-manager

Add to your `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    home-manager.url = "github:nix-community/home-manager";
    led-strip-controller.url = "github:ScottGibb/LED-Strip-Controller-Tauri-App";
  };

  outputs = { nixpkgs, home-manager, led-strip-controller, ... }: {
    homeConfigurations.youruser = home-manager.lib.homeManagerConfiguration {
      pkgs = nixpkgs.legacyPackages.x86_64-linux;
      modules = [
        {
          home.packages = [
            led-strip-controller.packages.x86_64-linux.default
          ];
        }
      ];
    };
  };
}
```

#### Option 3: Run without installing

```bash
nix run github:ScottGibb/LED-Strip-Controller-Tauri-App
```

### Building from Source

Clone the repository and build:

```bash
git clone https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App
cd LED-Strip-Controller-Tauri-App
nix build
```

The built application will be available in the `result` directory:

```bash
./result/bin/led-strip-controller-tauri
```

## Package Information

The package includes:

- The compiled LED Strip Controller Tauri application
- Desktop entry file for application menu integration
- Application icon

Runtime dependencies (automatically included on Linux):

- WebKitGTK 4.1
- GTK3
- Cairo, GDK-Pixbuf, GLib
- DBus, OpenSSL, librsvg

## Supported Platforms

- Linux (x86_64, aarch64)
- macOS (x86_64, aarch64)

## CI/CD Integration

The project includes a GitHub Actions workflow (`.github/workflows/nix-build.yaml`) that:

- Verifies the flake configuration
- Tests package builds on Linux and macOS
- Ensures the application can be installed and run

## Troubleshooting

### Flake not found

Ensure you're referencing the correct repository URL or are in the project root directory.

### Build failures

Check that you have sufficient disk space and that all substituters are accessible.

### Installation conflicts

If you already have the package installed, remove it first:

```bash
nix profile remove led-strip-controller-tauri
```

## Further Reading

- [Nix Flakes Documentation](https://nixos.wiki/wiki/Flakes)
- [Home Manager Documentation](https://nix-community.github.io/home-manager/)
- [Tauri Documentation](https://tauri.app/)
