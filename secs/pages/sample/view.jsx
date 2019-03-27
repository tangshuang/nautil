import { View, Link } from 'nautil'
import Box from '../../components/box'
import SomeView from './some-view'

export default ({ model, action, style }) => (
  <div id={model.id}>
    <p style={style.paf}>{model.text}</p>
    <p><Link to={"route.child?id=" + model.id} onClick={action.click}>click me to refresh content</Link></p>
    <p><input onKeyup={action.keyup} value={model.some} /></p>
    <ul>
      { model.cats.map(item => <li>{item.name}'s color is {item.color}</li>) }
    </ul>
    { model.isShow ? <p>this will show.</p> : <p>this will not show.</p> }
    <p><a href="javascript:" onClick={() => action.toggle(model.isShow)}>toggle</a></p>
    <Box id={model.id} onToggle={e => action.click(e)}></Box>

    <View show={model.isShow} animation="slideLeftRight">
      <div onClick="ok">xxx</div>
    </View>

    <View match={route => route.uri.indexOf('show-some') > -1} animation="fadeIn">
      <SomeView prop={true} />
    </View>
  </div>
)
