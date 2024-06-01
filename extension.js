const vscode = require('vscode');

/**
* @param {vscode.ExtensionContext} context
*/

function activate(context) {
    console.log('Extension Activated!');
    resetWorkspaceColors()

    // Function to check for errors and warnings in the current active editor
    const checkForDiagnostics = async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const uri = editor.document.uri;
        const diagnostics = vscode.languages.getDiagnostics(uri);

        // Check for errors and warnings
        const hasErrors = diagnostics.some(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error);
        const hasWarnings = diagnostics.some(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Warning);

        if (hasErrors) {
            console.log("error");
            changeEditorBackgroundColor("#FF000026")
        } else if (hasWarnings) {
            console.log("warning");
            changeEditorBackgroundColor("#FFFF0026")
        } else {
            console.log("none");
            changeEditorBackgroundColor("#00FF0026")
        }
    };

    // Event listener for when the active text editor changes
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(() => {
        checkForDiagnostics();
    }));

    // Event listener for when the diagnostics change
    context.subscriptions.push(vscode.languages.onDidChangeDiagnostics(() => {
        checkForDiagnostics();
    }));
}

function changeEditorBackgroundColor(color) {
    const config = vscode.workspace.getConfiguration();
    config.update('workbench.colorCustomizations', {
        "activityBar.background": color,
        "titleBar.activeBackground": color,
        "titleBar.inactiveBackground": color,
        "statusBar.background": color,
        "statusBar.noFolderBackground": color
    }, vscode.ConfigurationTarget.Global).then(() => {
        //vscode.window.showInformationMessage('Editor background color changed!');
    }, (error) => {
        //vscode.window.showErrorMessage('Failed to change editor background color: ' + error);
    });
}

function resetWorkspaceColors() {
    const config = vscode.workspace.getConfiguration();
    config.update('workbench.colorCustomizations', {}, vscode.ConfigurationTarget.Global).then(() => {
        // vscode.window.showInformationMessage('Workspace colors reset to default!');
    }, (error) => {
        // vscode.window.showErrorMessage('Failed to reset workspace colors: ' + error);
    });
}

function deactivate() {
    resetWorkspaceColors()
    console.log('Extension Deactivated!');
}

module.exports = {
    activate,
    deactivate
}