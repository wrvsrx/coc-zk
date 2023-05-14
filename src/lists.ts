import {BasicList, ListAction, ListContext, ListItem, Neovim, commands, Uri, workspace} from 'coc.nvim';
import path from 'path';
import fs from 'fs';
import assert from 'assert';

type Note = {
  title?: string;
  path: string;
};

function is_notebook_dir(p: string) {
  return fs.existsSync(path.join(p, ".zk"))
}

function resolve_notebook_path() {
  const cwd = workspace.root;
  assert(is_notebook_dir(cwd), 'current workspace is not a zk directory');
  return cwd
}

export default class ZkList extends BasicList {
  public readonly name = 'zk';
  public readonly description = 'CocList for zk';
  public readonly defaultAction = 'open';
  public actions: ListAction[] = [];

  constructor(nvim: Neovim) {
    super(nvim);
    this.addLocationActions()
  }

  public async loadItems(context: ListContext): Promise<ListItem[]> {
    const note_path = resolve_notebook_path();
    let notes: Note[] = await commands.executeCommand('zk.list', note_path, {select: ['title', 'path']})

    return notes.map(note => ({
      label: note.title ? note.title : note.path,
      location: Uri.file(path.join(note_path, note.path)).toString()
    }))
  }
}
