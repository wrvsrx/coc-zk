import {workspace} from 'coc.nvim';
import path from 'path';
import fs from 'fs';
import assert from 'assert';

function is_notebook_dir(p: string) {
  return fs.existsSync(path.join(p, ".zk"))
}

export function resolve_notebook_path() {
  const cwd = workspace.root;
  assert(is_notebook_dir(cwd), 'current workspace is not a zk directory');
  return cwd
}
