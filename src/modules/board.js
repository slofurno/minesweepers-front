import { combineReducers } from 'redux'

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

function pos(x) {
  return [x.row, x.col]
}

export function initBoard(state) {
  return {
    type: 'BOARD_INIT',
    rows: state.rows,
    cols: state.cols
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
  case 'BOARD_INIT':
    return {}

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
