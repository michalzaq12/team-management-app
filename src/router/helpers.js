import store from "../store";

export default {
  beforeEach(to, from, next) {
    if (to.matched.some(record => record.meta.omitAuth)) return next();
    const isLoggedIn = store.getters['auth/isAuthenticated'];

    if (!isLoggedIn) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
}
