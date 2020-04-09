// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const http = require('https');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

let interval = null;

function paintQuote(status) {
	try {
		http.get("https://thesimpsonsquoteapi.glitch.me/quotes", (response) => {
			response.on('data', function (chunk) {
				const t = JSON.parse('' + chunk);
				const { quote, character } = t[0];
				status.text = `${quote} - ${character}`;
				status.show();
			});
		});
	} catch (error) {
		status.text = "Your luck is so bad! We couldn't get a quote";
		status.show();
	}
}

function resetDebounce(status){
	clearTimeout(interval);
	interval = setTimeout(() => {
		paintQuote(status);
	}, 2000);
}

function activate(context) {
	const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	context.subscriptions.push(status);
	vscode.workspace.onDidChangeTextDocument((e)=>{
		status.hide();
		resetDebounce(status);
	});
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
	clearTimeout(interval);
}

module.exports = {
	activate,
	deactivate
}
