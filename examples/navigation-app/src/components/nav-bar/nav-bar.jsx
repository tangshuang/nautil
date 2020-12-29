import React from 'react'
import { Component, Section, Each, Link } from 'nautil'
import Styles from './nav-bar.css'

const navItems = [
  {
    name: 'recommend',
    text: '推荐',
  },
  {
    name: 'frontend',
    text: '前端',
  },
  {
    name: 'backend',
    text: '后端',
  },
]

export class NavBar extends Component {
  render() {
    return (
      <Section stylesheet={['nav-bar', Styles.navBar]}>
        <Each of={navItems} render={(item) =>
          <Section stylesheet={['nav-bar__item', Styles.navBarItem]}>
            <Link to={item.name} stylesheet={['nav-bar__item-link', Styles.navBarItemLink]}>{item.text}</Link>
          </Section>
        } />
      </Section>
    )
  }
}
export default NavBar
