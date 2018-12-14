import Box from '../../components/box'

export default (model, ctrl) => (
  <div id={ model.id }>
    <p>{ model.text }</p>
    <p><link to={ "route.child?id=" + model.id } onclick={ ctrl.click }>click me to refresh content</link></p>
    <p><input onkeyup={ e => ctrl.input(e) } value={ model.some } /></p>
    <ul>
      { model.cats.map(item => <li>{ item.name }'s color is { item.color }</li>) }
    </ul>
    { model.isShow ? <p>this will show.</p> : <p>this will not show.</p> }
    <p><a href="javascript:" onclick={ () => ctrl.toggle(isShow) }>toggle</a></p>
    <Box id={ model.id } onselect={ () => ctrl.toggleItem(model.item) }></Box>

    <view name="view1"></view>
  </div>
)
