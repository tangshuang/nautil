import DropdownMenu from '../dropdown-menu'

export default (context) => (
  <div style={ context.style.box }>
    <div style={ context.style.boxInner }>
      <div style={ context.style.boxTitle }>
        <span style={ context.style.boxTitleText }>{ context.model.title }</span>
        <DropdownMenu style={ context.style.boxTitleOption } options={ context.model.options } on-select={ context.action.select }><i className="icon icon-arrow-down"></i></DropdownMenu>
        <span style={ context.style.boxTitleOption } on-click={ context.action.toggle }><i className="icon icon-toggle"></i></span>
      </div>
      <div style={ context.style.boxContent }>
        { context.children }
      </div>
    </div>
  </div>
)
