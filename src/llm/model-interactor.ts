import * as vscode from "vscode";
import { telemetry } from "../telemetry";

export class ModelInteractor {
    private static readonly FALLBACK_MODEL = "gpt-4o";

    public static async getModel(): Promise<vscode.LanguageModelChat> {
        const availableModels = await this.getAvailableModels();
        const configuredModel = this.getConfiguredModel();
        const fallbackModel = this.FALLBACK_MODEL;
        const selectedModel = this.selectModel(availableModels, configuredModel, fallbackModel);

        this.sendModelSelectedTelemetry(selectedModel, configuredModel, fallbackModel, availableModels);
        return selectedModel;
    }

    private static async getAvailableModels(): Promise<vscode.LanguageModelChat[]> {
        const availableModels = await vscode.lm.selectChatModels({
            vendor: "copilot",
        });
        console.log(availableModels);

        if (availableModels.length === 0) {
            throw new Error(
                "GitHub Copilot models could not be found. To resolve this, try interacting with GitHub Copilot manually. " +
                    "For more information, visit: https://code.visualstudio.com/docs/copilot/getting-started-chat"
            );
        }

        return availableModels;
    }

    private static getConfiguredModel(): string {
        const config = vscode.workspace.getConfiguration("swark");
        const configuredModel = config.get<string>("languageModel");
        console.log("configuredModel: " + configuredModel);

        if (!configuredModel || configuredModel.trim() === "") {
            throw new Error(
                'Language model is not configured. Please set "swark.languageModel" setting or run "Swark: Select Language Model" command.'
            );
        }

        // Validate that the configured value is a reasonable string
        if (configuredModel.length > 100) {
            vscode.window.showWarningMessage(
                `Configured model name "${configuredModel.substring(0, 50)}..." is unusually long. ` +
                    `Please verify your "swark.languageModel" setting or use "Swark: Select Language Model" to choose a valid model.`
            );
        }

        return configuredModel.trim();
    }

    private static selectModel(
        availableModels: vscode.LanguageModelChat[],
        configuredModelFamily: string,
        fallbackModelFamily: string
    ): vscode.LanguageModelChat {
        // First, try to find the configured model
        const configuredModel = this.findModel(availableModels, configuredModelFamily);

        if (configuredModel) {
            console.log(`Using configured model: ${configuredModelFamily}`);
            return configuredModel;
        }

        // Configured model not found, try fallback
        console.log(
            `Configured model "${configuredModelFamily}" not found in available models. Attempting fallback to "${fallbackModelFamily}"...`
        );

        const fallbackModel = this.findModel(availableModels, fallbackModelFamily);

        if (fallbackModel) {
            this.showModelNotAvailableMessage(configuredModelFamily, fallbackModelFamily, availableModels, true);
            return fallbackModel;
        }

        // Fallback also not available, use first available model
        const someModel = availableModels[0];
        console.log(
            `Fallback model "${fallbackModelFamily}" also not found. Using first available model: ${someModel.family}`
        );
        this.showModelNotAvailableMessage(configuredModelFamily, someModel.family, availableModels, false);
        return someModel;
    }

    private static findModel(
        availableModels: vscode.LanguageModelChat[],
        modelFamily: string
    ): vscode.LanguageModelChat | undefined {
        return availableModels.find((model) => model.family === modelFamily);
    }

    private static showModelNotAvailableMessage(
        configuredModelFamily: string,
        alternativeModelFamily: string,
        availableModels: vscode.LanguageModelChat[],
        isFallback: boolean
    ): void {
        const messageType = isFallback ? "warning" : "error";
        const explanation = isFallback
            ? "Falling back to default model."
            : "Both configured and default models are unavailable.";

        const message =
            `The configured language model "${configuredModelFamily}" is not available from GitHub Copilot. ` +
            `${explanation} Using "${alternativeModelFamily}" instead.\n\n` +
            `Available models: ${this.availableModelsToString(availableModels)}\n\n` +
            `To select a valid model, click "Select Model" below or run the "Swark: Select Language Model" command.`;

        const showMessage =
            messageType === "warning" ? vscode.window.showWarningMessage : vscode.window.showErrorMessage;

        showMessage(message, "Select Model", "Settings").then((selection) => {
            if (selection === "Select Model") {
                vscode.commands.executeCommand("swark.selectModel");
            } else if (selection === "Settings") {
                vscode.commands.executeCommand("workbench.action.openSettings", "swark.languageModel");
            }
        });
    }

    private static sendModelSelectedTelemetry(
        model: vscode.LanguageModelChat,
        configuredModel: string,
        fallbackModel: string,
        availableModels: vscode.LanguageModelChat[]
    ): void {
        telemetry.sendTelemetryEvent(
            "modelSelected",
            {
                name: model.name,
                id: model.id,
                vendor: model.vendor,
                family: model.family,
                version: model.version,
                configuredModel,
                fallbackModel,
                availableModels: this.availableModelsToString(availableModels),
            },
            { maxInputTokens: model.maxInputTokens }
        );
    }

    private static availableModelsToString(availableModels: vscode.LanguageModelChat[]): string {
        return availableModels.map((model) => model.family).join(", ");
    }

    /**
     * Get all available models from GitHub Copilot.
     * This method is public to allow other commands (like select-model) to access available models.
     */
    public static async getAvailableModelsForSelection(): Promise<vscode.LanguageModelChat[]> {
        return await this.getAvailableModels();
    }

    /**
     * Validate if a given model family exists in the available models.
     * Returns true if valid, false otherwise.
     */
    public static async validateModelFamily(modelFamily: string): Promise<boolean> {
        try {
            const availableModels = await this.getAvailableModels();
            const model = this.findModel(availableModels, modelFamily);
            return model !== undefined;
        } catch (error) {
            console.error("Error validating model family:", error);
            return false;
        }
    }

    public static async sendPrompt(
        model: vscode.LanguageModelChat,
        prompt: vscode.LanguageModelChatMessage[]
    ): Promise<string> {
        try {
            const response = await model.sendRequest(prompt, {});
            return await this.readStream(response);
        } catch (error) {
            if (error instanceof vscode.LanguageModelError) {
                console.error(error.message, error.code, error.cause);
            } else {
                console.error(error);
            }
            throw error;
        }
    }

    private static async readStream(response: vscode.LanguageModelChatResponse): Promise<string> {
        let content = "";
        for await (const chunk of response.text) {
            content += chunk;
        }
        return content;
    }
}
