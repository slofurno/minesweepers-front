import React, { Component, PropTypes } from 'react'

const filled_color = pack(200,0,0, 255)
const empty_color = pack(55,55,55, 255)

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

    this.refs.root.appendChild(this.canvas)
  },

  componentWillReceiveProps(nextProps) {
    const { width, height, offsetX, offsetY, xs } = this.props

    for(let j = 0; j < height; j++) {
      for(let i = 0; i < width; i++) {
        if(isFilled(xs[[i+offsetX, j+offsetY]])) {
          this.writeView[j * width + i] = filled_color
        } else {
          this.writeView[j * width + i] = empty_color
        }
      }
    }

    this.ctx.putImageData(this.imageData, 0, 0)
  },

  shouldComponentUpdate() {
    return false
  },

  render() {
    return (
      <div ref="root"/>
    )
  }

})

export default Minimap
