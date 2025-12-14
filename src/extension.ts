import * as vscode from "vscode";
import { telemetry, initializeTelemetry } from "./telemetry";
import { CreateArchitectureCommand } from "./commands/create-architecture";
import { SelectModelCommand } from "./commands/select-model";

/**
 * Initialize the extension: set up telemetry, register commands, and record activation.
 *
 * @param context - The extension context used to register disposables (commands and other subscriptions)
 */
export function activate(context: vscode.ExtensionContext): void {
    initializeTelemetry();
    registerCommands(context);
    telemetry.sendTelemetryEvent("extensionActivated");
}

/**
 * Register extension commands and add their disposables to the extension context.
 *
 * Registers the "swark.architecture" and "swark.selectModel" commands and pushes their disposables
 * into the provided extension context's subscriptions for automatic cleanup.
 *
 * @param context - The VS Code extension context used to store command disposables
 */
function registerCommands(context: vscode.ExtensionContext): void {
    const architectureCommand = vscode.commands.registerCommand("swark.architecture", async () => {
        await CreateArchitectureCommand.run();
    });

    const selectModelCommand = vscode.commands.registerCommand("swark.selectModel", async () => {
        await SelectModelCommand.run();
    });

    context.subscriptions.push(architectureCommand, selectModelCommand);
}

/**
 * Clean up extension resources when the extension is deactivated.
 *
 * Sends an "extensionDeactivated" telemetry event and disposes telemetry resources.
 */
export async function deactivate(): Promise<void> {
    telemetry.sendTelemetryEvent("extensionDeactivated");
    await telemetry.dispose();
}