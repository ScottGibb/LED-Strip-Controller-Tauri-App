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

        # Build the frontend with dependencies
        frontend = pkgs.stdenv.mkDerivation {
          pname = "led-strip-controller-frontend";
          version = "1.0.3";

          src = ./.;

          nativeBuildInputs = [
            pkgs.bun
            pkgs.nodejs_20
          ];

          configurePhase = ''
            export HOME=$TMPDIR
            bun install --frozen-lockfile --no-progress
          '';

          buildPhase = ''
            bun run build
          '';

          installPhase = ''
            mkdir -p $out
            cp -r dist $out/
          '';

          outputHashMode = "recursive";
          outputHashAlgo = "sha256";
          outputHash = "sha256-ns/4S646/+0cHfLSNpo4KRcQUqjGXJqOLbMTSeVXmjA=";
        };

      in
      {
        packages.default = pkgs.rustPlatform.buildRustPackage rec {
          pname = "led-strip-controller-tauri";
          version = "1.0.3";
          src = ./src-tauri;

          postPatch = ''
            # Patch tauri.conf.json to use a direct version string instead of ../package.json
            substituteInPlace tauri.conf.json \
              --replace-fail '"version": "../package.json"' '"version": "${version}"'
          '';

          cargoLock = {
            lockFile = ./src-tauri/Cargo.lock;
          };

          # Build dependencies
          nativeBuildInputs =
            with pkgs;
            [
              pkg-config
              makeWrapper
            ]
            ++ lib.optionals stdenv.isLinux [
              patchelf
            ];

          buildInputs =
            runtimeDeps
            ++ (with pkgs; [
              openssl
            ]);

          # Pre-build: prepare frontend dist
          preBuild = ''
            # Copy pre-built frontend
            mkdir -p ../dist
            cp -r ${frontend}/dist/* ../dist/
          '';

          # Post-install: wrap with runtime dependencies and install desktop files
          postInstall = ''
            ${lib.optionalString pkgs.stdenv.isLinux ''
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
                                
            # Install icon
            mkdir -p $out/share/icons/hicolor/128x128/apps
            install -Dm644 icons/128x128.png \
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
