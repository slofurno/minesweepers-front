import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { keys, squareClicked } from 'modules/board'
import makePannable from 'pannable'

const BOMB = '💣'
const FLAG = '⚐'
const preventDefault = e => e.preventDefault()

const Square = ({neighbors, onClick, type, revealed, flagged}) => {
  let content = false
  let className = 'square'

  if (flagged) {
    content = FLAG
  } else if (revealed) {
    className += ' revealed'

    if (type == 'bomb') {
      content = BOMB
    } else if (neighbors > 0) {
      content = '' + neighbors
    }
  }

  return (
    <div className={className} onClick={onClick} onContextMenu={preventDefault}>{content}</div>
  )
}

class App extends Component {

  render() {
    const { board, squareClicked } = this.props

    return (
      <div className="container">
        { false &&
          keys.map((pos,i) => {
            const props = board.squares[pos]
            return (
              <Square key={i} {...props} onClick={e => squareClicked(pos, e)} />
            )
          })
        }
      <PannableSquare/>
      </div>
    )
  }
}

class DebugSquare extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: ''
    }
  }

  render() {
    const { msg } = this.state
    const {panX, panY} = this.props
    const set = msg => [this.setState({msg})]

    return (
      <div style={{width: 400, height: 400, background: 'gainsboro', position: 'relative'}}
        onClick={ e => set('onclick')}
        onMouseDown={ e => set('mousedown')}
        onMouseUp={ e => set('mouseup')}
        onMouseMove={ e => set('mousemove: ' + e.clientX + ',' + e.clientY)}
        onTouchMove={ e => [e.preventDefault(), set('touchmove: ' + e.touches[0].pageX + ', ' +  e.touches[0].pageY)]}
      >
        <div style={{position: 'absolute', left: 200-panX, top: 200-panY, width: 10, height: 10, background: 'blue' }}>
        {"height: " + window.innerHeight + "  " + window.innerWidth}
        </div>
      </div>
    )
  }

}

const PannableSquare = makePannable(DebugSquare)

function mapStateToProps(state, ownProps) {
  return state
}

export default connect(mapStateToProps, {squareClicked})(App)
