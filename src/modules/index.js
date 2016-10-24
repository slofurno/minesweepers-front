import { combineReducers } from 'redux'

import board, { updateBoard, gameStarted } from './board'
import user from './user'
import players, { setPlayerNames, setPlayerName }  from './players'
import scores from './scores'

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

//FIXME
let queue = []

function _doUpdateSquares(dispatch) {
  let squares = queue.reduce((a,c) => a.concat(c), [])
  queue = []
  dispatch(updateBoard(squares))
}

const doUpdateSquares = debounce(_doUpdateSquares, 1000, { maxWait: 2000})

function updateSquares(squares, dispatch) {
  queue.push(squares)
  doUpdateSquares(dispatch)
}

function websocketMessage(action) {
  return (dispatch, getState) => {
    switch(action.type) {
    case "init":
      dispatch(gameStarted(action.state))
      return

    case "reveal": {
      const { user } = getState()
      return (action.player === user.id)
        ? dispatch(updateBoard([action]))
        : updateSquares(action, dispatch)
    }

    case "player":
      dispatch(setPlayerName(action))
    }

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

export function toggleMinimap() {
  return {
    type: 'MINIMAP_TOGGLED'
  }
}

function minimap(state = false, action) {
  switch(action.type) {
  case 'MINIMAP_TOGGLED':
    return !state
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
  screen,
  players,
  scores,
  minimap
})
