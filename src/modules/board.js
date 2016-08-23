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

export const keys = _keys

function pos(x) {
  return [x.row, x.col]
}

export function updateBoard(squares) {
  return {
    type: 'BOARD_UPDATE',
    squares
  }
}

export function squareClicked(pos, e) {
  e.preventDefault()
  const right = e.button > 0
  return (dispatch, getState) => {
    const { socket } = getState()
    socket.send(JSON.stringify({type: 'click', pos, right}))
  }
}

function squares(state = initial, action) {
  switch(action.type) {
  case 'BOARD_UPDATE':
    return action.squares.reduce((a, c) => ({
      ...a, [pos(c)]: c
    }), state)

  default:
    return state
  }

}

export default combineReducers({
  squares
})