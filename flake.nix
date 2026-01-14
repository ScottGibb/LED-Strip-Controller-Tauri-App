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

        # Import version from Cargo.toml
        manifest = (pkgs.lib.importTOML ./src-tauri/Cargo.toml).package;

        # Fixed-output derivation to download node dependencies
        # This derivation is allowed network access because it has a fixed output hash
        # When package.json or bun.lock changes, update the hash by:
        # 1. Change the hash to a dummy value
        # 2. Run: nix build .#default 2>&1 | grep "got:"
        # 3. Copy the correct hash from the error message
        nodeDependencies = pkgs.stdenv.mkDerivation {
          pname = "${manifest.name}-node-deps";
          version = manifest.version;

          src = ./.;

          nativeBuildInputs = [ pkgs.bun ];

          buildPhase = ''
            export HOME=$TMPDIR
            bun install --frozen-lockfile --no-progress
          '';

          installPhase = ''
            mkdir -p $out
            cp -r node_modules $out/
          '';

          # Disable all fixup phases to prevent store path references
          dontFixup = true;

          outputHashMode = "recursive";
          outputHashAlgo = "sha256";
          outputHash = "sha256-uA3IXiJWqpoGI4djdoISP2Gp736XZjSKnTe1n97Tj6E=";
        };

      in
      {
        packages.default = pkgs.stdenv.mkDerivation rec {
          pname = manifest.name;
          version = manifest.version;

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

          # Tauri normally reads version from package.json, but we use Cargo.toml as our
          # single source of truth. This patches tauri.conf.json during build to inject
          # the version from manifest.version (extracted from Cargo.toml above).
          # This ensures we only maintain the version in one place.
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

            # Copy pre-downloaded node_modules from the FOD
            cp -r ${nodeDependencies}/node_modules .
            chmod -R +w node_modules
          '';

          configurePhase = ''
            runHook preConfigure
            export HOME=$TMPDIR
            # Dependencies already copied from FOD in preConfigure, no need to install
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
