<template>
    <v-flex xs6 sm4 md3 lg3 xl2 style="z-index: 0; cursor: pointer">
      <v-hover>
        <v-card slot-scope="{ hover }"
                :disabled="team.confirmed === false"
                :class="`elevation-${hover ? 12 : 2}`" class="item" style="z-index: 0"
                @click.native="$router.push({name: 'team-page', params: {teamId: team.id}})">


            <div class="pa-3 thumbnail" ref="thumbnail">
                <img v-if="team.thumbnail" :src="apiUrl + team.thumbnail" height="100px" />
                <div v-else style="height: 100px;">
                  <v-icon x-large>insert_photo</v-icon>
                </div>
            </div>

            <v-card-title primary-title style="position: relative">

                <v-layout row wrap align-center class="card-content">
                    <v-flex xs12 class="text-xs-center" >
                        <h3 class="mb-0 font-weight-bold" :style="teamNameStyle">{{team.name}}</h3>
                    </v-flex>
                    <v-flex xs12 class="text-xs-center">
                        <div class="grey--text">{{team.location.name}}</div>
                    </v-flex>
                </v-layout>

            </v-card-title>


          <!--<v-divider light></v-divider>-->

          <v-card-actions class="grey--text">


              <span v-if="team.discipline === 'football'" class="icon-soccer-ball3"></span>
              <span v-else-if="team.discipline === 'basketball'" class="icon-basketball6"></span>
              <span v-else-if="team.discipline === 'volleyball'" class="icon-volleyball"></span>
              <span v-else class="icon-baseball2"></span>

              <span>{{$t(`discipline.${team.discipline}`)}}</span>


            <v-spacer></v-spacer>

            <v-btn v-if="allowJoin" icon @click.stop="$emit('join', team.id)">
              <v-icon color="demko">person_add</v-icon>
            </v-btn>

            <v-btn v-if="allowLeave" icon @click.stop="$emit('leave', team.id)">
              <v-icon color="red">delete_forever</v-icon>
            </v-btn>

          </v-card-actions>

            <!--<v-card-actions>-->
                <!--<v-flex align-content-center align-end>-->
                    <!--<div class="text-xs-center">-->
                        <!--<v-chip outline color="demko">-->
                            <!--<span v-if="team.discipline === 'football'" class="icon-soccer-ball3"></span>-->
                            <!--<span v-else-if="team.discipline === 'basketball'" class="icon-basketball6"></span>-->
                            <!--<span v-else-if="team.discipline === 'volleyball'" class="icon-volleyball"></span>-->
                            <!--<span v-else class="icon-baseball2"></span>-->

                            <!--<span class="font-weight-bold">{{$t(`discipline.${team.discipline}`)}}</span>-->
                        <!--</v-chip>-->
                      <!--<v-btn v-if="allowJoin" flat color="demko" @click.stop="$emit('join', team.id)">Join</v-btn>-->
                      <!--<v-btn v-if="allowLeave" flat color="demko" @click.stop="$emit('leave', team.id)">Leave</v-btn>-->
                    <!--</div>-->
                <!--</v-flex>-->
            <!--</v-card-actions>-->
        </v-card>
      </v-hover>
    </v-flex>
</template>


<script>
  import colorsUtil from './colors.util';
    import api from '@/api';
    export default {
        name: 'team',
        props: {
            team: Object,
            allowJoin: {
              type: Boolean,
              default: false
            },
            allowLeave : {
              type: Boolean,
              default: false
            }
        },
        mounted(){
          if(this.team.thumbnail === null) return;
          const img = new Image(100,100);
          img.crossOrigin = "Anonymous";
          img.src = api.API_URL + this.team.thumbnail;
          img.onload = () => {
            const color = colorsUtil.getDominant(img);
            console.log(color);
            console.log(this.$refs.thumbnail.style);
            this.$refs.thumbnail.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            //this.$refs.thumbnail.style.backgroundImage = `-webkit-gradient(linear,left top,left bottom,color-stop(0, rgba(${color.r}, ${color.g}, ${color.b}, 0.5)),color-stop(1, rgba(0,0,0,0)))`;

          }
        },
        computed: {
            teamNameStyle() {
                const nameLength = this.team.name.length;
                let fontSize = 20;
                if (nameLength > 15 && nameLength < 24) fontSize = 16;
                else if (nameLength >= 24) fontSize = 12;
                return {
                    'font-size': fontSize + 'px',
                    'line-height': fontSize + 'px'
                }
            }
        }
    }
</script>


<style lang="scss" scoped>
    .item {
        margin: 10px;
        min-width: 100px;
        //width: 20%;

        & .card-content {
            min-height: 50px;
        }

        & .thumbnail{
          background-color: #d4d4d4;
          /*background-image: -webkit-gradient(*/
              /*linear,*/
              /*left top,*/
              /*left bottom,*/
              /*color-stop(0, lighten(black, 90%)),*/
              /*color-stop(1, rgba(0,0,0,0))*/
          /*);*/

          & img{
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
          }
        }
    }

    [class^="icon-"],
    [class*=" icon-"] {
        font-size: 1.8rem;
        margin-right: 5px;
    }
</style>
