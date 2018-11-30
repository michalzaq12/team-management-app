<template>
  <div class="main-container" >
    <div ref="containerBg" class="bg"></div>
    <v-loading :active="isLoading" />
    <div v-if="!isLoading" >
      <div class="team-details">

        <v-layout align-center justify-center fill-height column class="team-actions">
          <v-btn color="secondary" dark block large class="ma-0">
            Dołącz
          </v-btn>
          <v-btn color="secondary" dark block large class="ma-0 mt-3" @click="openMatchInvitationModal">
            Zaproś na sparing
          </v-btn>
        </v-layout>

          <v-card class="team-thumbnail">

            <v-card-text>
              <v-layout justify-center align-center>
                <v-thumbnail :team="team" :size="150" class="thumb"/>
              </v-layout>
            </v-card-text>




            <v-card-actions>
              <v-spacer></v-spacer>
              <a class="v-btn v-btn--icon theme--light activator">
                <thumbnail-upload-button ref="upload" :raw="true" @file-selected="updateThumbnail">
                    <v-icon>create</v-icon>
                </thumbnail-upload-button>
              </a>
              <v-btn icon @click="deleteThumbnail">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-card-actions>

          </v-card>


        <v-card class="team-name" color="demko">
          <v-card-title primary-title class="justify-center">
            <span class="display-1 font-weight-bold white--text">{{team.name}}</span>
          </v-card-title>
        </v-card>

        <v-card class="team-info">

          <v-card-title primary-title>
            <span class="headline font-weight-bold">Dane klubu</span>
          </v-card-title>


          <v-divider />


          <v-card-text>
            <span v-if="team.description"><span class="headline grey--text">Opis: {{team.description}}</span><br></span>
            <span class="headline grey--text">City: {{team.location.name}}</span>
          </v-card-text>

          <v-card-actions class="justify-center">

          </v-card-actions>

        </v-card>


              <v-card class="map">
                <v-card-text style="height: 100%;">
                  <gmap-map
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
            color="demko"
            grow
            dark
            icons-and-text
          >
            <v-tabs-slider dark></v-tabs-slider>
            <v-tab>
              Zawodnicy
              <v-icon>people_outline</v-icon>
            </v-tab>
            <v-tab light>
              Kalendarz
              <v-icon>event</v-icon>
            </v-tab>
          </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>


            <v-card>
              <v-card-title primary-title>
                <div>
                  <div class="headline">Zawodnicy</div>
                </div>
              </v-card-title>

              <v-data-table
                :headers="headers"
                :items="team.players"

                class=""
              >
                <template slot="items" slot-scope="props">
                  <td class="player-thumb">
                    <v-thumbnail :user="props.item"  :size="30"/>
                  </td>
                  <td>{{ props.item.first_name }}</td>
                  <td>{{ props.item.last_name }}</td>
                  <td >{{ props.item.born_date }} ({{getAge(props.item.born_date)}} l.)</td>
                </template>
              </v-data-table>


            </v-card>


          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>HEY@2</v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>




      </div>

    </div>

    <MatchInvitation ref="matchInvitation"/>

  </div>
</template>


<script>
  import moment from 'moment';
  import MatchInvitation from './MatchInvitation.modal';
  import ThumbnailUploadButton from './ThumbUpload';
  import api from '@/api';
  import mapStyles from '@/assets/mapStyles';


  export default {
    name: 'team-page',
    components: {ThumbnailUploadButton, MatchInvitation},
    data(){
      return{
        mapStyles: mapStyles({road: this.$vuetify.theme.secondary, water: '#5eb8ff'}),
        isLoading: true,
        team: null,
        tab: null,
        headers: [
          { text: '', value: 'thumbnail'},
          { text: 'Imie', value: 'calories' },
          { text: 'Nazwisko', value: 'fat' },
          { text: 'Data urodzenia', value: 'carbs' },
        ],
      }
    },
    computed: {
      thumbUrl(){
        return api.API_URL + this.team.thumbnail;
      }
    },
    methods: {
      setBackground(){
        this.$refs.containerBg.style.backgroundImage = `url('${this.thumbUrl}')`;
      },
      getAge(date){
        return moment().diff(moment(date, 'DD-MM-YYYY'), 'years');
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
        this.$http.get('/teams/' + this.$route.params.teamId).then(({data}) => {
          this.team = data;
          this.setBackground();
        }).finally(() => this.isLoading = false);
      },
      openMatchInvitationModal(){
        this.$refs.matchInvitation.open(this.team);
      }
    },
    created(){
      this.fetchData();
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
