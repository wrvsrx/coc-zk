import {commands, CompleteResult, ExtensionContext, listManager, sources, window, workspace, LanguageClient, services, ServerOptions} from 'coc.nvim';
import DemoList from './lists';

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration('coc-zk')
  const isEnable = config.get<boolean>('enable', true)
  if (!isEnable) {
    return
  }

  const serverOptions: ServerOptions = {
    command: 'zk',
    args: ['lsp']
  }
  const clientOptions = {documentSelector: ['pandoc', 'markdown'], }
  const client = new LanguageClient(
    'zk', // the id
    'zk', // the name of the language server
    serverOptions,
    clientOptions
  )
  context.subscriptions.push(services.registLanguageClient(client))

  context.subscriptions.push(
    // commands.registerCommand('coc-zk.list', async () => {
    //   window.showMessage(`coc-zk Commands works!`);
    // }),
    //
    // listManager.registerList(new DemoList(workspace.nvim)),
  );
}
