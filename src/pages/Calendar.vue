<template>
  <div style="width: 100%">
    <calendar :events="demoEvents" locale="pl" firstDay="1" @eventClick="eventClick" @dayClick="dayClick"></calendar>

    <v-btn fixed dark fab bottom right style="z-index: 2;" color="demko" @click.native="addTeamDialog = true">
      <v-icon>add</v-icon>
    </v-btn>

  </div>
</template>

<script>
  import calendar from 'vue-fullcalendar';
  export default {
    name: 'asd',
    components: {calendar},
    data(){
      return {
        demoEvents: [
          {
            title : 'Trening',
            start : '2018-11-12',
            end : '2018-11-12',
            cssClass  : 'training'
          }
        ]
      }
    },
    methods:{
      eventClick(event){
        console.log(event);
      },
      dayClick(date){
        console.log(date);
      }
    },
    created(){
      setTimeout(()=> {

      })
    }
  }
</script>


<style lang="scss">
  .comp-full-calendar{
    width: 100%;
    background: none;


    & .full-calendar-body{
      background-color: white;

      & .weeks{
        color: white;
        background-color: #424242;
      }

    }

    & .training{
      background-color: lighten(#32aaf0, 20%) !important;
    }

    & .day-cell.today{
      background-color: lighten(#424242, 60%) !important;
    }

  }
</style>
