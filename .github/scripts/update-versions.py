import json
import logging

logging.basicConfig(level=logging.INFO)

CARGO_TOML_FILE_PATH = "src-tauri/Cargo.toml"
CARGO_LOCK_FILE_PATH = "src-tauri/Cargo.lock"
NODE_PACKAGE_JSON_PATH = "package.json"


def find_current_version(node_package_json_path) -> str:
    with open(node_package_json_path, "r") as f:
        package_json = json.load(f)
        return package_json["version"]


def update_cargo_toml_version(cargo_toml_path: str, new_version: str):
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
):
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


def get_project_name(cargo_toml_path: str) -> str:
    with open(cargo_toml_path, "r") as f:
        lines = f.readlines()
        for line in lines:
            if line.startswith("name ="):
                return line.split("=")[1].strip().strip('"')
    raise ValueError("Project name not found in Cargo.toml")


def main():
    project_name = get_project_name(CARGO_TOML_FILE_PATH)
    logging.info(f"Project name from {CARGO_TOML_FILE_PATH}: {project_name}")
    current_version = find_current_version(NODE_PACKAGE_JSON_PATH)
    logging.info(f"Current version from {NODE_PACKAGE_JSON_PATH}: {current_version}")

    update_cargo_toml_version(CARGO_TOML_FILE_PATH, current_version)
    logging.info(f"Updated {CARGO_TOML_FILE_PATH} to version {current_version}")
    update_cargo_lock_version(CARGO_LOCK_FILE_PATH, current_version, project_name)
    logging.info(f"Updated {CARGO_LOCK_FILE_PATH} to version {current_version}")
    logging.info("Version update completed.")


if __name__ == "__main__":
    main()


