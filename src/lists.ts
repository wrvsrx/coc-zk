import {BasicList, ListAction, ListContext, ListItem, Neovim, commands, Uri, workspace} from 'coc.nvim';
import path from 'path';
import fs from 'fs';
import assert from 'assert';
import yargs from 'yargs';

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
  public readonly interactive = true
  public readonly description = 'CocList for zk';
  public readonly defaultAction = 'open';
  public actions: ListAction[] = [];

  constructor(nvim: Neovim) {
    super(nvim);
    this.addLocationActions()
  }

  public async loadItems(context: ListContext): Promise<ListItem[]> {
    const note_path = resolve_notebook_path();

    const argv = await yargs(context.args).options({
      tags: {type: 'array', alias: ['t', 'tag']},
      match: {type: 'array', alias: ['m', 'match']},
      matchStrategy: {type: 'string', alias: ['M', 'match-strategy']},
    }).argv;

    const argvMatch = argv.match ? argv.match.map(m => m.toString()) : [];
    const match = context.input ? [...argvMatch, context.input] : argvMatch;

    const notes: Note[] = await commands.executeCommand('zk.list', note_path, {
      select: ['title', 'path'],
      tags: argv.tags,
      match: match,
      matchStrategy: argv.matchStrategy,
    });

    return notes.map(note => ({
      label: (note.title ? note.title : note.path),
      location: Uri.file(path.join(note_path, note.path)).toString()
    }))
  }
}
