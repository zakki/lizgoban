// coordinates converter

// idx [i][j] of array: [0][0] = left top, [0][18] = right top
// coord (x, y) on canvas: (0, 0) = left top, (width, 0) = right top
// move: "A19" = left top, "T19" = right top
// sgfpos: "aa" = left top, "sa" = right top

import { Coordinate, to_i } from "./util"

/////////////////////////////////////////////////
// idx <=> move

const col_name = 'ABCDEFGHJKLMNOPQRST'
export const board_size = col_name.length
const idx_pass: [number, number] = [-1, -1]

export function idx2move(i: number, j: number) {
    return (0 <= i) && (i < board_size) && (0 <= j) && (j < board_size) &&
        col_name[j] + (board_size - i)
}

export function move2idx(move: string): Coordinate {
    const m = move.match(/([A-HJ-T])((1[0-9])|[1-9])/)
    const [dummy, col, row] = m || []
    return m ? [board_size - to_i(row), col_name.indexOf(col)] : idx_pass
}

/////////////////////////////////////////////////
// idx <=> coord

function translator_pair([from1, from2]: Coordinate, [to1, to2]: Coordinate) {
    // [from1, from2] * scale + [shift, shift] = [to1, to2]
    const d = from2 - from1, scale = (to2 - to1) / d, shift = (from2 * to1 - from1 * to2) / d
    const trans = ((x: number) => x * scale + shift), inv = (z => (z - shift) / scale)
    return [trans, inv]
}

export function idx2coord_translator_pair(canvas: HTMLCanvasElement, xmargin: number, ymargin: number, is_square: boolean) {
    // u = j, v = i
    const [uv2xy, xy2uv] =
          uv2coord_translator_pair(canvas, [0, board_size - 1], [0, board_size - 1],
                                   xmargin, ymargin, is_square)
    return [((i, j) => uv2xy(j, i)), ((x, y) => xy2uv(x, y).reverse())]
}

export function uv2coord_translator_pair(canvas: HTMLCanvasElement,
    u_min_max: Coordinate, v_min_max: Coordinate,
    xmargin: number, ymargin: number,
    is_square = false) {
    // u: horizontal, v: vertical
    let w = canvas.width, h = canvas.height
    is_square && (w = h = Math.min(w, h))
    const [xtrans, xinv] = translator_pair(u_min_max, [xmargin, w - xmargin])
    const [ytrans, yinv] = translator_pair(v_min_max, [ymargin, h - ymargin])
    const to = (u: number, v: number) => [xtrans(u), ytrans(v)]
    const from = (x: number, y: number) => [Math.round(xinv(x)), Math.round(yinv(y))]
    return [to, from]
}

/////////////////////////////////////////////////
// sgfpos (<=> idx) <=> move

const sgfpos_name = "abcdefghijklmnopqrs"
const sgfpos_pass = "tt"

function idx2sgfpos(i: number, j: number) {
    return sgfpos_name[j] + sgfpos_name[i]
}

function sgfpos2idx(pos: string): [number, number] {
    if (pos === sgfpos_pass) {return idx_pass}
    const [j, i] = pos.split('').map(c => sgfpos_name.indexOf(c))
    return [i, j]
}

export function move2sgfpos(move: string) {
    // pass = 'tt'
    const [i, j] = move2idx(move)
    return i >= 0 ? idx2sgfpos(i, j) : sgfpos_pass
}

export function sgfpos2move(pos: string) {
    return idx2move(...sgfpos2idx(pos))
}
