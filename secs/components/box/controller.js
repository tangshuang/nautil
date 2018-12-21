import { Controller } from 'nautil'

export default class BoxController extends Controller {

  /**
   * $handlers指接收外部传进来的指令
   */
  $handlers = {
    onToggle() {},
  }

  onSelectOption(stream) {
    return stream.map(item => ({ selected: item.id }))
  }
}
