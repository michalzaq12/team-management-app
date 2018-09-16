<template>
    <div class="text-xs-center">
        <v-menu offset-y left>
            <v-btn slot="activator" dark icon>
                <v-icon>language</v-icon>
            </v-btn>
            <v-list>
                <v-list-tile v-for="(item, index) in langs" :key="index" @click="$i18n.locale = item.locale">
    
                    <v-list-tile-avatar>
                        <img src="@/assets/flags/blank.gif" :class="`flag flag-${item.flag}`"/>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title>{{item.title}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>


<script>
    export default {
        name: 'lang-switcher',
        data() {
            return {
                langs: [
                    {
                        title: 'Polski',
                        locale: 'pl',
                        flag: 'pl'
                    },
                    {
                        title: 'English',
                        locale: 'en',
                        flag: 'gb'
                    }
                ]
            }
        }
    }
</script>


<style>
    /* https://www.flag-sprites.com/ -> GoSquared flat large   32x32 */
    
    @import '~@/assets/flags/flags.css';
</style>
