import { Controller } from 'nautil'
import { HomeService } from './home.service.js'

export class HomeController extends Controller {
  static service = HomeService

  get articles() {
    return this.service.get(this.service.articles)
  }
}
