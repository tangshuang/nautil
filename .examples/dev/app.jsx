import { Router, createBootstrap, Link } from 'nautil'

function Home() {
  return <Link to="detail">go to detail</Link>
}

function Detail() {
  return (
    <>
      <Link to="">go to home</Link>
      <Link to="./content">go to content</Link>
    </>
  )
}

function Content() {
  return 'content'
}

const { Outlet } = new Router({
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
      path: 'detail',
      component: Detail,
    },
  ],
})

const bootstrap = createBootstrap({
  router: {
    mode: '/',
  },
})

function App() {
  return <Outlet />
}

export default bootstrap(App)
