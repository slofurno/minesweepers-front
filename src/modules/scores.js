import { combineReducers } from 'redux'
import { createSelector } from 'reselect'

export default function scores(state = {}, action) {
  switch(action.type) {
  case 'GAME_INIT':
    return action.scores

  case 'BOARD_UPDATE': {
    const scores = Object.assign({}, state)
    action.updates.forEach(update =>
      scores[update.player] = update.score
    )
    return scores
  }
  default:
    return state
  }

}

const getScores = state => state.scores
const getPlayers  = state => state.players

export const getHighScores = createSelector(
  getScores,
  getPlayers,
  (scores, players) => Object.keys(players)
      .sort((a,b) => (scores[b]||0) - (scores[a]||0))
      .slice(0, 10)
      .map(id => ({ id, player: players[id], score: scores[id] || 0 })))
