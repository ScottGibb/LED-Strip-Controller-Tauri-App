{
  lib,
  stdenv,
  rustPlatform,
  fetchNpmDeps,
  cargo-tauri,
  glib-networking,
  openssl,
  pkg-config,
  webkitgtk_4_1,
  wrapGAppsHook4,
  bun,
  bun2nix,
}:

let
  manifest = (lib.importTOML ./src-tauri/Cargo.toml).package;
in
rustPlatform.buildRustPackage (finalAttrs: {

  pname = manifest.name;
  version = manifest.version;
  npmDeps = bun2nix.fetchBunDeps {
    bunNix = import ./bun.nix;
    inherit (finalAttrs) src;
  };

  dontUseBunBuild = true;
  dontUseBunPatch = true;
  dontUseBunCheck = true;

  cargoHash = "sha256-0Lb7vCQoyasm9pNVbMb2dHI2F22T4tOr+xVgnULHuYI=";

  nativeBuildInputs = [
    # Pull in our main hook
    cargo-tauri.hook
    # Make sure we can find our libraries
    pkg-config
    bun
  ]
  ++ lib.optionals stdenv.hostPlatform.isLinux [ wrapGAppsHook4 ];

  buildInputs = lib.optionals stdenv.hostPlatform.isLinux [
    glib-networking # Most Tauri apps need networking
    openssl
    webkitgtk_4_1
  ];

  # Set our Tauri source directory
  cargoRoot = "src-tauri";
  # And make sure we build there too
  buildAndTestSubdir = finalAttrs.cargoRoot;
  meta = {
    description = "Led Strip Controller Tauri App";
    mainProgram = "led-strip-controller-tauri-app";
  };
})
