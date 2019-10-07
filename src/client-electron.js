// -*- coding: utf-8 -*-

const electron = require('electron'), ipcRenderer = electron.ipcRenderer
const current_window = electron.remote.getCurrentWindow()

export function setTitle(title) {
    current_window.setTitle(title);
}

export let ipc = {
    on: function(channel, f) {
        ipcRenderer.on(channel, (e, ...args) => f(...args));
    },
    send: function(channel, ...args) {
        ipcRenderer.send(channel, ...args);
    },
};
