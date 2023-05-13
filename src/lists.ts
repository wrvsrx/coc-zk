import {BasicList, ListAction, ListContext, ListItem, Neovim, commands, Uri} from 'coc.nvim';
import path from 'path';

type Note = {
  title?: string;
  path: string;
};

export default class DemoList extends BasicList {
  public readonly name = 'demo_list';
  public readonly description = 'CocList for coc-zk';
  public readonly defaultAction = 'open';
  public actions: ListAction[] = [];

  constructor(nvim: Neovim) {
    super(nvim);
    this.addLocationActions()
  }

  public async loadItems(context: ListContext): Promise<ListItem[]> {
    const note_path = '/home/wrvsrx/Documents/note/zk'
    let a: Note[] = await commands.executeCommand('zk.list', note_path, {select: ['title', 'path']})

    return a.map(note => ({
      label: note.title ? note.title : note.path,
      location: Uri.file(path.join(note_path, note.path)).toString()
    }))
  }
}
