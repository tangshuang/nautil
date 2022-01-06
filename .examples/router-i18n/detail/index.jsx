import { Component } from 'nautil'
import { T } from './i18n'
import { Outlet, Link } from './router'

export default class Detail extends Component {
  state = {
    content: '',
  }
  shouldAffect(props) {
    return [props.id]
  }
  async onAffect() {
    const { id } = this.props
    const content = await fetch(`/api/article/${id}`).then(res => res.json())
    this.setState({
      content,
    })
  }
  render() {
    return (
      <div>
        <h2>Detail</h2>
        <div>{this.state.content}</div>
        <div className='tabs'>
          <Link to="basic"><T>Basic</T></Link>
          <Link to="extra"><T>Extra</T></Link>
        </div>
        <Outlet />
      </div>
    )
  }
}

function Basic() {
  return 'basic'
}

function Extra() {
  return 'extra'
}

function NotFound() {
  return 'not found'
}
