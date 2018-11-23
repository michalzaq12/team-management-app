import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import TeamList from '@/pages/TeamsList'
import TeamSearch from '@/pages/TeamSearch'
import AccountActivation from '@/pages/AccountActivation'
import SignUp from '@/pages/SignUp';
import Calendar from '@/pages/Calendar';
import TeamPage from '@/pages/team/Index';
import UserProfile from '@/pages/Profile';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      meta: { omitAuth: true, withoutLayout: true}
    },
    {
      name: 'sign-up',
      path: '/sign-up',
      component: SignUp,
      meta: { omitAuth: true, withoutLayout: true}
    },
    {
      name: 'account-activation',
      path: '/account/activation/:token',
      component: AccountActivation,
      meta: { omitAuth: true, withoutLayout: true}
    },
    {
      path: '/teams',
      name: 'team-list',
      component: TeamList
    },
    {
      path: '/teams/:teamId',
      name: 'team-page',
      component: TeamPage
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    },
    {
      path: '/team-search',
      name: 'team-search',
      component: TeamSearch
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile
    }
  ]
});
