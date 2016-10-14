import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Board from 'containers/board'
import { connectGame } from 'modules'

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
    return (
      <Board/>
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

export default connect(mapStateToProps, {connectGame})(Game)
