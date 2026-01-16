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

rustPlatform.buildRustPackage (finalAttrs: {
  pname = "led-strip-controller-tauri-app";
  version = "2.0.3";
  src = ./.;
  bunDeps = bun2nix.fetchBunDeps {
    bunNix = import ./bun.nix;
  };

  dontUseBunBuild = true;
  dontUseBunPatch = true;
  dontUseBunCheck = true;

  cargoRoot = "./src-tauri";
  buildAndTestSubdir = finalAttrs.cargoRoot;

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

  buildPhase = ''
    export HOME=$TMPDIR
    export BUN_INSTALL_CACHE=$bunDeps
    export PATH=$bun/bin:$PATH

    echo "Installing Bun dependencies offline..."
    bun install --offline
    bun tauri build --no-sign --release
  '';

  installPhase = ''
    mkdir -p $out
    cp -r dist/* $out/
  '';
  meta = {
    description = "Led Strip Controller Tauri App";
    mainProgram = "led-strip-controller-tauri-app";
  };
})
