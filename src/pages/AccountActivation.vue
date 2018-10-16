<template>
        <v-container fluid fill-height>
             <v-layout  align-center justify-center row>
                 <v-flex xs12 sm6 md4 lg3 xl2>
                    <div class="text-xs-center" v-if="!isLoading">
                        <h2 class="headline">Dziękumey za założenie konta w serwisie DemCouch</h2>
                        <span class="subheading">Za {{timer}}s zostaniesz przekierowany do panelu logowania</span>
                        <v-progress-linear v-model="progress" color="demko"></v-progress-linear>
                    </div>
                    <div class="text-xs-center" v-else>
                        <h2 class="headline">Trwa aktywacja konta...</h2>
                    </div>
                 </v-flex>
            </v-layout>
        </v-container>
</template>


<script>
const TIMEOUT = 5;
export default {
    name: 'account-activation',
    data(){
        return{
            isLoading: true,
            timer: TIMEOUT,
            progress: 0,
        }
    },
    methods:{
        activate(){
            this.$eventBus.$emit('loading', true);
            this.$http.get('/users/confirm/' + this.$route.params.token).then(() => {
                this.isLoading = false;
                this.$eventBus.$emit('loading', false);
                this.setTimers()
            }).catch(() => {
                this.redirectToLoginPage();
                this.$eventBus.$emit('loading', false);
            })
        },
        setTimers(){
             const progressInterval = setInterval(() => {
                this.progress += (100 / (TIMEOUT * 10) )
            }, 100)
            const timerInterval = setInterval(() => {
                this.timer--;
                if(this.timer === 0) {
                    clearInterval(timerInterval);
                    clearInterval(progressInterval);
                    this.redirectToLoginPage();
                }
            },1000);
        },
        redirectToLoginPage(){
            this.$router.push({name: 'login'});
        }
    },
    created() {
        this.activate();
    }
}
</script>

