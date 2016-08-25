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
  const HEIGHT = 400
  const WIDTH = 400
    const { board, squareClicked } = this.props
    const { panX, panY } = this.props
    const cols = WIDTH / 40 | 0
    const rows = HEIGHT / 40 | 0
    const colOffset = panY / 40 | 0
    const rowOffset = panX / 40 | 0

    const xs = []
    for (let j = colOffset; j < colOffset + cols; j++) {
      for (let i = rowOffset; i < rowOffset + rows; i++) {
        xs.push([i,j])
      }
    }

    console.log(xs)

   const boardStyle = {
     width: WIDTH,
     height: HEIGHT
   }

    return (
      <div className="container" style={boardStyle}>
        {
          xs.map((pos,i) => {
            const square = board.squares[pos]
            return (
              <Square key={i} {...square} onClick={e => squareClicked(pos, e)} />
            )
          })
        }
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
      <div style={{width: 400, height: 400, background: 'gainsboro', position: 'relative'}} >
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

export default connect(mapStateToProps, {squareClicked})(makePannable(App))
