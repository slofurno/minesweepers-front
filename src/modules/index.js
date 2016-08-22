import { combineReducers } from 'redux'

import board from './board'

function socket(state = null, action) {
  switch(action.type) {
  case 'SOCKET_CONNECTED':
    return action.socket
  default:
    return state
  }
}

export default combineReducers({
  board,
  socket
})
