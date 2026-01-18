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

  # 🔴 REQUIRED
  src = ./.;

  cargoHash = "sha256-0Lb7vCQoyasm9pNVbMb2dHI2F22T4tOr+xVgnULHuYI=";

  # 🔴 Must be called bunDeps
  bunDeps = bun2nix.fetchBunDeps {
    bunNix = import ./bun.nix;
    inherit (finalAttrs) src;
  };

  dontUseBunBuild = true;
  dontUseBunPatch = true;
  dontUseBunCheck = true;

  cargoRoot = "src-tauri";
  buildAndTestSubdir = finalAttrs.cargoRoot;

  nativeBuildInputs = [
    bun
    bun2nix.hook
    cargo-tauri.hook
    pkg-config
    nodejs
    typescript
  ]
  ++ lib.optionals stdenv.hostPlatform.isLinux [
    wrapGAppsHook4
  ];

  buildInputs = lib.optionals stdenv.hostPlatform.isLinux [
    glib-networking
    openssl
    webkitgtk_4_1
  ];

  installPhase =
    let
      targetDir = "target/${stdenv.hostPlatform.rust.rustcTarget}/release";
    in
    ''
      runHook preInstall
      install -Dm755 "${targetDir}/${manifest.name}" "$out/bin/${manifest.name}"
      runHook postInstall
    '';

  meta = {
    description = "Led Strip Controller Tauri App";
    mainProgram = manifest.name;
  };
})
