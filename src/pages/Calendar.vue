<template>
  <div style="width: 100%">

    <v-loading :active="isLoading" />

    <calendar
      :events="matches"
      titleFormat="MMMM yyyy"
      :monthNames="monthNames"
      :weekNames="weekNames"
      firstDay="1"
      @eventClick="eventClick"
      @dayClick="dayClick" />


    <v-dialog v-model="dialog" max-width="500" lazy>

      <v-card v-if="selectedMatch">


        <v-toolbar dark color="primary" class="mb-2">
          <v-toolbar-title>Informajce o wydarzeniu</v-toolbar-title>
        </v-toolbar>


        <v-card-text>

          <div class="text-xs-center">
            <!--<div class="title">{{getDate(notification.data.invitation.date)}}</div>-->
            <!--<br><div class="title mb-1">({{getDayName(notification.data.invitation.date)}})</div>-->
            <!--<br><div>{{getTime(notification.data.invitation.date)}}</div>-->

          </div>


          <v-layout justify-space-between align-center class="ma-2 mt-0 mb-4">

            <div style="min-width: 100px">
              <v-layout align-center justify-center column fill-height>
                <v-thumbnail :team="selectedMatch.inviting_team" />
                <div class="mt-2">{{selectedMatch.inviting_team.name}}</div>
              </v-layout>
            </div>

            <div>
              <span class="headline font-weight-thin font-italic">VS</span>
            </div>

            <div style="min-width: 100px">
              <v-layout align-center justify-center column fill-height>
                <v-thumbnail :team="selectedMatch.invited_team" />
                <div class="mt-2">{{selectedMatch.invited_team.name}}</div>
              </v-layout>
            </div>

          </v-layout>
        </v-card-text>

      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import moment from 'moment';
  import calendar from 'vue-fullcalendar';
  import {mapGetters}  from 'vuex';
  export default {
    name: 'asd',
    components: {calendar},
    data(){
      return {
        dialog: false,
        selectedMatch: null,
        weekNames: moment.localeData(this.$i18n.locale).weekdays(),
        monthNames: moment.localeData(this.$i18n.locale).months(),
        isLoading: false,
        matches: []
      }
    },
    computed: mapGetters('auth', ['userId']),
    methods:{
      eventClick(event){
        console.log(event);
        this.selectedMatch = event.data;
        this.dialog = true;
      },
      dayClick(date){
        console.log(date);
      }
    },
    created(){
      this.isLoading = true;
      this.$http.get(`/users/${this.userId}/matches`).then(({data}) => {
        for(const match of data){
          this.matches.push({
            title: match.inviting_team.name + ' vs ' +  match.invited_team.name,
            start: moment(match.date),
            end: moment(match.date).add(2, 'hours'),
            cssClass: 'training',
            data: match
          })
        }
      }).finally(() => this.isLoading = false)
    }
  }
</script>


<style lang="scss">
  .comp-full-calendar{
    width: 100%;
    background: none;


    & .full-calendar-body{
      background-color: transparent;

      & .weeks{
        color: white;
        background-color: $brand-secondary;
      }

    }

    & .training{
      color: white !important;
      background-color: $brand-primary !important;
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    }

    & .day-cell.today{
      background-color: lighten(#424242, 60%) !important;
    }

  }
</style>
