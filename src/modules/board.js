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

export function gameStarted({squares, rows, cols, players, scores}) {
  return {
    type: 'GAME_INIT',
    rows,
    cols,
    squares,
    players,
    scores
  }
}

export function updateBoard(updates) {
  return {
    type: 'BOARD_UPDATE',
    updates
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
  case 'GAME_INIT': {
    const squares = {}
    action.squares.forEach(x => squares[pos(x)] = x)
    return squares
  }

  case 'BOARD_UPDATE': {
    const next = Object.assign({}, state)
    action.updates.forEach(update =>
      update.squares.forEach(x => next[pos(x)] = x)
    )
    return next
  }

  default:
    return state
  }

}

function rows(state = 0, action) {
  switch(action.type) {
  case 'GAME_INIT':
    return action.rows
  default:
    return state
  }

}

function cols(state = 0, action) {
  switch(action.type) {
  case 'GAME_INIT':
    return action.cols
  default:
    return state
  }
}

function squareSize(state = window.innerWidth > 600 ? 24 : 36, action) {
  switch(action.type) {
  case 'SCREEN_RESIZED':
    return action.screen.width > 600 ? 24 : 36
  default:
    return state
  }
}

export default combineReducers({
  rows,
  cols,
  squares,
  squareSize
})
