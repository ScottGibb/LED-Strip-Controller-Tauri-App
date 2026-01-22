{
  description = "LED Strip Controller Tauri App";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    systems.url = "github:nix-systems/default";

    bun2nix.url = "github:baileyluTCD/bun2nix";
    bun2nix.inputs.nixpkgs.follows = "nixpkgs";
  };

  nixConfig = {
    extra-substituters = [
      "https://cache.nixos.org"
      "https://nix-community.cachix.org"
    ];
    extra-trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
      "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
    ];
  };

  outputs =
    inputs:
    let
      eachSystem = inputs.nixpkgs.lib.genAttrs (import inputs.systems);

      pkgsFor = eachSystem (
        system:
        import inputs.nixpkgs {
          inherit system;
          overlays = [ inputs.bun2nix.overlays.default ];
        }
      );
    in
    {
      packages = eachSystem (system: {
        default = pkgsFor.${system}.callPackage (
          {
            lib,
            stdenv,
            rustPlatform,
            cargo-tauri,
            glib-networking,
            openssl,
            pkg-config,
            webkitgtk_4_1,
            wrapGAppsHook4,
            systemd,

            bun,
            bun2nix,
          }:

          let
            manifest = (lib.importTOML ./src-tauri/Cargo.toml).package;
          in
          rustPlatform.buildRustPackage (finalAttrs: {
            pname = manifest.name;
            version = manifest.version;

            src = ./.;

            cargoLock = {
              lockFile = ./src-tauri/Cargo.lock;
            };

            # 🔴 Must be called bunDeps
            bunDeps = bun2nix.fetchBunDeps {
              bunNix = import ./bun.nix;
              inherit (finalAttrs) src;
            };

            cargoRoot = "src-tauri";
            buildAndTestSubdir = finalAttrs.cargoRoot;

            # Let Tauri's cargo-tauri.hook handle the frontend build
            dontUseBunBuild = true;
            dontUseBunCheck = true;

            nativeBuildInputs = [
              cargo-tauri.hook

              bun
              bun2nix.hook

              pkg-config

            ]
            ++ lib.optionals stdenv.hostPlatform.isLinux [
              wrapGAppsHook4
            ];

            buildInputs = lib.optionals stdenv.hostPlatform.isLinux [
              glib-networking
              openssl
              webkitgtk_4_1
              systemd.dev
            ];

            postInstall = lib.optionalString stdenv.hostPlatform.isDarwin ''
              mkdir -p $out/bin
              cat > $out/bin/${manifest.name} <<EOF
              #!/bin/sh
              exec open -a $out/Applications/${manifest.name}.app
              EOF
              chmod +x $out/bin/${manifest.name}
            '';
            meta = {
              description = "Led Strip Controller Tauri App";
              mainProgram = manifest.name;
            };
          })
        ) { };
      });
    };
}
