{
  description = "LED Strip Controller Tauri App";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        # Runtime dependencies for the application
        runtimeDeps = with pkgs; lib.optionals stdenv.isLinux [
          webkitgtk_4_1
          gtk3
          cairo
          gdk-pixbuf
          glib
          dbus
          openssl
          librsvg
        ];

      in
      {
        packages.default = pkgs.stdenv.mkDerivation rec {
          pname = "led-strip-controller-tauri";
          version = "1.0.3";

          src = ./.;

          nativeBuildInputs = with pkgs; [
            pkg-config
            rustPlatform.bindgenHook
            cargo
            rustc
            nodejs_20
            bun
            cargo-tauri
            makeWrapper
          ] ++ lib.optionals stdenv.isLinux [
            patchelf
          ];

          buildInputs = runtimeDeps;

          buildPhase = ''
            export HOME=$TMPDIR
            export CARGO_HOME=$TMPDIR/.cargo
            
            # Install frontend dependencies
            bun install --frozen-lockfile
            
            # Build the frontend
            bun run build
            
            # Build the Tauri app
            cargo tauri build --bundles none
          '';

          installPhase = ''
            mkdir -p $out/bin
            
            # Install the binary
            install -Dm755 src-tauri/target/release/${pname} $out/bin/${pname}
            
            # Wrap the binary with runtime dependencies on Linux
            ${pkgs.lib.optionalString pkgs.stdenv.isLinux ''
              wrapProgram $out/bin/${pname} \
                --prefix LD_LIBRARY_PATH : "${pkgs.lib.makeLibraryPath runtimeDeps}"
            ''}
            
            # Install desktop file
            mkdir -p $out/share/applications
            cat > $out/share/applications/${pname}.desktop <<EOF
            [Desktop Entry]
            Type=Application
            Name=LED Strip Controller
            Exec=$out/bin/${pname}
            Icon=${pname}
            Categories=Utility;
            Terminal=false
            EOF
            
            # Install icon
            mkdir -p $out/share/icons/hicolor/128x128/apps
            install -Dm644 src-tauri/icons/128x128.png \
              $out/share/icons/hicolor/128x128/apps/${pname}.png
          '';

          meta = with pkgs.lib; {
            description = "A Tauri App for controlling LED strips";
            homepage = "https://github.com/ScottGibb/LED-Strip-Controller-Tauri-App";
            license = licenses.mit;
            platforms = platforms.linux ++ platforms.darwin;
            maintainers = [ ];
            mainProgram = pname;
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
