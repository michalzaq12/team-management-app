<template>
  <div class="main-container" >
    <div ref="containerBg" class="bg"></div>
    <v-loading :active="isLoading" />
    <div>
      <div class="team-details">

        <v-layout v-if="!isUserTeamMember" align-center justify-center fill-height column class="team-actions">
          <v-btn color="primary" dark block large class="ma-0" @click="joinToTeam">
            {{$t('teamPage.join')}}
          </v-btn>
          <v-btn color="primary" dark block large class="ma-0 mt-3" @click="openMatchInvitationModal">
            {{$t('teamPage.sendInvitation')}}
          </v-btn>
        </v-layout>

          <v-card class="team-thumbnail">

            <v-card-text>
              <v-layout justify-center align-center>
                <v-thumbnail :team="team" :size="150" class="thumb"/>
              </v-layout>
            </v-card-text>




            <v-card-actions v-if="isUserLeader">
              <v-spacer></v-spacer>
              <a class="v-btn v-btn--icon theme--light activator">
                <thumbnail-upload-button ref="upload" :raw="true" @file-selected="updateThumbnail">
                    <v-icon>create</v-icon>
                </thumbnail-upload-button>
              </a>
              <v-btn icon v-if="team.thumbnail !== null" @click="deleteThumbnail">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-card-actions>

          </v-card>


        <v-card class="team-name" color="secondary">
          <v-card-title primary-title class="justify-center">
            <span class="display-1 font-weight-bold white--text">{{team.name}}</span>
          </v-card-title>
        </v-card>

        <v-card class="team-info">

          <v-card-title primary-title class="justify-space-between">
            <span class="headline font-weight-bold">{{$t('teamPage.teamDetails')}}</span>
            <div v-if="isUserLeader">
              <v-btn icon @click="editTeam">
                <v-icon>create</v-icon>
              </v-btn>
              <v-btn icon @click="removeTeam">
                <v-icon>clear</v-icon>
              </v-btn>
            </div>

          </v-card-title>


          <v-divider />


          <v-card-text>
            <span v-if="team.description"><span class="headline grey--text">{{$t('global.description')}}: {{team.description}}</span><br></span>
            <span class="headline grey--text">{{$t('teamPage.city')}}: {{team.location.name}}</span>
          </v-card-text>

          <v-card-actions class="justify-center">

          </v-card-actions>

        </v-card>


              <v-card class="map">
                <v-card-text style="height: 100%;">
                  <gmap-map
                    v-if="team.location.lat"
                    :center="team.location"
                    :zoom="8"
                    :options="{disableDefaultUI: true, styles: mapStyles}"
                    style="width:100%;  height: 100%;"
                  >
                    <gmap-marker
                      :position="team.location"
                    ></gmap-marker>
                  </gmap-map>
                </v-card-text>

              </v-card>


      </div>

      <div class="team-players">



          <v-tabs
            slot="extension"
            v-model="tab"
            color="secondary"
            grow
            dark
            icons-and-text
          >
            <v-tabs-slider dark></v-tabs-slider>
            <v-tab>
              {{$t('teamPage.members')}}
              <v-icon>people_outline</v-icon>
            </v-tab>
            <v-tab>
              {{$t('teamPage.matches')}}
              <v-icon>event</v-icon>
            </v-tab>
          </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>


            <v-card>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{$t('teamPage.members')}}</div>
                </div>
              </v-card-title>

              <v-data-table
                :headers="headers"
                :items="players"
              >
                <template slot="items" slot-scope="props">
                  <td class="player-thumb">
                    <v-thumbnail :user="props.item.user" :size="30" :avatar="true"/>
                  </td>
                  <td><v-chip>{{$t(`role.${props.item.role}`)}}</v-chip></td>
                  <td>{{ props.item.user.first_name }}</td>
                  <td>{{ props.item.user.last_name }}</td>
                  <td >{{ props.item.user.born_date }}
                    <span v-if="props.item.user.born_date">({{getAge(props.item.user.born_date)}} l.)</span>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <v-layout align-center justify-space-between>
                      <div>{{ formatDate(props.item.create_date) }}</div>
                      <div v-if="isUserLeader">
                        <v-btn icon @click="removeMembership(props.item.id)">
                          <v-icon>clear</v-icon>
                        </v-btn>
                      </div>
                    </v-layout>
                  </td>
                </template>
              </v-data-table>


            </v-card>


          </v-tab-item>

          <v-tab-item>
            <v-card flat>

              <v-container grid-list-xs text-xs-center class="card">
                <transition-group name="scale" tag="v-layout" class="row wrap fill-height" appear>
                  <match v-for="match in matches" :match="match" :key="match.id" />
                </transition-group>
              </v-container>

            </v-card>
          </v-tab-item>
        </v-tabs-items>


      </div>

    </div>

    <MatchInvitation ref="matchInvitation"/>
    <!--<add-team-modal ref="addTeamModal"/>-->

  </div>
</template>


