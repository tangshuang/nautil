// https://github.com/jwarning/react-scrollable-list/blob/master/index.js
import React from 'react'
import { mixin } from 'ts-fns'
import ListSection from '../../lib/elements/list-section.jsx'
import ReactList from 'react-scrollable-list'

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
