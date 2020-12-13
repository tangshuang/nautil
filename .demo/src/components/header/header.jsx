import React, { useState } from 'react'
import {
  Component,
  Section,
  Image,
  Text,
  Link,
  Each,
  Input,
  Button,
  Controller,
  If,
  AppWormhole,
} from 'nautil'
import * as Styles from './header.css'
import Icon from '../icon/icon.jsx'

const menus = [
  {
    name: 'home',
    text: '首页',
  },
  {
    name: 'hot',
    text: '沸点',
  },
  {
    name: 'book',
    text: '小册',
  },
  {
    name: 'activity',
    text: '活动',
  },
]

class HeaderController extends Controller {
  SearchInput(props) {
    const $keyword = useState('')
    return <Input {...props} $value={$keyword} />
  }
}

export class Header extends Component {
  controller = new HeaderController()
  state = {
    isShowMenuList: false,
  }

  render() {
    const { SearchInput } = this.controller
    return (
      <AppWormhole
        transport={(body) => {
          let menu = menus[0]
          if (body) {
            const { navigation } = body
            const { name } = navigation.state
            menu = menus.find(item => item.name === name)
          }
          return menu
        }}
        render={(menu) => {
          return (
            <Section stylesheet={['header', Styles.header]}>
              <Section stylesheet={['header__logo', Styles.headerLogo]}>
                <Image stylesheet={['header__logo-img', Styles.headerLogoImg]} source={{ uri: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQ1cHgiIGhlaWdodD0iMzhweCIgdmlld0JveD0iMCAwIDQ1IDM4IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkp1ZWppbjwvdGl0bGU+CiAgICA8ZGVzYz5KdWVqaW4uaW08L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iMC4xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iR3JvdXAtMTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMDAwMDAwLCA1LjAwMDAwMCkiIGZpbGw9IiMwMDZDRkYiPgogICAgICAgICAgICA8cGF0aCBkPSJNMjEuMjkzNDMyOCwyLjU4MzEzMDQ5IEwxOC4wMTczOTg0LDAgTDE0LjU5NDYyNCwyLjY5ODg3ODAxIEwxNC40MTcyMDc3LDIuODQxODIzMDQgTDE4LjAxNzM5ODQsNS43MTI0MjQ4MyBMMjEuNjI4NjU3OCwyLjg0MTgyMzA0IEwyMS4yOTM0MzI4LDIuNTgzMTMwNDkgWiBNMzMuNzA3ODI4OSwxMi42MDA2Njc0IEwxOC4wMDc5MTA5LDI0Ljk4MDI3NiBMMi4zMTc0ODA0NCwxMi42MDgyNTc0IEwwLDE0LjQ2OTcwNTIgTDE4LjAwNzkxMDksMjguNjY5MDE2NyBMMzYuMDI1NjI1NiwxNC40NjIxMTUyIEwzMy43MDc4Mjg5LDEyLjYwMDY2NzQgWiBNMTguMDA3OTEwOSwxMy42MDUwNzc2IEw5LjQ2NDQxNTU0LDYuODY4NjM1MDUgTDcuMTQ2NjE4ODUsOC43MzAwODI5IEwxOC4wMDc5MTA5LDE3LjI5NDEzNDUgTDI4Ljg3ODM3NDIsOC43MjI0OTI5IEwyNi41NjA1Nzc1LDYuODYxMDQ1MDUgTDE4LjAwNzkxMDksMTMuNjA1MDc3NiBaIiBpZD0iRmlsbC0xLUNvcHkiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==' }} />
              </Section>
              <Section stylesheet={['header__menus', Styles.headerMenus]} onHitOutside={() => this.setState({ isShowMenuList: false })}>
                <Section stylesheet={['header__menus-holder', Styles.headerMenusHolder]} onHit={() => this.setState({ isShowMenuList: true })}>
                  <Text>{menu.text}</Text>
                  <Icon type="arrow-down-b" />
                </Section>
                <If is={!!this.state.isShowMenuList}>{() =>
                  <Section stylesheet={['header__menus-list', Styles.headerMenusList]}>
                    <Each of={menus} render={(item) =>
                      <Section><Link to={item.name} stylesheet={['header__menus-item', Styles.headerMenusItem, menu.name === item.name ? Styles.headerMenusItemActive : null]}>{item.text}</Link></Section>
                    } />
                  </Section>
                }</If>
              </Section>
              <Section stylesheet={['header__search', Styles.headerSearch]}>
                <SearchInput placeholder="探索掘金" stylesheet={['header__search-input', Styles.headerSearchInput]} />
              </Section>
              <Section stylesheet={['header__login']}>
                <Button stylesheet={['header__login-button', Styles.headerLoginButton]}>登陆</Button>
              </Section>
            </Section>
          )
        }}
      />
    )
  }
}
export default Header
