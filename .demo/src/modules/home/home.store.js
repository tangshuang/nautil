export const state = {
  articles: [],
}

export function setArticles(dispatch, articles) {
  dispatch('articles', articles)
}
