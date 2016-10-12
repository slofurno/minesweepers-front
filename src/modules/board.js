import { combineReducers } from 'redux'

const COLS = 100
const ROWS = 100

function ENUM(n) {
  const ret = []
  for(let i = 0; i < n; i++){
    ret.push(i)
  }
  return ret
  //return [].slice.call('.'.repeat(n))
}

//const initial = ENUM(ROWS).map(() => ENUM(COLS))
//

function defaultSquare(row, col) {
  return {
    type: 'empty',
    revealed: false,
    row,
    col
  }
}

const initial = {}
const _keys = []

for(let j = 0; j < COLS; j++){
  for(let i = 0; i < ROWS; i++){
    initial[[i, j]] = defaultSquare(i, j)
    _keys.push([i,j])
  }
}

function initialState(rows, cols) {
  const xs = {}
  for(let j = 0; j < rows; j++) {
    for(let i = 0; i < cols; i++) {
      xs[[i,j]] = {
        row: j,
        col: i,
      }
    }
  }
  return xs
}

export const keys = _keys

function pos(x) {
  return [x.row, x.col]
}

export function initBoard(state) {
  return {
    type: 'BOARD_INIT',
    rows: state.rows,
    cols: state.cols
    //squares: initialState(state.rows, state.cols)
  }
}

export function updateBoard(squares) {
  return {
    type: 'BOARD_UPDATE',
    squares
  }
}

function squareClick_(pos, right, e) {
  e.preventDefault()
  return (dispatch, getState) => {
    const { socket } = getState()
    socket.send(JSON.stringify({type: 'click', pos, right}))
  }
}

export function squareClick(pos, e) {
  return squareClick_(pos, false, e);
}

export function squareRightClick(pos, e) {
  return squareClick_(pos, true, e);
}

function squares(state = {}, action) {
  switch(action.type) {

  case 'BOARD_UPDATE':
    return action.squares.reduce((a, c) => ({
      ...a, [pos(c)]: c
    }), state)

  default:
    return state
  }

}

function rows(state = 0, action) {
  switch(action.type) {
  case 'BOARD_INIT':
    return action.rows
  default:
    return state
  }

}

function cols(state = 0, action) {
  switch(action.type) {
  case 'BOARD_INIT':
    return action.cols
  default:
    return state
  }
}

export default combineReducers({
  rows,
  cols,
  squares
})
