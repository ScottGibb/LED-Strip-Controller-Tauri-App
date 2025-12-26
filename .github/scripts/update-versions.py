"""
A script to synchronize the version number in Cargo.toml and Cargo.lock with the version specified in package.json.
When performing a release-please workflow, this script ensures that the Rust project files reflect the correct version.
"""

import json
import logging
import os
import sys

logging.basicConfig(level=logging.INFO)

# Environment variable paths with defaults
CARGO_TOML_FILE_PATH = os.getenv("CARGO_TOML_FILE_PATH", "src-tauri/Cargo.toml")
CARGO_LOCK_FILE_PATH = os.getenv("CARGO_LOCK_FILE_PATH", "src-tauri/Cargo.lock")
NODE_PACKAGE_JSON_PATH = os.getenv("NODE_PACKAGE_JSON_PATH", "package.json")


def find_current_version(node_package_json_path) -> str:
    """
    Extracts the current version from the specified package.json file.
    :param node_package_json_path: Path to the package.json file
    :return: The current version string from package.json
    :rtype: str
    """
    with open(node_package_json_path, "r") as f:
        package_json = json.load(f)
        return package_json["version"]


def update_cargo_toml_version(cargo_toml_path: str, new_version: str) -> None | OSError:
    """
    Updates the version in the specified Cargo.toml file.
    :param cargo_toml_path: Path to the Cargo.toml file
    :param new_version: The new version string to set
    """
    with open(cargo_toml_path, "r") as f:
        lines = f.readlines()

    with open(cargo_toml_path, "w") as f:
        for line in lines:
            if line.startswith("version ="):
                logging.info(
                    f'Updating Cargo.toml version from {line.strip()} to version = "{new_version}"'
                )
                f.write(f'version = "{new_version}"\n')
            else:
                f.write(line)


def update_cargo_lock_version(
    cargo_lock_path: str, new_version: str, project_name: str
) -> None | OSError:
    """
    Updates the version in the specified Cargo.lock file for the given project.
    :param cargo_lock_path: Path to the Cargo.lock file
    :param new_version: The new version string to set
    :param project_name: The name of the project to update in Cargo.lock
    """
    with open(cargo_lock_path, "r") as f:
        lines = f.readlines()

    with open(cargo_lock_path, "w") as f:
        inside_project_section = False
        for line in lines:
            if line.strip() == f'name = "{project_name}"':
                inside_project_section = True
            elif line.startswith("name =") and inside_project_section:
                inside_project_section = False

            if inside_project_section and line.startswith("version ="):
                logging.info(
                    f'Updating Cargo.lock version from {line.strip()} to version = "{new_version}"'
                )
                f.write(f'version = "{new_version}"\n')
            else:
                f.write(line)


def get_project_name(cargo_toml_path: str) -> str | ValueError:
    """
    Extracts the project name from the specified Cargo.toml file.
    :param cargo_toml_path: Path to the Cargo.toml file
    :return: The project name string from Cargo.toml
    """
    with open(cargo_toml_path, "r") as f:
        lines = f.readlines()
        for line in lines:
            if line.startswith("name ="):
                return line.split("=")[1].strip().strip('"')
    raise ValueError("Project name not found in Cargo.toml")


def main() -> None:
    try:
        project_name = get_project_name(CARGO_TOML_FILE_PATH)
        logging.info(f"Project name from {CARGO_TOML_FILE_PATH}: {project_name}")
        current_version = find_current_version(NODE_PACKAGE_JSON_PATH)
        logging.info(
            f"Current version from {NODE_PACKAGE_JSON_PATH}: {current_version}"
        )

        update_cargo_toml_version(CARGO_TOML_FILE_PATH, current_version)
        logging.info(f"Updated {CARGO_TOML_FILE_PATH} to version {current_version}")
        update_cargo_lock_version(CARGO_LOCK_FILE_PATH, current_version, project_name)
        logging.info(f"Updated {CARGO_LOCK_FILE_PATH} to version {current_version}")
        logging.info("Version update completed.")
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
