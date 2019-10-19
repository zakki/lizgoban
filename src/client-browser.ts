// -*- coding: utf-8 -*-

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


/////////////////////////////////////////////////
// another source of change: menu
/*
function update_menu() {
    get_windows().forEach(win => win.setMenu(menu_for_window(win)))
    buildFromTemplate(menu_template(win));
}

function menu_template(win) {
    const menu = (label, submenu) => ({label, submenu: submenu.filter(truep)})
    const stop_auto_and = f => ((...a) => {stop_auto(); f(...a)})
    const ask_sec = redoing => ((this_item, win) => ask_auto_play_sec(win, redoing))
    const item = (label, accelerator, click, standalone_only = false, enabled = false, keep_auto = false) =>
          !(standalone_only && attached) && {
              label, accelerator, click: keep_auto ? click : stop_auto_and(click),
              enabled: enabled || (enabled === undefined)
          }
    const sep = {type: 'separator'}
    const insert_if = (pred, ...items) => pred ? items : []
    const lz_white = P.leelaz_for_white_p()
    const dup = until_current_move_p =>
          () => duplicate_sequence(until_current_move_p, true)
    const file_menu = menu('File', [
        item('New empty board', 'CmdOrCtrl+N', new_empty_board, true),
        item('New handicap game', undefined, ask_handicap_stones, true),
        item('New window', 'CmdOrCtrl+Shift+N',
             (this_item, win) => new_window(window_prop(win).board_type === 'suggest' ?
                                            'variation' : 'suggest')),
        sep,
        item('Open SGF...', 'CmdOrCtrl+O', open_sgf, true),
        item('Save SGF...', 'CmdOrCtrl+S', save_sgf, true),
        sep,
        item('Reset', 'CmdOrCtrl+R', restart),
        lz_white ?
            item('Load weights for black', 'Shift+L', load_leelaz_for_black) :
            item('Load network weights', 'Shift+L', load_weight),
        item('Load engine', undefined, load_engine),
        sep,
        item('Close', undefined, (this_item, win) => win.close()),
        item('Quit', undefined, app.quit),
    ])
    const edit_menu = menu('Edit', [
        item('Copy SGF', 'CmdOrCtrl+C', copy_sgf_to_clipboard, true),
        item('Paste SGF', 'CmdOrCtrl+V', paste_sgf_from_clipboard, true),
        sep,
        item('Delete board', 'CmdOrCtrl+X', cut_sequence, true),
        item('Undelete board', 'CmdOrCtrl+Z', uncut_sequence, true,
             exist_deleted_sequence()),
        item('Duplicate board', 'CmdOrCtrl+D', dup(false), true),
        item('Duplicate until current move', 'CmdOrCtrl+K', dup(true), true),
        sep,
        {label: 'Trial board', type: 'checkbox', checked: game.trial,
         click: toggle_trial},
    ])
    const view_menu = menu('View', [
        board_type_menu_item('Two boards A (main+PV)', 'double_boards', win),
        board_type_menu_item('Two boards B (main+raw)', 'double_boards_raw', win),
        board_type_menu_item('Two boards C (raw+sub)', 'double_boards_swap', win),
        board_type_menu_item('Two boards D (raw+PV)', 'double_boards_raw_pv', win),
        board_type_menu_item('Suggestions', 'suggest', win),
        board_type_menu_item('Principal variation', 'variation', win),
        board_type_menu_item('Raw board', 'raw', win),
        board_type_menu_item('Winrate graph', 'winrate_only', win),
        sep,
        store_toggler_menu_item('Let me think first', 'let_me_think', 'Shift+M',
                                toggle_let_me_think),
        sep,
        store_toggler_menu_item('Lizzie style', 'lizzie_style'),
        store_toggler_menu_item('Expand winrate bar', 'expand_winrate_bar', 'Shift+B'),
        ...insert_if(P.katago_p(),
                     store_toggler_menu_item('Score bar', 'score_bar', 'Shift+C')),
        ...insert_if(P.leelaz_for_endstate_p(),
            sep,
            store_toggler_menu_item(`Endstate (diff: ${P.get_endstate_diff_interval()} moves)`, 'show_endstate', 'Shift+E'),
            item('...longer diff', '{', endstate_diff_interval_adder(1),
                 false, R.show_endstate, true),
            item('...shorter diff', '}', endstate_diff_interval_adder(-1),
                 false, R.show_endstate, true))
    ])
    const tool_menu = menu('Tool', [
        item('Auto replay', 'Shift+A', ask_sec(true), true),
        item('Self play', 'Shift+P', ask_sec(false), true),
        item('...Skip to next', 'CmdOrCtrl+E', skip_auto,
             true, auto_analyzing_or_playing(), true),
        sep,
        {label: 'Alternative weights for white', accelerator: 'CmdOrCtrl+Shift+L',
         type: 'checkbox', checked: lz_white,
         click: stop_auto_and(lz_white ?
                              P.unload_leelaz_for_white : load_leelaz_for_white)},
        lz_white ?
            item('Swap black/white weights', 'Shift+S',
                 P.swap_leelaz_for_black_and_white) :
            item('Switch to previous weights', 'Shift+S',
                 switch_to_previous_weight, false, !!previous_weight_file),
        sep,
        ...insert_if(P.support_komi_p(),
            item(`Komi (${P.get_engine_komi()})`, undefined, ask_engine_komi)),
        item('Tag / Untag', 'Ctrl+Space', tag_or_untag),
        has_sabaki && {label: 'Attach Sabaki', type: 'checkbox', checked: attached,
                       accelerator: 'CmdOrCtrl+T', click: toggle_sabaki},
        item('Info', 'CmdOrCtrl+I', info),
    ])
    const debug_menu = menu('Debug', [
        store_toggler_menu_item('Debug log', debug_log_key, null, toggle_debug_log),
        {role: 'toggleDevTools'},
    ])
    const help_menu = menu('Help', [
        item('Help', undefined, help),
    ])
    return [file_menu, edit_menu, view_menu, tool_menu,
            ...shortcut_menu_maybe(menu, item, win), debug_menu, help_menu]
}

function board_type_menu_item(label, type, win) {
    return {label, type: 'radio', checked: window_prop(win).board_type === type,
            click: (this_item, win) => set_board_type(type, win)}
}

function store_toggler_menu_item(label: string, key: string, accelerator?, on_click?) {
    const toggle_it = () => toggle_stored(key)
    return {label, accelerator, type: 'checkbox', checked: store.get(key),
            click: on_click || toggle_it}
}

function toggle_stored(key) {
    const val = !get_stored(key); set_stored(key, val); update_state(); return val
}

function shortcut_menu_maybe(menu, item, win) {
    // option.shortcut = [rule, rule, ...]
    // rule = {label: "mixture", accelerator: "F2", board_type: "raw",
    //         empty_board: true, leelaz_command: "/foo/leelaz",
    //         leelaz_args: ["-g", "-w", "/foo/227.gz"],
    //         weight_file: "/foo/035.gz", "weight_file_for_white": "/foo/157.gz"}
    if (!option.shortcut) {return []}
    const doit = a => (wink(), apply_option_shortcut(a, win))
    const shortcut_menu_item = a => item(a.label, a.accelerator, () => doit(a), true)
    return [menu('Shortcut', option.shortcut.map(shortcut_menu_item))]
}

function apply_option_shortcut(rule, win) {
    // merge rule.option for backward compatibility to 1a88dd40
    const a = merge({}, rule, rule.option || {})
    const {empty_board, board_type, weight_file, weight_file_for_white,
           engine_for_white} = a
    const {leelaz_command, leelaz_args} = merge({}, option, a)
    const need_restart = (a.leelaz_command !== option.leelaz_command) ||
          (a.leelaz_args !== option.leelaz_args)
    const load = (switcher, file) => switcher(() => load_weight_file(file))
    empty_board && !game.is_empty() && new_empty_board()
    board_type && set_board_type(board_type, win)
    need_restart && merge_option_and_restart({leelaz_command, leelaz_args})
    weight_file && load(P.load_leelaz_for_black, weight_file)
    weight_file_for_white ? load(P.load_leelaz_for_white, weight_file_for_white) :
        P.unload_leelaz_for_white()
    engine_for_white && P.set_engine_for_white(engine_for_white)
    resume()
}

function merge_option_and_restart(opts) {
    P.unload_leelaz_for_white(); kill_all_leelaz()
    merge(option, opts); start_leelaz()
}
*/