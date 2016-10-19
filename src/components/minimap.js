import React, { Component, PropTypes } from 'react'
import makePannable from 'pannable'

const filled_color = pack(100,149,237,255)
const empty_color = pack(222,222,222,255)
const SIZE = 24

function pack(r,g,b,a) {
  return (a << 24) | (b << 16) | (g << 8) | r
}

function isFilled({ state } = { state: "unrevealed" }) {
  switch(state) {
  case "flagged":
  case "bomb":
  case "empty":
    return true
  default:
    return false
  }
}

const Minimap = React.createClass({

  componentDidMount() {
    const { width, height } = this.props

    this.buffer = new ArrayBuffer(width * height * 4)
    this.writeView = new Uint32Array(this.buffer)
    this.readView = new Uint8ClampedArray(this.buffer)
    this.imageData = new ImageData(this.readView, width, height)

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext('2d')
    this.ctx.strokeStyle = 'white'

    this.refs.root.appendChild(this.canvas)
    this.renderMap(this.props)
  },

  componentWillReceiveProps(nextProps) {
    this.renderMap(nextProps)
  },

  renderMap(props) {
    const { width, height, offsetX, offsetY, xs, screen } = props

    const inner_width = (screen.width/SIZE) | 0
    const inner_height = (screen.height/SIZE) | 0

    const inner_hwidth = inner_width / 2 | 0
    const inner_hheight = inner_height / 2 | 0

    const dx = offsetX + inner_hwidth
    const dy = offsetY + inner_hheight

    for(let j = 0; j < height; j++) {
      for(let i = 0; i < width; i++) {
        if(isFilled(xs[[i+dx, j+dy]])) {
          this.writeView[j * width + i] = filled_color
        } else {
          this.writeView[j * width + i] = empty_color
        }
      }
    }

    this.ctx.putImageData(this.imageData, 0, 0)

    const hwidth = width/2 | 0
    const hheight = height/2 | 0
    this.ctx.strokeRect( hwidth - inner_width/2, hheight - inner_height/2,
      inner_width, inner_height)

  },

  shouldComponentUpdate() {
    return false
  },

  render() {
    const { onClick } = this.props

    return (
      <div ref="root" onClick={onClick} />
    )
  }

})

export default makePannable(Minimap)
