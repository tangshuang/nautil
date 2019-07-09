import { Depository } from 'nautil'

const depo = new Depository({
  expire: 2000,
  sources: [
    {
      id: 'info',
      url: '/api',
    },
  ],
})

export default depo
