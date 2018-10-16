<template>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="demko" dark app fixed class="app-header">

        <v-toolbar-title class="ml-0">
            <v-toolbar-side-icon @click.stop="toggle"></v-toolbar-side-icon>
            <span class="font-weight-bold title">DemCouch</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <lang-switcher/>

        <v-btn icon>
            <v-icon>notifications</v-icon>
        </v-btn>
        <v-btn icon @click="logout">
            <v-icon>exit_to_app</v-icon>
        </v-btn>

    </v-toolbar>
</template>


<script>
    import LangSwitcher from './LangSwitcher';
    export default {
        name: 'app-header',
        components: {
            LangSwitcher
        },
        props: ['value'],
        data() {
            return {
                drawer: this.value
            }
        },
        methods: {
            toggle() {
                this.drawer = !this.drawer;
                this.$emit('input', this.drawer);
            },
            logout(){
              this.$store.dispatch('auth/logout')
                .then(()=> this.$router.push('login'));
            }
        },
        watch: {
            value(newValue) {
                this.drawer = newValue;
            }
        }
    }
</script>



<style lang="scss" scoped>
    .app-header{
      z-index: 100;
    }

    .d-header {
        width: 100%;
        height: 60px;
        background: red;
    }
</style>
