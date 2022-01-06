import { Component, Router, createAsyncComponent, createBootstrap, LanguageDetector, I18n } from 'nautil'

const Home = createAsyncComponent(() => import('./home'))
const List = createAsyncComponent(() => import('./list'))
const Detail = createAsyncComponent(() => import('./detail'))

const { Outlet, Link } = new Router({
  routes: [
    {
      path: '',
      redirect: 'home',
    },
    {
      path: 'home',
      component: Home,
    },
    {
      path: 'list',
      component: List,
    },
    {
      path: 'detail/:id',
      component: Detail,
    },
  ],
})

const { T } = new I18n({
  resources: {
    zh: async () => {},
    en: async () => {},
  },
})

class App extends Component {
  render() {
    const id = '1' // mock

    return (
      <div className="tabs">
        <div>
          <Link to="home"><T>Home</T></Link>
          <Link to="list"><T>List</T></Link>
          <Link to={`detail/${id}`}><T>Detail</T></Link>
        </div>
        <Outlet />
      </div>
    )
  }
}

const bootstrap = createBootstrap({
  router: {
    mode: '/',
  },
  i18n: {
    lang: LanguageDetector,
  },
})

export default bootstrap(App)
