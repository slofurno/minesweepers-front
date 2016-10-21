import { combineReducers } from 'redux'

import board, { updateBoard, initBoard } from './board'
import user from './user'

const { debounce } = require('lodash')

function socket(state = null, action) {
  switch(action.type) {
  case 'SOCKET_CONNECTED':
    return action.socket
  default:
    return state
  }
}

export function connectGame(game) {
  return (dispatch, getState) => {
    const { socket, user } = getState()

    if (socket !== null) {
      socket.close()
    }

    const { token } = user
    let next_socket = new WebSocket(`ws:///${location.host}/ws?gameid=${game}&token=${token}`)
    next_socket.onopen = () => dispatch({type: 'SOCKET_CONNECTED', socket: next_socket})
    next_socket.onmessage = e => dispatch(websocketMessage(JSON.parse(e.data)))
  }
}

function websocketMessage(action) {
  return (dispatch, getState) => {
    switch(action.type) {
    case "init":
      dispatch(initBoard(action.state))
      dispatch(updateBoard(action.state.squares))
      return

    case "update":
      return innerUpdate(dispatch, getState, action.update)
    }

  }
}

//FIXME
let queue = []

function _doUpdateSquares(dispatch) {
  let squares = queue.reduce((a,c) => a.concat(c))
  queue = []
  dispatch(updateBoard(squares))
}

const doUpdateSquares = debounce(_doUpdateSquares, 250, { maxWait: 500})

function updateSquares(squares, dispatch) {
  queue.push(squares)
  doUpdateSquares(dispatch)
}


function innerUpdate(dispatch, getState, update) {
  switch(update.type) {
  case "reveal":
    const { user } = getState()
    return (update.player === user.id)
      ? dispatch(updateBoard(update.squares))
      : updateSquares(update.squares, dispatch)
  }
}

export function fetchGames() {
  return (dispatch) => {
    fetch('/api/games')
      .then(res => res.json())
      .then(xs => dispatch(fetchGamesSuccess(xs)))
  }
}

export function fetchGamesSuccess(games) {
	return {
		type: 'FETCH_GAMES_SUCCESS',
    games
	}
}

function games(state = [], action) {
	switch(action.type) {
	case 'FETCH_GAMES_SUCCESS':
		return action.games
	default:
		return state
	}
}

export function boardPanned(panned) {
  return {
    type: 'BOARD_PANNED',
    panned
  }
}

export function boardMoved(dx, dy) {
  return {
    type: 'BOARD_MOVED',
    dx,
    dy
  }
}

function panned(state = {panX: 0, panY: 0}, action) {
  switch(action.type) {
  case 'BOARD_PANNED':
    return action.panned
  case 'BOARD_MOVED':
    return {panX: state.panX + action.dx, panY: state.panY + action.dy}
  default:
    return state
  }
}

export function screenResized() {
  const screen = {height: window.innerHeight, width: window.innerWidth}
  return {
    type: 'SCREEN_RESIZED',
    screen
  }
}

function screen(state = {height: window.innerHeight, width: window.innerWidth}, action) {
  switch(action.type) {
  case 'SCREEN_RESIZED':
    return action.screen
  default:
    return state
  }
}

export default combineReducers({
	games,
  board,
  socket,
  panned,
  user,
  screen
})
