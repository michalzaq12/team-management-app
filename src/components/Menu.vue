<template>
  <v-navigation-drawer dark :width="200" v-model="drawer" fixed app :clipped="$vuetify.breakpoint.lgAndUp">

    <v-list>
      <router-link tag="v-list-tile" :to="{name: item.component}" v-for="item in items" :key="item.title" @click="console.log('hello')">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title | translate}}</v-list-tile-title>
        </v-list-tile-content>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
  export default {
    props: ['value'],
    data() {
      return {
        drawer: this.value,
        items: [
          {
            title: 'menu.home',
            icon: 'home',
            component: 'home'
          },
          {
            title: 'menu.calendar',
            icon: 'date_range',
            component: 'calendar'
          },
          {
            title: 'menu.teams',
            icon: 'people',
            component: 'team-list'
          },
          {
            title: 'menu.searchTeam',
            icon: 'search',
            component: 'team-search'
          },
          {
            title: 'menu.profile',
            icon: 'person',
            component: 'profile'
          }
        ]
      }
    },
    watch: {
      drawer(newValue) {
        this.$emit('input', newValue)
      },
      value(newValue) {
        this.drawer = newValue;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .router-link-exact-active {
    background: $brand-secondary;
  }
</style>
