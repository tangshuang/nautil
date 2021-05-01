import React from 'react'
import { mixin } from 'ts-fns'
import ListSection from '../../lib/elements/list-section.jsx'
import { Component } from '../../lib/component.js'
import { ifexist } from 'tyshemo'

// fork from https://github.com/jwarning/react-scrollable-list
// https://github.com/jwarning/react-scrollable-list/blob/master/index.js
class ReactList extends Component {
  static props = {
    listItems: Array,
    heightOfItem: ifexist(Number),
    maxItemsToRender: ifexist(Number),
    style: ifexist(Object),
  }
  static defaultProps = {
    listItems: [],
    heightOfItem: 30,
    maxItemsToRender: 50
  }
  constructor(props) {
    super(props)
    this.state = { scrollPosition: 0 }
    this.list = null

    this.setListRef = element => {
      this.list = element
    }

    this.updateScrollPosition = this.updateScrollPosition.bind(this)
  }
  componentDidMount() {
    this.list.addEventListener('scroll', this.updateScrollPosition)
  }
  componentWillUnmount() {
    this.list.removeEventListener('scroll', this.updateScrollPosition)
  }
  updateScrollPosition() {
    const newScrollPosition = this.list.scrollTop / this.props.heightOfItem
    const difference = Math.abs(this.state.scrollPosition - newScrollPosition)

    if (difference >= this.props.maxItemsToRender / 5) {
      this.setState({ scrollPosition: newScrollPosition })
    }
  }
  render() {
    const startPosition = this.state.scrollPosition - this.props.maxItemsToRender > 0
      ? this.state.scrollPosition - this.props.maxItemsToRender
      : 0

    const endPosition = this.state.scrollPosition + this.props.maxItemsToRender >= this.props.listItems.length
      ? this.props.listItems.length
      : this.state.scrollPosition + this.props.maxItemsToRender

    return (
      <div className="react-scrollable-list" ref={this.setListRef} style={this.props.style}>
        <div
          key="list-spacer-top"
          style={{
            height: startPosition * this.props.heightOfItem,
          }}
        />
        {this.props.listItems.slice(startPosition, endPosition).map(item => (
          <div className="react-scrollable-list-item" key={'list-item-' + item.id}>
            {item.content}
          </div>
        ))}
        <div
          key="list-spacer-bottom"
          style={{
            height: this.props.listItems.length * this.props.heightOfItem - endPosition * this.props.heightOfItem,
          }}
        />
      </div>
    )
  }
}

mixin(ListSection, class {
  render() {
    const { itemRender, data, itemKey, itemStyle = {} } = this.attrs
    const renderItem = (index) => {
      const item = data[index]
      const key = item[itemKey]
      return (
        <div key={key} style={itemStyle}>{itemRender(item, index)}</div>
      )
    }
    return (
      <div style={this.style} className={this.className}>
        <ReactList
          itemRenderer={renderItem}
          length={data.length}
          type="variable"
          useTranslate3d={true}
        />
      </div>
    )
  }
})

export { ListSection }
export default ListSection
