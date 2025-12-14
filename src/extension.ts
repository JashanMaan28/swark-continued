import * as vscode from "vscode";
import { telemetry, initializeTelemetry } from "./telemetry";
import { CreateArchitectureCommand } from "./commands/create-architecture";
import { SelectModelCommand } from "./commands/select-model";

export function activate(context: vscode.ExtensionContext): void {
    initializeTelemetry();
    registerCommands(context);
    telemetry.sendTelemetryEvent("extensionActivated");
}

function registerCommands(context: vscode.ExtensionContext): void {
    const architectureCommand = vscode.commands.registerCommand("swark-continued.architecture", async () => {
        await CreateArchitectureCommand.run();
    });

    const selectModelCommand = vscode.commands.registerCommand("swark-continued.selectModel", async () => {
        await SelectModelCommand.run();
    });

    context.subscriptions.push(architectureCommand, selectModelCommand);
}

export async function deactivate(): Promise<void> {
    telemetry.sendTelemetryEvent("extensionDeactivated");
    await telemetry.dispose();
}
