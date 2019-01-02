import { View, Link } from 'nautil'
import Box from '../../components/box'
import SomeView from './some-view'

export default ({ model, controller }) => (
  <div id={ model.id }>
    <p>{ model.text }</p>
    <p><Link to={ "route.child?id=" + model.id } onClick={ controller.click }>click me to refresh content</Link></p>
    <p><input onkeyup={ e => controller.input(e) } value={ model.some } /></p>
    <ul>
      { model.cats.map(item => <li>{ item.name }'s color is { item.color }</li>) }
    </ul>
    { model.isShow ? <p>this will show.</p> : <p>this will not show.</p> }
    <p><a href="javascript:" onClick={ () => controller.toggle(isShow) }>toggle</a></p>
    <Box id={ model.id } onToggle={ (e) => controller.click(e) }></Box>

    <View component={SomeView} match={uri => uri.indexOf('show-some') > -1} props={{}}></View>
  </div>
)
