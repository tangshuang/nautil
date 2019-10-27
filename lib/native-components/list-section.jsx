import Component from '../core/component.js'
import { FlatList } from 'react-native'
import { Section } from '../components/index.js'
import { list } from '../core/types.js'

export class ListSection extends Component {
  static props = {
    data: list([Object]),
    itemRender: Function,
    itemKey: String,
    itemStyle: Object,
  }

  static defaultProps = {
    itemStyle: {},
  }
  render() {
    const { itemRender, data, itemKey, itemStyle = {} } = this.attrs
    return (
      <Section style={this.style}>
        <FlatList
          data={data}
          renderItem={(item, index) => <Section style={itemStyle}>{itemRender(item, index)}</Section>}
          keyExtractor={item => item[itemKey]}
        />
      </Section>
    )
  }
}
export default ListSection
