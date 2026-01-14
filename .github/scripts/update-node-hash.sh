#!/usr/bin/env bash
# Script to automatically update the node_modules hash in flake.nix

set -e

echo "Getting current hash from node dependencies..."

# Set a dummy hash to force a rebuild
sed -i.bak 's/outputHash = "sha256-.*";/outputHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";/' flake.nix

# Try to build and capture the actual hash
echo "Building to get the correct hash..."
NEW_HASH=$(nix build .#default 2>&1 | grep -oP "got:\s+\Ksha256-[A-Za-z0-9+/=]+" || true)

if [ -z "$NEW_HASH" ]; then
	echo "Error: Could not extract hash. Restoring original flake.nix"
	mv flake.nix.bak flake.nix
	exit 1
fi

echo "New hash: $NEW_HASH"

# Update the flake with the new hash
sed -i.bak "s/outputHash = \"sha256-.*\";/outputHash = \"$NEW_HASH\";/" flake.nix
rm flake.nix.bak

echo "✓ Updated flake.nix with new hash: $NEW_HASH"
echo "Run 'nix build .#default' to build with the new hash"
