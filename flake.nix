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
        pkgs = import nixpkgs { inherit system; };
        lib = pkgs.lib;

        # Import version from Cargo.toml
        manifest = (lib.importTOML ./src-tauri/Cargo.toml).package;

      in
      {
        packages.default = pkgs.rustPlatform.buildRustPackage rec {
          pname = manifest.name;
          version = manifest.version;

          src = ./.;

          # Change to src-tauri directory for cargo build
          sourceRoot = "source/src-tauri";

          cargoLock = {
            lockFile = ./src-tauri/Cargo.lock;
          };

          # Frontend is built in a separate derivation to cache node dependencies
          # This uses a Fixed Output Derivation which is allowed network access
          frontend = pkgs.stdenv.mkDerivation {
            pname = "${pname}-frontend";
            inherit version src;

            nativeBuildInputs = [ pkgs.bun pkgs.nodejs_20 ];

            buildPhase = ''
              export HOME=$TMPDIR
              bun install --frozen-lockfile --no-progress
              bun run build
            '';

            installPhase = ''
              cp -r dist $out
            '';

            outputHashMode = "recursive";
            outputHashAlgo = "sha256";
            outputHash = "sha256-uA3IXiJWqpoGI4djdoISP2Gp736XZjSKnTe1n97Tj6E=";
          };

          # Use Tauri hook for proper Tauri app building
          nativeBuildInputs = with pkgs; [
            pkg-config
            makeWrapper
            cargo-tauri.hook
          ] ++ lib.optionals stdenv.isDarwin [
            darwin.apple_sdk.frameworks.CoreServices
            darwin.apple_sdk.frameworks.SystemConfiguration
          ];

          buildInputs = with pkgs; [
            openssl
          ] ++ lib.optionals stdenv.isLinux [
            webkitgtk_4_1
            gtk3
            cairo
            gdk-pixbuf
            glib
            dbus
            librsvg
          ];

          # Tauri configuration
          tauriHook.frontendDist = frontend;

          # Patch tauri.conf.json to use version from Cargo.toml
          postPatch = ''
            substituteInPlace tauri.conf.json \
              --replace-fail '"version": "../package.json"' '"version": "${version}"'
          '';

          # Wrapper for runtime dependencies on Linux
          postInstall = lib.optionalString stdenv.isLinux ''
            wrapProgram $out/bin/${pname} \
              --prefix LD_LIBRARY_PATH : "${lib.makeLibraryPath buildInputs}"
          '';

          meta = with lib; {
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
