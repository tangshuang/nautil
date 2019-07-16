import { Depository } from 'nautil'

export const depo = new Depository({
  expire: 2000,
  sources: [
    {
      id: 'info',
      url: '/api/info',
    },
    {
      id: 'person',
      url: '/api/persons',
      params: {
        id: '',
      },
    },
    {
      id: 'update_person',
      url: '/api/persons',
      method: 'post',
    }
  ],
})

export default depo
