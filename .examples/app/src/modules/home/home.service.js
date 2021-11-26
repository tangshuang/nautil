import { DataService } from 'nautil'

export class HomeService extends DataService {
  articles = this.source(() => new Promise((r) => setTimeout(() => r([{ id: 1, title: 'Article 1' }]), 1000)), [])
}
