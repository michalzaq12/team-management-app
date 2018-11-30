<template>
    <div class="team-list">
        <v-loading :active="isLoading"/>

        <v-container grid-list-xs text-xs-center class="card">
          <transition-group name="scale" tag="v-layout" class="row wrap fill-height" appear>
            <team v-for="team in allTeams" :key="team.id" :team="team" :allowLeave="true" @leave="leaveTeamConfirmation(team)"/>
          </transition-group>
        </v-container>


        <v-btn fixed dark fab bottom right style="z-index: 2;" color="demko" @click.native="addTeamDialog = true">
            <v-icon>add</v-icon>
        </v-btn>



        <v-dialog v-model="addTeamDialog" persistent :max-width="$vuetify.breakpoint.xsOnly ? '100%' : '50%'">
            <add-team :isOpen.sync="addTeamDialog" />
        </v-dialog>

      <v-dialog v-model="leaveTeamDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">
            <v-icon large color="red">warning</v-icon>
            Warning!
          </v-card-title>

          <v-card-text>
            Are you sure you want leave the team?
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn flat="flat" @click="leaveTeamDialog = false">Cancel</v-btn>

            <v-btn color="red" flat="flat" @click="leaveTeam">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>
</template>


<script>
    import Team from './team/Item';
    import AddTeam from './team/Add.modal';
    import {mapGetters, mapActions}  from 'vuex';
    export default {
        name: 'teams-list',
        components: {
            Team,
            AddTeam
        },
        data() {
            return {
                isLoading: false,
                addTeamDialog: false,
                leaveTeamDialog: false,
                selectedTeam: null
            }
        },
        computed: {
          ...mapGetters('userTeams', ['allTeams']),
        },
        methods: {
            ...mapActions('userTeams', ['fetchTeams']),
            _fetchTeams(){
              this.isLoading = true;
              this.fetchTeams().finally(() => this.isLoading = false);
            },
            leaveTeamConfirmation(team){
              this.leaveTeamDialog = true;
              this.selectedTeam = team;
            },
            leaveTeam(){
              this.$http.delete('/team-memberships/' + this.selectedTeam.membership_id).then(() => {
                this._fetchTeams()
              });
            }
        },
        created() {
            this._fetchTeams();
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
