const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
		const changes = event.contentChanges;

        changes.forEach((change) => {
			if(change.text == "-"){
				const start = new vscode.Position(
					change.range.end.line,
					Math.max(change.range.end.character - 4, 0)
				);
				const end = new vscode.Position(
					change.range.end.line,
					change.range.end.character + 1
				);
				const changedText = event.document.getText(new vscode.Range(start, end));
				
				if(changedText == "-----"){
					const editor = vscode.window.activeTextEditor;
					if (editor) {
						editor.edit((editBuilder) => {
							let comment = getLineComment(editor.document.languageId);
							if(comment != ""){
								editBuilder.delete(new vscode.Range(start, end));
								editBuilder.insert(start, comment);
							}
						});
					}
				}
			}

			
			if(change.text == "="){
				const start = new vscode.Position(
					change.range.end.line,
					Math.max(change.range.end.character - 4, 0)
				);
				const end = new vscode.Position(
					change.range.end.line,
					change.range.end.character + 1
				);
				const changedText = event.document.getText(new vscode.Range(start, end));
				
				if(changedText == "====="){
					const editor = vscode.window.activeTextEditor;
					if (editor) {
						editor.edit((editBuilder) => {
							let comment = getBlockComment(editor.document.languageId, start.character);
							if(comment != ""){
								editBuilder.delete(new vscode.Range(start, end));
								editBuilder.insert(start, comment);
							}
						});
					}
				}
			}
        });
    });
	context.subscriptions.push(changeListener);
}


function getLineComment(lang){
	let snippet = "";
	switch (lang) {
		case "javascript":
		case "c":
		case "cpp":
		case "csharp":
		case "css":
		case "php":
		case "java":
			snippet = "/* ************************************************************************** */";
			break;
		
		case "python":
		case "yaml":
			snippet = "########################################################################";
			break;

		case "xml":
		case "html":
			snippet = "<!-- ======================================================================== -->";
			break;
		
		default:
			break;
	}
	return snippet;
}

function getBlockComment(lang, indent){
	let snippet = "";
	switch (lang) {
		case "javascript":
		case "c":
		case "cpp":
		case "csharp":
		case "css":
		case "php":
		case "java":
			snippet = "/* *****************************************************************************\n";
			for(let i = 0; i < indent; i++) snippet += " ";
			snippet += "* \n";
			for(let i = 0; i < indent; i++) snippet += " ";
			snippet += "***************************************************************************** */";
			break;

		case "python":
		case "yaml":
			snippet = "########################################################################\n";
			for(let i = 0; i < indent; i++) snippet += " ";
			snippet += "# \n";
			for(let i = 0; i < indent; i++) snippet += " ";
			snippet += "########################################################################";
			break;
		
		case "html":
		case "xml":
			snippet = "<!-- ============================================================================\n";
			for(let i = 0; i < indent; i++) snippet += " ";
			snippet += "| \n";
			for(let i = 0; i < indent; i++) snippet += " ";
			snippet += "============================================================================ -->";
			break;
		
		
		default:
			break;
	}
	return snippet;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
