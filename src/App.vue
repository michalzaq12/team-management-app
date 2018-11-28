<template>
  <v-app>
    <basic-layout  v-if="!this.$route.meta.withoutLayout">
      <router-view></router-view>
    </basic-layout>
    <router-view v-else></router-view>
      <v-snackbar v-model="snackbar" :color="color" :timeout="5000" :bottom="true" :right="true">
        {{ errorText }}
        <v-btn dark flat @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
  </v-app>
</template>

<script>
  import BasicLayout from '@/BasicLayout';
  import Vue from 'vue';
  import Loading from '@/components/Loading2';
  import Thumbnail from '@/components/Thumbnail';

  Vue.component('v-loading', Loading);
  Vue.component('v-thumbnail', Thumbnail);

  export default {
    name: 'app',
    components: {
      BasicLayout,
      Loading
    },
    data() {
      return {
        isLoading: false,
        errorText: null,
        snackbar: false,
        color: 'error'
      }
    },
    created() {

      this.$eventBus.$on('error', msg => {
        this.errorText = msg;
        this.color = 'error';
        this.snackbar = true;
      });

      this.$eventBus.$on('info', msg => {
        this.errorText = msg;
        this.color = 'info';
        this.snackbar = true;
      });

    }
  }
</script>



<style lang="scss">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s
  }

  .fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0;
  }
</style>