<script>
  import moment from 'moment';
  import MatchInvitation from './MatchInvitation.modal';
  import ThumbnailUploadButton from './ThumbUpload';
  import api from '@/api';
  import mapStyles from '@/assets/mapStyles';
  import Match from '../match/Item';
  import AddTeamModal from './Add.modal';
  import {mapGetters}  from 'vuex';
  export default {
    name: 'team-page',
    components: {AddTeamModal, ThumbnailUploadButton, MatchInvitation, Match},
    data(){
      return{
        mapStyles: mapStyles({road: this.$vuetify.theme.secondary, water: '#5eb8ff'}),
        isLoading: true,
        team: {
          name: '',
          location:{
            name: ''
          }
        },
        players: [],
        matches: [],
        tab: null,
        headers: [
          { text: '', value: 'thumbnail'},
          { text: 'Rola', value: 'role', sortable: false},
          { text: this.$t('user.firstName') },
          { text: this.$t('user.lastName') },
          { text: this.$t('user.bornDate') },
          { text: 'Dołączył' }
        ],
      }
    },
    computed: {
      thumbUrl(){
        return api.API_URL + this.team.thumbnail;
      },
      teamId(){
        return this.$route.params.teamId;
      },
      isUserTeamMember(){
        if(this.players.length === 0) return false;
        return this.players.map(el => el.user).find(player => player.id === this.userId) !== undefined;
      },
      isUserLeader(){
        if(this.players.length === 0) return false;
        return this.players.find(membership => membership.role === 'leader'
          && membership.user.id === this.userId) !== undefined;
      },
      ...mapGetters('auth', ['userId'])
    },
    methods: {
      joinToTeam(){
        this.isLoading = true;
        this.$http.post('/team-memberships', {team_id: this.teamId}).then(() => {
          this.$eventBus.$emit('info', 'Wysłano prośbę o dołączenie')
        }).finally(() => this.isLoading = false);
      },
      editTeam(){
        this.$refs.addTeamModal.edit({
          name: this.team.name,
          discipline: this.team.discipline,
          location: this.team.location
        })
      },
      removeTeam(){
        this.$http.delete('/teams/' + this.team.id);
      },
      setBackground(){
        this.$refs.containerBg.style.backgroundImage = `url('${this.thumbUrl}')`;
      },
      getAge(date){
        return moment().diff(moment(date, 'YYYY-MM-DD'), 'years');
      },
      formatDate(date){
        return moment(date).format('YYYY-MM-DD');
      },
      updateThumbnail(){
        this.isLoading = true;
        this.$refs.upload.send('/teams/'+ this.team.id +'/thumbnail').then(() => {
          this.fetchData();
        }).catch(() => this.isLoading = false);
      },
      deleteThumbnail(){
        this.$http.delete('/teams/'+ this.team.id +'/thumbnail').then(() => {
          this.fetchData();
        }).catch(() => this.isLoading = false);
      },
      fetchData(){
        this.isLoading = true;
        this.$http.get('/teams/' + this.teamId).then(({data}) => {
          this.team = data;
          this.$nextTick(() => this.setBackground());
        }).finally(() => this.isLoading = false);
      },
      openMatchInvitationModal(){
        this.$refs.matchInvitation.open(this.team);
      },
      fetchPlayers(){
        this.$http.get(`/teams/${this.teamId}/team-memberships`).then(({data}) => {
          this.players = data;
        }).then(() => {
          if(this.isUserTeamMember) this.fetchMatches();
        })
      },
      fetchMatches(){
        this.$http.get(`/teams/${this.teamId}/matches`).then(({data}) => {
          this.matches = data;
        })
      },
      removeMembership(membershipId){
        this.$http.delete('/team-memberships/' + membershipId).then(() => {
          this.fetchPlayers();
        });
      }
    },
    created(){
      this.fetchData();
      this.fetchPlayers();
    }
  }
</script>


<style lang="scss" scoped>
  .main-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    /*flex-grow: 1;*/

    & .bg{
      position:absolute;
      opacity: 0.1;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      filter: blur(2px);
      background-size: auto 100%;
      background-repeat:   no-repeat;
      background-position: center center;
    }


    & .team-details{
      display: grid;
      grid-column-gap: 20px;
      grid-row-gap: 20px;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-areas:
        "name name map"
        "thumbnail info map"
        "thumbnail actions map";

      @media (max-width: $breakpoint-sm) {
        margin: 20px;
        grid-template-columns: 1fr;
        grid-template-areas:
          "name"
          "thumbnail"
          "info"
          "actions"
          "map";
      }

      & .team-info{
        grid-area: info;
      }

      & .team-name{
        grid-area: name;
      }

      & .team-actions{
        grid-area: actions;
        min-height: 100px;
      }

      & .map{
        grid-area: map;

        & .v-card__text{
          min-height: 300px;
        }

        & .vue-map-container{
          position: inherit;
        }
      }

      & .team-thumbnail{
        grid-area: thumbnail;
        align-self: stretch;

        & .thumb {
            margin: 40px 0;
        }
      }
    }


    & .team-players {

      margin-top: 20px;

      & td{
        height: 50px;
        vertical-align: middle;
      }

      & .player-thumb{
        /*display: flex;*/
        /*align-items: center;*/
      }
    }
  }
</style>
