{
  description = "LED Strip Controller Tauri App";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
        
        # Rust toolchain
        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rust-analyzer" ];
        };

        # Build inputs for Tauri on Linux
        linuxBuildInputs = with pkgs; [
          webkitgtk_4_1
          gtk3
          cairo
          gdk-pixbuf
          glib
          dbus
          openssl
          librsvg
          libappindicator-gtk3
        ];

        # Native build inputs
        nativeBuildInputs = with pkgs; [
          pkg-config
          makeWrapper
          patchelf
        ];

        # Common dependencies
        commonDeps = with pkgs; [
          rustToolchain
          nodejs_20
          bun
          cargo-tauri
        ];

      in
      {
        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = commonDeps ++ (if pkgs.stdenv.isLinux then linuxBuildInputs else []);
          nativeBuildInputs = nativeBuildInputs;
          
          shellHook = ''
            export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath (if pkgs.stdenv.isLinux then linuxBuildInputs else [])}:$LD_LIBRARY_PATH
            echo "LED Strip Controller Tauri App development environment"
            echo "Run 'bun install' to install frontend dependencies"
            echo "Run 'bun run tauri dev' to start the development server"
          '';
        };

        # Package definition
        packages.default = pkgs.stdenv.mkDerivation rec {
          pname = "led-strip-controller-tauri";
          version = "1.0.3";

          src = ./.;

          buildInputs = commonDeps ++ (if pkgs.stdenv.isLinux then linuxBuildInputs else []);
          nativeBuildInputs = nativeBuildInputs;

          buildPhase = ''
            export HOME=$TMPDIR
            export CARGO_HOME=$TMPDIR/.cargo
            export RUSTUP_HOME=$TMPDIR/.rustup
            
            # Install frontend dependencies
            bun install --frozen-lockfile
            
            # Build the frontend
            bun run build
            
            # Build the Tauri app
            cargo tauri build
          '';

          installPhase = ''
            mkdir -p $out/bin
            mkdir -p $out/share/applications
            mkdir -p $out/share/icons/hicolor/128x128/apps
            
            # Install the binary (adjust path based on platform)
            if [ -f src-tauri/target/release/led-strip-controller-tauri ]; then
              install -m755 src-tauri/target/release/led-strip-controller-tauri $out/bin/
            elif [ -f src-tauri/target/release/bundle/appimage/led-strip-controller-tauri_${version}_amd64.AppImage ]; then
              install -m755 src-tauri/target/release/bundle/appimage/led-strip-controller-tauri_${version}_amd64.AppImage $out/bin/led-strip-controller-tauri
            fi
            
            # Install desktop file if it exists
            if [ -f src-tauri/target/release/bundle/deb/led-strip-controller-tauri_${version}_amd64/data/usr/share/applications/*.desktop ]; then
              install -m644 src-tauri/target/release/bundle/deb/led-strip-controller-tauri_${version}_amd64/data/usr/share/applications/*.desktop $out/share/applications/
            fi
            
            # Install icon if it exists
            if [ -f src-tauri/icons/128x128.png ]; then
              install -m644 src-tauri/icons/128x128.png $out/share/icons/hicolor/128x128/apps/led-strip-controller-tauri.png
            fi
          '';

          meta = with pkgs.lib; {
            description = "A Tauri App for controlling LED strips";
            homepage = "https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App";
            license = licenses.mit;
            platforms = platforms.linux ++ platforms.darwin;
            maintainers = [ ];
          };
        };

        # App definition for nix run
        apps.default = {
          type = "app";
          program = "${self.packages.${system}.default}/bin/led-strip-controller-tauri";
        };
      }
    );
}
