#!/usr/bin/env node

const blessed = require('blessed');
const process = require('process');
const shell = require('shelljs');
const packageJson = require(`${process.cwd()}/package.json`);

const screen = blessed.screen({ smartCSR: true });
screen.title = 'ncrun';

const list = blessed.list({
  parent: screen,
  keys: true,
  vi: true,
  style: {
    selected: {
      fg: '#2e2e2e',
      bg: '#cecece',
    }
  },
  items: Object.keys(packageJson.scripts),
});

list.on('select', item => {
  screen.destroy();
  shell.echo(`Running --- ${item.getText()} ---`);
  if (shell.exec(`npm run ${item.getText()} --color always`).code !== 0) {
    shell.exit(1);
  }
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], () => shell.exit(1));

list.focus();
screen.render();
