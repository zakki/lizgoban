import { move2idx } from "./coord"
import { aa_new, aa_ref, aa_set, around_idx, Coordinate, empty, xor } from "./util"
import { IHistory, IStone } from "./game"

// illegal moves are not checked (ko, suicide, occupied place, ...)

interface IState {
    hope: Coordinate[];
    dead_pool: any[];
    dead_map: any[][];
    is_black: any;
    stones: IStone[][];
}

export function stones_from_history(history: IHistory[]) {
    const stones = aa_new(19, 19, () => ({} as IStone))
    history.forEach((h, k) => put(h, stones, k === history.length - 1))
    return stones
}

function put({move, is_black}, stones: IStone[][], last) {
    const [i, j] = move2idx(move), pass = (i < 0); if (pass) {return}
    aa_set(stones, i, j, {stone: true, black: is_black, ...(last ? {last} : {})})
    remove_dead_by([i, j], is_black, stones)
}

function remove_dead_by(ij, is_black, stones: IStone[][]) {
    around_idx(ij).forEach(idx => remove_dead(idx, !is_black, stones))
    remove_dead(ij, is_black, stones)
}

function remove_dead(ij, is_black, stones: IStone[][]) {
    const state: IState = {hope: [], dead_pool: [], dead_map: [[]], is_black, stones}
    check_if_liberty(ij, state)
    while (!empty(state.hope)) {
        if (search_for_liberty(state)) {return}
    }
    state.dead_pool.forEach(idx => aa_set(stones, idx[0], idx[1], {}))
}

function search_for_liberty(state: IState) {
    return around_idx(state.hope.shift()).find(idx => check_if_liberty(idx, state))
}

function check_if_liberty(ij: Coordinate, state: IState) {
    const s = aa_ref(state.stones, ...ij)
    return !s ? false : !s.stone ? true : (push_hope(ij, s, state), false)
}

function push_hope(ij: Coordinate, s, state) {
    if (xor(s.black, state.is_black) || aa_ref(state.dead_map, ...ij)) {return}
    state.hope.push(ij)
    state.dead_pool.push(ij); aa_set(state.dead_map, ij[0], ij[1], true)
}
