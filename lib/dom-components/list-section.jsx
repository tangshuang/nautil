// https://github.com/jwarning/react-scrollable-list/blob/master/index.js

import Component from '../core/component.js'
import ReactList from 'react-list'

export class ListSection extends Component {
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
}
export default ListSection
