import { Depository, createContext } from 'nautil'

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
  ],
})

export default depo

export const depoContext = createContext(depo)
