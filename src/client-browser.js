// -*- coding: utf-8 -*-

export function setTitle(title) {
    document.title = title;
}

const socket = io.connect();

export let ipc = {
    on: function(channel, f) {
        console.log("on", channel, f);
        socket.on(channel, f);
    },
    send: function(channel, ...args) {
        console.log("send", channel, args);
        socket.emit(channel, ...args);
    },
};
