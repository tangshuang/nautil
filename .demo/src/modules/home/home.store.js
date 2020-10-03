export const state = {
  name: 'dog',
  type: 'animal',
}

export function setName(dispatch, name) {
  dispatch('name', name)
}

export function setType(dispatch, type) {
  dispatch('type', type)
}
