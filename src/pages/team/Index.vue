<template>
  <div class="main-container" >
    <div ref="containerBg" class="bg"></div>
    <v-loading :active="isLoading" />
    <div v-if="!isLoading" >
      <div class="team-details">

        <div class="team-thumbnail">

          <v-card>
            <img :src="thumbUrl" />


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

        </div>


        <div class="team-info">
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <div class="headline font-weight-bold">{{team.name}}</div>
                    <span class="grey--text">{{team.description}}</span>
                    <span class="grey--text">City: {{team.location.name}}</span>
                  </div>
                </v-card-title>

                <v-divider light></v-divider>

                <v-card-actions>
                  <v-btn icon>
                    <v-icon>share</v-icon>
                  </v-btn>
                  <v-btn icon flat color="pink">
                    <v-icon>favorite</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat color="red">Remove</v-btn>
                </v-card-actions>

              </v-card>
        </div>

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
                    <v-avatar
                      :tile="false"
                      :size="30"
                      color="grey lighten-4"
                    >
                      <img v-if="props.item.thumbnail" :src="props.item.thumbnail" alt="avatar">
                      <img v-else src="https://via.placeholder.com/30x30"/>
                    </v-avatar>
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

  </div>
</template>


<script>
  import moment from 'moment';
  import ThumbnailUploadButton from './ThumbUpload';
  import api from '@/api';
  export default {
    name: 'team-page',
    components: {ThumbnailUploadButton},
    data(){
      return{
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
      }
    },
    mounted(){
      this.fetchData();
    }
  }
</script>


<style lang="scss" scoped>
  .main-container{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    flex-grow: 1;

    & .bg{
      position:absolute;
      opacity: 0.2;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      filter: blur(50px);
      background-size:     cover;
      background-repeat:   no-repeat;
      background-position: center center;
    }


    & .team-details{
      display: flex;
      justify-content: space-around;

      & .team-info{
        width: 50%;
      }

      & .team-thumbnail{
        & img{
          margin: 40px;
          max-height: 150px;
        }
      }
    }


    & .team-players {
      margin-top: 50px;

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
