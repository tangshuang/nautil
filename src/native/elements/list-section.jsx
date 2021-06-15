import { mixin } from 'ts-fns'
import ListSection from '../../lib/elements/list-section.jsx'
import Section from '../../lib/elements/section.jsx'
import { FlatList } from 'react-native'

mixin(ListSection, class {
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
})

export { ListSection }
export default ListSection
