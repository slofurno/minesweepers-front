import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Board from 'containers/board'
import Minimap from 'components/minimap'

import { connectGame, boardPanned } from 'modules'

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
    const { boardPanned, panned, board } = this.props
    const { squares } = board
    const { panX, panY } = panned

    const offsetX = (panX / 24) | 0
    const offsetY = (panY / 24) | 0
    return (
      <div className="game-root">
        <div className="overlay">
          <div className="opaque">
            <Minimap
              offsetX={offsetX-100}
              offsetY={offsetY-100}
              width={200}
              height={200}
              xs={squares}/>
          </div>

        </div>
        <Board onPan={boardPanned}/>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { gameId } = ownProps.params
  return {
    ...state,
     gameId
  }
}

export default connect(mapStateToProps, {connectGame, boardPanned})(Game)
