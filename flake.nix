{
  description = "LED Strip Controller Tauri App";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            allowUnfree = true;
          };
        };
        lib = pkgs.lib;

        # Runtime dependencies for the application
        runtimeDeps =
          with pkgs;
          lib.optionals stdenv.isLinux [
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

          nativeBuildInputs =
            with pkgs;
            [
              bun
              nodejs_20
              pkg-config
              rustc
              cargo
              rustPlatform.cargoSetupHook
              makeWrapper
              libiconv
            ]
            ++ lib.optionals pkgs.stdenv.isDarwin [
              darwin.xattr
              darwin.cctools
            ];

          buildInputs = runtimeDeps ++ (with pkgs; [ openssl ]);

          cargoDeps = pkgs.rustPlatform.importCargoLock {
            lockFile = ./src-tauri/Cargo.lock;
          };

          postUnpack = ''
            # Copy Cargo.lock to the source root so cargoSetupHook can find it
            cp "$sourceRoot/src-tauri/Cargo.lock" "$sourceRoot/Cargo.lock"
          '';

          postPatch = ''
            # Patch tauri.conf.json to use direct version and configure for Nix build
            substituteInPlace src-tauri/tauri.conf.json \
              --replace-fail '"version": "../package.json"' '"version": "${version}"'
          ''
          + lib.optionalString pkgs.stdenv.isDarwin ''
            # On macOS, disable DMG bundling and only build .app bundle
            substituteInPlace src-tauri/tauri.conf.json \
              --replace-fail '"targets": "all"' '"targets": "app"'
            # Disable code signing on macOS for Nix builds
            # Create a dummy codesign that does nothing
            mkdir -p $TMPDIR/bin
            cat > $TMPDIR/bin/codesign << 'EOF'
            #!/bin/sh
            echo "Skipping codesign in Nix build"
            exit 0
            EOF
            chmod +x $TMPDIR/bin/codesign
            export PATH=$TMPDIR/bin:$PATH
          '';

          preConfigure = ''
            # Set up cargo vendored dependencies
            export CARGO_HOME=$(mktemp -d cargo-home-XXXXXX)
          '';

          configurePhase = ''
            runHook preConfigure
            export HOME=$TMPDIR
            bun install
            runHook postConfigure
          '';

          buildPhase = ''
            runHook preBuild
            # Disable code signing for Nix build
            export TAURI_SIGNING_PRIVATE_KEY=""
            export TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""
            bun run tauri build
            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out/bin
          ''
          + lib.optionalString pkgs.stdenv.isDarwin ''
            # On macOS, copy the .app bundle
            mkdir -p $out/Applications
            cp -r src-tauri/target/release/bundle/macos/*.app $out/Applications/
            ln -s $out/Applications/*.app/Contents/MacOS/${pname} $out/bin/${pname}
          ''
          + lib.optionalString pkgs.stdenv.isLinux ''
            # On Linux, install the binary
            install -Dm755 src-tauri/target/release/${pname} $out/bin/${pname}

            # Install desktop file and icon if they exist
            if [ -f src-tauri/icons/128x128.png ]; then
              install -Dm644 src-tauri/icons/128x128.png \
                $out/share/icons/hicolor/128x128/apps/${pname}.png
            fi
          ''
          + ''
            runHook postInstall
          '';

          postFixup = lib.optionalString pkgs.stdenv.isLinux ''
            wrapProgram $out/bin/${pname} \
              --prefix LD_LIBRARY_PATH : "${lib.makeLibraryPath runtimeDeps}"
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
