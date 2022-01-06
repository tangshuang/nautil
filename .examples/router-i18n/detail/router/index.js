import { Router } from 'nautil'

export const { Outlet, Link, useMatch, useLocation, useParams, useNavigate, useListen } = new Router({
  routes: [
    {
      path: 'basic',
      component: Basic,
    },
    {
      path: 'extra',
      component: Extra,
    },
    {
      path: '',
      redirect: '/basic',
    },
    {
      path: '!',
      component: NotFound,
    },
  ],
  // resolve({ href, pathname, search, params, query }) {
  //   return pathname
  // },
})

function Basic() {
  return 'basic'
}

function Extra() {
  return 'extra'
}

function NotFound() {
  return 'not found'
}
