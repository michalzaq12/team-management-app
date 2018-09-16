<template>
    <div class="team-list">
    
        <v-container grid-list-xs text-xs-center>
            <v-layout row wrap fill-height>
                <team v-for="team in teams" :key="team.id" :team="team" />
            </v-layout>
        </v-container>
    
        <v-btn fixed dark fab bottom right style="z-index: 2;" color="demko" @click.native="addTeamDialog = true">
            <v-icon>add</v-icon>
        </v-btn>
    
        <div class="text-xs-center">
            <v-pagination v-model="currentPage" color="demko" :length="pageCount" circle></v-pagination>
        </div>
    
        <v-dialog v-model="addTeamDialog" persistent :max-width="$vuetify.breakpoint.xsOnly ? '100%' : '50%'">
            <add-team :isOpen.sync="addTeamDialog" />
        </v-dialog>
    
    </div>
</template>


<script>
    import Team from './team/Item';
    import AddTeam from './team/Add.modal';
    export default {
        name: 'teams-list',
        components: {
            Team,
            AddTeam
        },
        data() {
            return {
                addTeamDialog: false,
                currentPage: 1,
                pageCount: 1,
                teams: []
            }
        },
        watch:{
            currentPage(newVal){
                this.fetchTeams();
            }
        },
        methods: {
            fetchTeams() {
                this.$eventBus.$emit('loading', true);
                this.$http.get('/teams', {params: {page: this.currentPage}}).then(({data}) => {
                    this.teams = data.data;
                    this.pageCount = data.pagination.page_count;
                    this.$eventBus.$emit('loading', false);
                })
            }
        },
        created() {
            this.fetchTeams();
        },
    }
</script>


<style lang="scss" scoped>
    .team-list {
        width: 100%;
    }
    
    .toolbar-wrapper {
        display: flex;
        //justify-content: center;
        margin-bottom: 10px;
        &>.toolbar {
            width: 30%;
        }
    }
    
    .wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
