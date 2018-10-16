<template>
<div>
    <app-header v-model="drawer"/>
    <app-menu v-model="drawer"/>
     <v-content class="main-container">
         <v-container fluid fill-height :class="{'pa-0': $vuetify.breakpoint.xsOnly}">
             <v-layout justify-center align-center>
        <slot />
        </v-layout>
        </v-container>
    </v-content>
</div>
</template>



<script>
import AppHeader from '@/components/Header';
import AppMenu from '@/components/Menu';
export default {
    name: 'basic-layout',
    components: {AppHeader, AppMenu},
    data(){
        return{
             drawer: null,
        }
    },
    created(){
        this.drawer = this.$vuetify.breakpoint.lgAndUp;
    }
}
</script>


<style>
  .main-container{
    min-height: 100vh;
  }
</style>
