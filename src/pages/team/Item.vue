<template>
    <v-flex xs12 sm6 md4 lg3 xl2 style="z-index: 0; cursor: pointer">
      <v-hover>
        <v-card slot-scope="{ hover }"
                :class="[`elevation-${hover ? 12 : 2}`, team.confirmed === false ? 'inactive' : '']" class="item" style="z-index: 0"
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
            this.$refs.thumbnail.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
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

        & .card-content {
            min-height: 50px;
        }

        & .thumbnail{
          background-color: #d4d4d4;

          & img{
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
          }
        }

        &.inactive{
          opacity: 0.5;
          position: relative;

          &:after{
            content: "";
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: white;
            background-size: cover;
            background-repeat: no-repeat;
            opacity: 0.4;
          }
        }



    }

    [class^="icon-"],
    [class*=" icon-"] {
        font-size: 1.8rem;
        margin-right: 5px;
    }
</style>
