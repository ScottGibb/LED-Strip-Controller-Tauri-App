#!/usr/bin/env bash
# Helper script to update the frontend outputHash in flake.nix
#
# Usage: ./update-hash.sh
#
# This script will:
# 1. Try to build the frontend derivation
# 2. Extract the correct hash from the error message
# 3. Update flake.nix with the correct hash

set -e

echo "Building frontend to get the correct hash..."
echo "This will fail with a hash mismatch - that's expected!"
echo ""

# Try to build and capture the output
if output=$(nix build .#packages.x86_64-linux.default.frontend 2>&1); then
    echo "✅ Build succeeded! Hash is already correct."
    exit 0
fi

# Extract the hash from the error message
if correct_hash=$(echo "$output" | grep -oP 'got:\s+\Ksha256-[A-Za-z0-9+/=]+' | head -1); then
    echo ""
    echo "Found correct hash: $correct_hash"
    echo "Updating flake.nix..."
    
    # Update the hash in flake.nix
    sed -i "s|outputHash = \"sha256-[^\"]*\";|outputHash = \"$correct_hash\";|" flake.nix
    
    echo "✅ Updated flake.nix with correct hash"
    echo ""
    echo "You can now build with: nix build"
else
    echo "❌ Could not extract hash from error message"
    echo "Please check the error output above and update flake.nix manually"
    exit 1
fi
