# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 🔄 Swark Continued Fork

**Note**: This is a community-maintained fork of the original [Swark project](https://github.com/swark-io/swark). Changes below this line are specific to the fork.

## [Unreleased] - Swark Continued

### Added

-   N/A

### Changed

-   N/A

### Fixed

-   N/A

## [1.5.0](https://github.com/JashanMaan28/swark-continued/releases/tag/v1.5.0) - 2025-12-13

### Added

-   **Dynamic Model Selection Command**: New `Swark Continued: Select Language Model` command that displays all currently available GitHub Copilot models
    -   Shows model details: name, version, max input tokens, and vendor
    -   Highlights currently selected model with a checkmark
    -   Validates selection after configuration update
-   **Runtime Validation**: Comprehensive validation for `swark-continued.languageModel` configuration
    -   Validates model availability at runtime against GitHub Copilot's current models
    -   Three-tier fallback strategy: configured → default (`gpt-4o`) → first available
    -   Distinguishes between fallback scenarios with appropriate warning/error levels
-   **Enhanced Error Messages**: Clear, actionable feedback when configured models are unavailable
    -   Lists all currently available models in error messages
    -   Provides action buttons: "Select Model" and "Settings"
    -   Different message types (warning/error) based on fallback severity

### Changed

-   **FORK CREATED**: Community-maintained fork "Swark Continued" created by Jashanpreet Singh (JashanMaan28)
-   Rebranded extension to "Swark Continued" to distinguish from original project
-   Updated extension ID to `JashanMaan28.swark-continued`
-   Changed command namespace from `swark.*` to `swark-continued.*`
-   Changed configuration namespace from `swark.*` to `swark-continued.*`
-   Updated all repository references to `https://github.com/JashanMaan28/swark-continued`
-   Removed hardcoded `enum` constraint from language model setting for forward compatibility with new models
-   Enhanced settings documentation explaining runtime validation and fallback behavior
-   Updated all documentation for fork branding (README, CONTRIBUTING, CHANGELOG)

### Inherited from Original Swark v1.4.3

-   Automatic Mermaid cycle fix capability to prevent diagram rendering issues
-   Support for `lua` and `dart` programming languages
-   Support for Gemini 2.0 Flash and OpenAI o3-mini language models
-   Link to change configured language model in output
-   GitHub Copilot extension set as dependency

### Configuration

-   Removed hardcoded `enum` constraint from language model setting for forward compatibility
-   Configuration namespace: `swark-continued.*` (changed from `swark.*`)
-   Commands: `swark-continued.architecture` and `swark-continued.selectModel`

### Maintained

-   All original functionality preserved
-   AGPL-3.0 license maintained
-   Full attribution to original Swark team
-   Compatible with VS Code 1.91.0+
-   Requires GitHub Copilot extension

---

## Original Swark Project Changelog

The following entries are from the original Swark project. For the latest original project updates, visit: https://github.com/swark-io/swark

## [1.4.3](https://github.com/swark-io/swark/compare/v1.4.2...v1.4.3) - 2025-03-21

### Added

-   Support `lua` and `dart` programming languages.
-   Support Gemini 2.0 Flash language model.

## [1.4.2](https://github.com/swark-io/swark/compare/v1.4.0...v1.4.2) - 2025-02-01

### Added

-   Add "OpenAI o3-mini" to available models.

### Changed

-   Update the output with usage instructions.

## [1.4.0](https://github.com/swark-io/swark/compare/v1.3.10...v1.4.0) - 2025-01-18

### Added

-   Added automatic Mermaid cycle fix capability to prevent diagram rendering issues. ([#7](https://github.com/swark-io/swark/issues/7))
-   Added link to change the configured language model in Swark's output.

## [1.3.10](https://github.com/swark-io/swark/compare/v1.3.9...v1.3.10) - 2025-01-14

### Changed

-   Set GitHub copilot extension as a dependency, as it is required in order for Swark to work.

## [1.3.9](https://github.com/swark-io/swark/compare/v1.3.8...v1.3.9) - 2025-01-12

### Added

-   Add a check for cycles in the mermaid diagram ([#7](https://github.com/swark-io/swark/issues/7))

## [1.3.8](https://github.com/swark-io/swark/compare/v1.3.7...v1.3.8) - 2025-01-10

### Changed

-   Updated multiple sections of README.md.
-   Reduce extension size by removing `demo.gif` from package.
-   Throw an error when no files found in the selected folder, and instruct to update the file extensions setting.

## [1.3.7](https://github.com/swark-io/swark/compare/v1.3.6...v1.3.7) - 2025-01-09

### Changed

-   Change default model from `claude-3.5-sonnet` to `gpt-4o`, due to claude being not available for many users.

## [1.3.6](https://github.com/swark-io/swark/compare/v1.3.5...v1.3.6) - 2025-01-08

### Fixed

-   Extract Mermaid block from LLM to ensure proper rendering of diagram and link creation. ([#8](https://github.com/swark-io/swark/issues/8))

## [1.3.5](https://github.com/swark-io/swark/compare/v1.3.4...v1.3.5) - 2025-01-07

### Changed

-   Improve error message when no language model is available.
-   Default to `gpt-4o` when configured model is not available.
-   Add telemetry of available models.

## [1.3.4](https://github.com/swark-io/swark/compare/v1.3.0...v1.3.4) - 2024-12-31

### Changed

-   Show progress in VS Code when prompting the LLM.

## [1.3.0](https://github.com/swark-io/swark/compare/v1.2.0...v1.3.0) - 2024-12-26

### Added

-   Add extension deactivation telemetry.
-   Add telemetry of programming languages used.
-   Write diagram to file in path `workspace/swark-output/timestamp__diagram.md`, e.g. `swark/swark-output/2024-12-25__20-25-34__diagram.md`.
-   Write log file that includes the run information and files used. Path: `workspace/swark-output/timestamp__log.md`.

## [1.2.0](https://github.com/swark-io/swark/compare/v1.1.1...v1.2.0) - 2024-12-23

### Added

-   Generate links to Mermaid Live Editor to view or edit the diagram. ([#4](https://github.com/swark-io/swark/issues/4))

### Changed

-   Set default model to `claude-3.5-sonnet`.

## [1.1.1](https://github.com/swark-io/swark/compare/v1.1.0...v1.1.1) - 2024-12-22

### Fixed

-   Fixed duplicate logo rendering on Visual Studio Marketplace (both light and dark mode logos showed).

## [1.1.0](https://github.com/swark-io/swark/compare/ee950ecbff51bed7e65e2e008767fec5a235c953...v1.1.0) - 2024-12-22

### Added

-   Support additional language models: `gpt-4o`, `openai-o1`, `claude-3.5-sonnet`.
-   Users can now configure the language model to use via the language model setting.

### Changed

-   Modify prompt to not generate additional text besides the architecture diagram.

## 1.0.0 - 2024-11-30

### Added

-   Initial release of Swark VS Code extension.
-   Extension contributes architecture command to automatically create an architecture diagram from code.
