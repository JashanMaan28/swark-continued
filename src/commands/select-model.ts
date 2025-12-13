import * as vscode from "vscode";

interface ModelQuickPickItem extends vscode.QuickPickItem {
    label: string;
    description: string;
    detail: string;
    model: vscode.LanguageModelChat;
}

export class SelectModelCommand {
    public static async run(): Promise<void> {
        try {
            const availableModels = await vscode.lm.selectChatModels({
                vendor: "copilot",
            });

            if (availableModels.length === 0) {
                vscode.window.showErrorMessage(
                    "No GitHub Copilot models are available. Please ensure GitHub Copilot is set up correctly."
                );
                return;
            }

            // Create quick pick items from available models
            const modelItems: ModelQuickPickItem[] = availableModels.map((model: vscode.LanguageModelChat) => ({
                label: model.family,
                description: model.name,
                detail: `Version: ${model.version || "N/A"} | Max Input Tokens: ${model.maxInputTokens || "N/A"}`,
                model: model,
            }));

            // Sort by family name for consistency
            modelItems.sort((a: ModelQuickPickItem, b: ModelQuickPickItem) => a.label.localeCompare(b.label));

            // Show quick pick
            const selectedItem = await vscode.window.showQuickPick(modelItems, {
                placeHolder: "Select a language model for Swark",
                title: "Swark: Select Language Model",
            });

            if (selectedItem) {
                // Update the configuration
                const config = vscode.workspace.getConfiguration("swark");
                await config.update("languageModel", selectedItem.model.family, vscode.ConfigurationTarget.Global);

                vscode.window.showInformationMessage(
                    `Swark language model set to: ${selectedItem.model.family}`
                );
            }
        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to fetch available models: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }
}
