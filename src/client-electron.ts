// -*- coding: utf-8 -*-

const electron = require('electron'), ipcRenderer = electron.ipcRenderer
const current_window = electron.remote.getCurrentWindow()

export function setTitle(title: string) {
    current_window.setTitle(title);
}

export let ipc = {
    on: function(channel: string, f: any) {
        ipcRenderer.on(channel, (e, ...args) => f(...args));
    },
    send: function(channel: string, ...args: any) {
        ipcRenderer.send(channel, ...args);
    },
};
