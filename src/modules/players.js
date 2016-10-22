import { combineReducers } from 'redux'

export function setPlayerName({player, name}) {
  return {
    type: 'PLAYER_NAME_SET',
    player,
    name
  }
}

export default function players(state = {}, action) {
  switch(action.type) {
  case 'GAME_INIT':
    return action.players

  case 'PLAYER_NAME_SET':
    return {...state, [action.player]: action.name}

  default:
    return state
  }
}
