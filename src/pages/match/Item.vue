<template>
  <v-flex xs12 sm6 md4 lg4 xl2>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`" class="ma-2">

        <v-card-text>

          <div class="text-xs-center">
            <div class="subheading font-weight-bold">{{getDate(match.date)}}</div>
            <br><div class="subheading mb-1">({{getDayName(match.date)}})</div>
            <br><div>{{getTime(match.date)}}</div>
          </div>




          <v-layout justify-space-between align-center class="ma-2 mt-0 mb-4">

            <div style="min-width: 100px">
              <v-layout align-center justify-center column fill-height>
                <v-thumbnail :team="match.inviting_team" />
                <div class="mt-2">{{match.inviting_team.name}}</div>
              </v-layout>
            </div>

            <div>
              <span class="headline font-weight-thin font-italic">VS</span>
            </div>

            <div style="min-width: 100px">
              <v-layout align-center justify-center column fill-height>
                <v-thumbnail :team="match.invited_team" />
                <div class="mt-2">{{match.invited_team.name}}</div>
              </v-layout>
            </div>

          </v-layout>

          <div class="text-xs-center font-weight-bold subheading">
            {{match.location.name}}
          </div>


        </v-card-text>


      </v-card>
    </v-hover>
  </v-flex>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "match",
        props: {
          match: {
            type: Object,
            required: true
          }
        },
        methods: {
          getDate(date){
            return moment(date).format('DD-MM-YYYY');
          },
          getDayName(date){
            return moment(date).locale(this.$i18n.locale).format('dddd');
          },
          getTime(date){
            return moment(date).format('HH:mm');
          },
        }
    }
</script>
