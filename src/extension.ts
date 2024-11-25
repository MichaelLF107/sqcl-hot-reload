import * as vscode from "vscode";
import { exec } from "child_process";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.workspace.onDidSaveTextDocument((document) => {
    if (document.languageId.toLowerCase() === "sql" || document.fileName.toLowerCase().endsWith(".sql")) {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
      if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder is opened');
        return;
      }

      exec(`cd "${workspaceFolder}" && sqlc generate`, (error, _, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(`SQLC Generate failed: ${error.message}`);
          return;
        }
        if (stderr) {
          vscode.window.showInformationMessage(`SQLC Generate completed with warnings`);
        } else {
          vscode.window.showInformationMessage(`SQLC Generate completed successfully`);
        }
      });
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
