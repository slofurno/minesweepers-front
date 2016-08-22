import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { keys, squareClicked } from 'modules/board'

const BOMB = '💣'

const Square = ({neighbors, onClick, type, revealed}) => {
  let content = false
  if (revealed && type == 'bomb') {
    content = BOMB
  } else if (revealed) {
    content = '' + neighbors
  }
  return (
    <div className='square' onClick={onClick}>{content}</div>
  )
}

class App extends Component {
  render() {
    const { board, squareClicked } = this.props
    return (
      <div className="container">
        { keys.map((pos,i) => {
            const props = board.squares[pos]
            return (
              <Square key={i} {...props} onClick={() => squareClicked(pos)} />
            )
          })
        }
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

export default connect(mapStateToProps, {squareClicked})(App)
