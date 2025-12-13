import * as vscode from "vscode";
import { ModelInteractor } from "../llm/model-interactor";

interface ModelQuickPickItem extends vscode.QuickPickItem {
    label: string;
    description: string;
    detail: string;
    model: vscode.LanguageModelChat;
}

export class SelectModelCommand {
    public static async run(): Promise<void> {
        try {
            // Use ModelInteractor to get available models
            const availableModels = await ModelInteractor.getAvailableModelsForSelection();

            if (availableModels.length === 0) {
                vscode.window.showErrorMessage(
                    "No GitHub Copilot models are available. Please ensure GitHub Copilot is properly configured. " +
                        "For more information, visit: https://code.visualstudio.com/docs/copilot/getting-started-chat"
                );
                return;
            }

            // Get current configured model
            const config = vscode.workspace.getConfiguration("swark");
            const currentModel = config.get<string>("languageModel") || "gpt-4o";

            // Create quick pick items from available models
            const modelItems: ModelQuickPickItem[] = availableModels.map((model: vscode.LanguageModelChat) => {
                const isCurrent = model.family === currentModel;
                return {
                    label: isCurrent ? `$(check) ${model.family}` : model.family,
                    description: isCurrent ? "(Current)" : model.name,
                    detail: `Version: ${model.version || "N/A"} | Max Input Tokens: ${
                        model.maxInputTokens || "N/A"
                    } | Vendor: ${model.vendor}`,
                    model: model,
                };
            });

            // Sort by family name for consistency, but keep current selection at top
            modelItems.sort((a: ModelQuickPickItem, b: ModelQuickPickItem) => {
                const aIsCurrent = a.description === "(Current)";
                const bIsCurrent = b.description === "(Current)";
                if (aIsCurrent && !bIsCurrent) {
                    return -1;
                }
                if (!aIsCurrent && bIsCurrent) {
                    return 1;
                }
                return a.label.localeCompare(b.label);
            });

            // Show quick pick with information about dynamic fetching
            const selectedItem = await vscode.window.showQuickPick(modelItems, {
                placeHolder: `Select a language model for Swark (${modelItems.length} models available from GitHub Copilot)`,
                title: "Swark: Select Language Model",
                matchOnDescription: true,
                matchOnDetail: true,
            });

            if (selectedItem) {
                const selectedFamily = selectedItem.model.family;

                // Update the configuration
                const config = vscode.workspace.getConfiguration("swark");
                await config.update("languageModel", selectedFamily, vscode.ConfigurationTarget.Global);

                // Validate the selection
                const isValid = await ModelInteractor.validateModelFamily(selectedFamily);

                if (isValid) {
                    vscode.window.showInformationMessage(
                        `✓ Swark language model successfully set to: ${selectedFamily}`
                    );
                } else {
                    vscode.window.showWarningMessage(
                        `Model "${selectedFamily}" was set but may not be currently available. ` +
                            `Swark will use a fallback model if needed.`
                    );
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(
                `Failed to fetch available models from GitHub Copilot: ${errorMessage}. ` +
                    `Please ensure GitHub Copilot is properly configured.`
            );
            console.error("Error in SelectModelCommand:", error);
        }
    }
}
