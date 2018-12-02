<template>
    <v-toolbar ref="header" :clipped-left="$vuetify.breakpoint.lgAndUp" color="demko" dark app fixed>

        <v-toolbar-title class="ml-0">
            <v-toolbar-side-icon @click.stop="toggle"></v-toolbar-side-icon>
            <span class="font-weight-bold title">DemCouch</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <lang-switcher/>



      <v-menu offset-y transition="slide-y-transition">
        <v-btn slot="activator" icon>
          <v-badge top color="red" overlap>
            <span slot="badge" v-if="notificationsCount > 0">{{notificationsCount}}</span>
            <v-icon>notifications</v-icon>
          </v-badge>
        </v-btn>

        <notifications @notifications-count="notificationsCount = $event"/>

      </v-menu>



        <v-btn icon @click="logout">
            <v-icon>exit_to_app</v-icon>
        </v-btn>

    </v-toolbar>
</template>


<script>
    import LangSwitcher from './LangSwitcher';
    import Notifications from './notifications/Index';
    export default {
        name: 'app-header',
        components: {
            LangSwitcher,
            Notifications
        },
        props: ['value'],
        data() {
            return {
              drawer: this.value,
              notificationsCount: 0
            }
        },
        methods: {
            toggle() {
                this.drawer = !this.drawer;
                this.$emit('input', this.drawer);
            },
            logout(){
              this.$store.dispatch('auth/logout')
                .then(()=> this.$router.push({name: 'login'}));
            }
        },
        mounted(){
          this.$refs.header.heights = {
              mobileLandscape: Math.ceil(48 * 0.67),
              mobile: Math.ceil(80 * 0.67),
              desktop: Math.ceil(64 * 0.67),
              dense: Math.ceil(48 * 0.67)
          };
        },
        watch: {
            value(newValue) {
                this.drawer = newValue;
            }
        }
    }
</script>
