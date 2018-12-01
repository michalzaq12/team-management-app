<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
    <v-toolbar dark color="primary">
      <v-toolbar-title>Wyślij zaproszenie na mecz</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-layout justify-space-between align-center class="ma-2 mt-4 mb-4">

          <div style="min-width: 100px; text-align: center">
              <v-thumbnail :team="invitingTeam"/>
          </div>

          <div>
            <span class="headline font-weight-thin font-italic">VS</span>
          </div>

          <div style="min-width: 100px; text-align: center">
              <v-thumbnail :team="invitedTeam" />
          </div>

        </v-layout>
      </v-toolbar-items>

    </v-toolbar>

      <v-loading :active="isLoading" />



    <v-stepper v-model="currentStep">

      <v-stepper-header>
        <v-stepper-step :complete="currentStep > 1" step="1" color="demko">Wybór drużyny</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 2" step="2" color="demko">Miejsce rozegrania spotkania</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentStep > 3" step="3" color="demko">Czas spotkania</v-stepper-step>

      </v-stepper-header>


      <v-stepper-content step="1">
        <div>
          <v-list
            subheader
            two-line
          >
            <v-subheader>Wybierz jedną ze swoich prowadzoncyh drużyn</v-subheader>


            <v-radio-group v-model="invitingTeam" color="demko">



            <v-list-tile v-for="userTeam in allTeamsWhereUserIsLeader" :key="userTeam.id" @click="invitingTeam = userTeam">

              <v-list-tile-action>
                <v-radio color="demko" :value="userTeam"></v-radio>
              </v-list-tile-action>

              <v-list-tile-avatar>
                <v-thumbnail :team="userTeam"/>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{userTeam.name}}</v-list-tile-title>
              </v-list-tile-content>

            </v-list-tile>

            </v-radio-group>

          </v-list>
        </div>
        <div class="text-xs-center">
          <v-btn flat @click="dialog = false">{{$t('button.cancel')}}</v-btn>
          <v-btn :disabled="invitingTeam === null" color="demko" class="white--text" @click="currentStep = 2">{{$t('button.continue')}}</v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-content step="2">
          <div class="mb-3">
            <span class="subheading">Kliknij prawym przyciskem aby wybrać lokalizacje</span>
            <gmap-map v-if="currentStep > 1"
              :center="invitedTeam.location"
              ref="map"
              :zoom="8"
              :options="{}"
              style="width:100%;  height: 250px;"
              @click="matchLocation = $event.latLng"
            >
              <gmap-marker v-if="matchLocation" :position="matchLocation" :icon="createStadiumIcon()"/>
              <gmap-marker :position="invitingTeam.location" :icon="createTeamIcon(invitingTeam)" @click="setMapCenter(invitingTeam.location)"/>
              <gmap-marker :position="invitedTeam.location" :icon="createTeamIcon(invitedTeam)" @click="setMapCenter(invitedTeam.location)"/>
            </gmap-map>

          </div>
          <div class="text-xs-center">
            <v-btn flat @click="currentStep = 1">{{$t('button.cancel')}}</v-btn>
            <v-btn :disabled="matchLocation === null" color="demko" class="white--text" @click="currentStep = 3">{{$t('button.continue')}}</v-btn>
          </div>
      </v-stepper-content>


      <v-stepper-content step="3">
          <div class="mb-3">
            <!--<div class="text-xs-center headline font-weight-bold">Data</div>-->

            <v-dialog
              persistent
              v-model="dateDialog"
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                color="demko"
                slot="activator"
                label="Data"
                v-model="matchDate"
                readonly
              ></v-text-field>
              <v-date-picker actions color="primary"
                             @input="matchDate = $event"
                             :locale="$i18n.locale">
                <template>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click.stop="matchDate = null; dateDialog = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click.stop="dateDialog = false">OK</v-btn>
                  </v-card-actions>
                </template>
              </v-date-picker>
            </v-dialog>


            <v-dialog
              persistent
              v-model="timeDialog"
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                color="demko"
                slot="activator"
                label="Godzina"
                v-model="matchTime"
                readonly
              ></v-text-field>
              <v-time-picker actions color="primary"
                             @input="matchTime = $event"
                             :locale="$i18n.locale"
                             format="24hr">
                <template>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click.stop="matchTime = null; timeDialog = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click.stop="timeDialog = false">OK</v-btn>
                  </v-card-actions>
                </template>
              </v-time-picker>
            </v-dialog>


          </div>
          <div class="text-xs-center">
            <v-btn flat @click="currentStep = 2">{{$t('button.cancel')}}</v-btn>
            <v-btn :disabled="matchTime === null || matchDate === null" color="demko" class="white--text" @click="sendInvitation">{{$t('button.continue')}}</v-btn>
          </div>
      </v-stepper-content>

    </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
    import moment from 'moment';
    import {mapGetters, mapActions}  from 'vuex';
    export default {
        name: "matchInvitation",
        data(){
          return{
            isLoading: false,
            dialog: false,
            dateDialog: false,
            timeDialog: false,

            currentStep: 1,

            invitedTeam: {},
            invitingTeam: {},
            matchLocation: null,
            matchDate: null,
            matchTime: null
          }
        },
        computed: {
          ...mapGetters('userTeams', ['allTeamsWhereUserIsLeader']),
        },
        watch:{
          currentStep(newVal){
            if(newVal === 2) this.$nextTick(() => this.setMapBounds());
          }
        },
        methods:{
          ...mapActions('userTeams', ['fetchTeams']),
          clear(){
            this.matchLocation = null;
            this.matchDate = null;
            this.matchTime = null;
          },
          open(invitedTeam){
            this.isLoading = true;
            this.fetchTeams().finally(() => this.isLoading = false);
            this.invitedTeam = invitedTeam;
            this.dialog = true;
          },
          sendInvitation(){
            this.isLoading = true;

            const datetime = moment(this.matchDate + ' ' + this.matchTime, 'YYYY-MM-DD HH:mm').format();

            this.$http.post('/match-invitations', {
              inviting_team_id: this.invitingTeam.id,
              invited_team_id: this.invitedTeam.id,
              location: this.matchLocation,
              date: datetime
            }).then(() => this.dialog = false)
              .finally(() => this.isLoading = false)


          },
          createTeamIcon(team){
            if(team.thumbnail === null) return null;
            return {
              url: this.apiUrl + team.thumbnail,
              scaledSize: new google.maps.Size(40, 40), // scaled size
              origin: new google.maps.Point(0,0), // origin
              anchor: new google.maps.Point(20, 20) // anchor
            }
          },
          createStadiumIcon(){
            return {
              url: 'https://static.thenounproject.com/png/446596-200.png',
              scaledSize: new google.maps.Size(60, 60), // scaled size
              origin: new google.maps.Point(0,0), // origin
              anchor: new google.maps.Point(30, 60) // anchor
            }
          },
          setMapCenter(location){
            this.matchLocation = location;
            this.$refs.map.$mapPromise.then(map => {
              map.setCenter(location);
              map.setZoom(12);
            });
          },
          setMapBounds(){
            this.$refs.map.$mapPromise.then((map) => {

              const lat_min =  Math.min(this.invitedTeam.location.lat, this.invitingTeam.location.lat);
              const lat_max = Math.max(this.invitedTeam.location.lat, this.invitingTeam.location.lat);
              const lng_min = Math.min(this.invitedTeam.location.lng, this.invitingTeam.location.lng);
              const lng_max = Math.max(this.invitedTeam.location.lng, this.invitingTeam.location.lng);

              map.setCenter(new google.maps.LatLng(
                ((lat_max + lat_min) / 2.0),
                ((lng_max + lng_min) / 2.0)
              ));

              map.fitBounds(new google.maps.LatLngBounds(
                //bottom left
                new google.maps.LatLng(lat_min, lng_min),
                //top right
                new google.maps.LatLng(lat_max, lng_max)
              ));


            });
          }
        }
    }
</script>
