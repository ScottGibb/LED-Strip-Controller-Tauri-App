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

  bun,
  bun2nix,
  nodejs,
  typescript,
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
