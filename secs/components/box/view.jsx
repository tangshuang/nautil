import DropdownMenu from '../dropdown-menu'

export default (context) => (
  <div style={ context.stylesheet.box }>
    <div style={ context.stylesheet.boxInner }>
      <div style={ context.stylesheet.boxTitle }>
        <span style={ context.stylesheet.boxTitleText }>{ context.model.title }</span>
        <DropdownMenu style={ context.stylesheet.boxTitleOption } options={ context.model.options } onSelect={ context.controller.select }><i className="icon icon-arrow-down"></i></DropdownMenu>
        <span style={ context.stylesheet.boxTitleOption } onClick={ context.controller.toggle }><i className="icon icon-toggle"></i></span>
      </div>
      <div style={ context.stylesheet.boxContent }>
        { context.children }
      </div>
    </div>
  </div>
)
