import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Board from 'containers/board'
import Minimap from 'components/minimap'

import { connectGame, boardPanned, boardMoved } from 'modules'
import { getHighScores } from 'modules/scores'

function connectSocket(props) {
  const { gameId, connectGame } = props
  connectGame(gameId)
}

class Game extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    connectSocket(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.game !== this.props.game) {
      connectSocket(nextProps)
    }
  }

  render() {
    const { boardPanned, boardMoved, panned, board, screen, highscores } = this.props
    const { squares } = board
    const { panX, panY } = panned
    const width = 240
    const height = 240
    const hwidth = width / 2

    const offsetX = (panX / 24) | 0
    const offsetY = (panY / 24) | 0
    return (
      <div className="game-root">
        <div className="overlay">
          <div className="opaque">
            <Minimap
              offsetX={offsetX-hwidth}
              offsetY={offsetY-hwidth}
              width={width}
              height={height}
              screen={screen}
              xs={squares}
              onClick={ e => boardMoved(24 * (e.nativeEvent.offsetX - width/2 |0),
                  24 * (e.nativeEvent.offsetY - height/2 |0)) }
              onPan={e => false && boardMoved(e.dx*24, e.dy*24)}
            />
          </div>

        <ul>
          { highscores.map(({id, player, score}) =>
              <li key={id}> { player + " : " + score } </li> ) }
        </ul>

        </div>
        <Board onPan={e => boardMoved(e.dx, e.dy)}/>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { gameId } = ownProps.params
  return {
    ...state,
    gameId,
    highscores: getHighScores(state)
  }
}

export default connect(mapStateToProps, {connectGame, boardPanned, boardMoved})(Game)
