import { Model } from 'nautil'
import { required, accord } from 'nautil/validators'

export default class BoxModel extends Model {
  form = {
    title: {
      value: '',
      type: String,
      validate: required,
    },
    description: {
      value: '',
      type: String,
    },
    creator: {
      value: {
        uid: '',
        username: '',
      },
      type: Object,
      validate: accord(required, 'uid'),
    }
  }
}
