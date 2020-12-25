import GoodModel from './good.model'
import OrderModel from './order.model'
import CamaStore from './cama.store'

class DetailPage extends Controller {
  static good = GoodModel
  static order = OrderModel

  static cama = CamaStore

  static change$(stream) {
    return stream.pipe(
      switchMap(() => this.update$), // 切换到另外一个流
    )
  }
  static update$(stream) {}

  onChange(e) {
    this.good.price = e.target.value
  }

  StartButton(props) {
    return [
      Input,
      {
        onClick: this.change$,
      },
      props.children,
    ]
  }

  UpdateButton(props) {
    return [
      Input,
      {
        onClick: this.update$,
      },
      props.children,
    ]
  }

  PriceInput() {
    return [
      Input,
      {
        type: 'number',
        onChange: this.onChange,
        value: this.good.price,
      },
    ]
  }
}