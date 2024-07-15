import {commands, ExtensionContext, listManager, workspace, LanguageClient, services, ServerOptions, LanguageClientOptions} from 'coc.nvim';
import ZkList from './lists';
import {resolve_notebook_path} from './notebook';

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration('zk')
  if (!config.enabled) {
    return;
  }

  const disabledFeatures = config.get<string[]>('disabledFeatures', [])
  const isEnable = config.get<boolean>('enable', true)
  if (!isEnable) {
    return
  }

  const serverOptions: ServerOptions = {
    command: 'zk',
    args: ['lsp']
  }
  const clientOptions: LanguageClientOptions = {
    documentSelector: ['pandoc', 'markdown'],
    disabledFeatures,
  }
  const client = new LanguageClient(
    'zk', // the id
    'zk', // the name of the language server
    serverOptions,
    clientOptions
  )
  context.subscriptions.push(services.registerLanguageClient(client))
  context.subscriptions.push(listManager.registerList(new ZkList(workspace.nvim)));
  context.subscriptions.push(commands.registerCommand('coc-zk.new', async (...args: any[]) => {
    const res: {path: string, content: string} = await commands.executeCommand('zk.new', resolve_notebook_path(), ...args)
    workspace.openResource(res.path)
  }))
}
