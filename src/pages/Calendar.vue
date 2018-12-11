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
          <v-toolbar-title>{{$t('match.details')}}</v-toolbar-title>
        </v-toolbar>


        <v-card-text>
          <match-info :match="selectedMatch" :map="true"/>
        </v-card-text>

      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import moment from 'moment';
  import calendar from 'vue-fullcalendar';
  import MatchInfo from '@/pages/match/Info';
  import {mapGetters}  from 'vuex';
  export default {
    name: 'user-calendar',
    components: {calendar, MatchInfo},
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
      this.weekNames.push(this.weekNames.shift()); //set first day of week to Monday
      //vue-fullcalendar throw error if call moment.weekdays(true)

      this.isLoading = true;
      this.$http.get(`/users/${this.userId}/matches`).then(({data}) => {
        for(const match of data){
          this.matches.push({
            title: match.inviting_team.name + ' vs ' +  match.invited_team.name,
            start: moment(match.date),
            end: moment(match.date),
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
