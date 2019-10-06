// -*- coding: utf-8 -*-

//import * as io from 'socket.io-client';

export function setTitle(title: string) {
    document.title = title;
}

const socket = io.connect();

export let ipc = {
    on: function(channel: string, f: any) {
        console.log("on", channel, f);
        socket.on(channel, f);
    },
    send: function(channel: string, ...args: any) {
        console.log("send", channel, args);
        socket.emit(channel, ...args);
    },
};
