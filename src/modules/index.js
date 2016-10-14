import { combineReducers } from 'redux'

import board, { updateBoard, initBoard } from 'modules/board'

fetchGames();
//  .then(xs => connect(xs[0]))
//  .catch(err => console.error(err))


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
    const { socket } = getState()

    if (socket !== null) {
      socket.close()
    }

    let next_socket = new WebSocket(`ws:///${location.host}/ws?gameid=${game}&token=123`)
    next_socket.onopen = () => dispatch({type: 'SOCKET_CONNECTED', socket: next_socket})
    next_socket.onmessage = e => dispatch(websocketMessage(JSON.parse(e.data)))
  }
}

function websocketMessage(action) {
  return dispatch => {
    switch(action.type) {
    case "init":
      dispatch(initBoard(action.state))
      dispatch(updateBoard(action.state.squares))
      return

    case "update":
      return innerUpdate(dispatch, action.update)
    }

  }
}

function innerUpdate(dispatch, update) {
  switch(update.type) {
  case "reveal":
    return dispatch(updateBoard(update.squares))
  }
}

export function fetchGames() {
  return (dispatch) => {
    fetch(`http://${location.host}/api/games`)
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

export default combineReducers({
	games,
  board,
  socket
})
