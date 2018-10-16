<template>
  <div class="demko-calendar">
    <ds-calendar :calendar="calendar"/>
    <!--<kalendar :configuration="calendar_settings" :appointments="appointments">-->
      <!--<div slot="popup-form" slot-scope="{popup_scope}" style="display: flex; flex-direction: column;">-->
        <!--&lt;!&ndash; This is the popup that is displayed when user has finished dragging(selecting) appointment start and end values. &ndash;&gt;-->
        <!--&lt;!&ndash; You can use the popup_scope variable to access various fields, such as: appointment_data (similar to appointment_props) and close. &ndash;&gt;-->
        <!--&lt;!&ndash; There is a listener attached to the close field. Whenever it gets a false value, the popup closes. &ndash;&gt;-->
        <!--&lt;!&ndash; You can add as many fields as you want. When saving them, make sure to insert them in the data field of the payload for appointments array. In that way you can access them even in the *details-card* slot.&ndash;&gt;-->
        <!--<h4 style="margin-bottom: 10px">New Appointment</h4>-->
        <!--<input v-model="new_appointment['title']" type="text" name="title" placeholder="Title">-->
        <!--<textarea v-model="new_appointment['description']" type="text" name="description" placeholder="Description" rows="2"></textarea>-->
        <!--<div class="buttons">-->
          <!--<button class="cancel" @click="popup_scope.close_popup = true">Cancel</button>-->
          <!--<button @click="completeAppointment(popup_scope, new_appointment)">Save</button>-->
        <!--</div>-->
      <!--</div>-->
    <!--</kalendar>-->
  </div>
</template>


<script>
  import moment from 'moment';
  import { Calendar } from 'dayspan';
  import pl from '@/locale/calendar/pl';

  export default {
    name: 'calendar',
    created(){
      this.$dayspan.addLocale('pl', pl);
      this.$dayspan.setLocale(this.$i18n.locale, true);
      this.$watch('$i18n.locale', newLocale => this.$dayspan.setLocale(newLocale, true))
    },
    data(){
      return{
        calendar: Calendar.months(),
        new_appointment: {},
        appointments: [
          {
            data: {
              title: 'Trening',
              description: 'opis do trenignu'
            },
            from : moment('2018-10-12T10:00:00').toDate(),
            to:  moment('2018-10-12T12:00:00').toDate(),
            date: '2018-10-12'
          }
        ],
        calendar_settings: {
          style: 'material_design', // ['flat_design', 'material_design']
          view_type: 'Month', // ['Month', 'Day']
          split_value: 20, // Value % 60 === 0
          cell_height: 10, // !isNaN(Value)
          scrollToNow: true, // Boolean
          current_day: new Date(), // Valid date
        },
      }
    },
    methods: {
      completeAppointment(popup_data, form_data) {
        let payload = {
          data: {
            title: form_data.title,
            description: form_data.description,
          },
          from: popup_data.appointment_props.start_value.value,
          to: popup_data.appointment_props.end_value.value,
          date: moment(popup_data.appointment_props.start_value.value).format('YYYY-MM-DD'),
        };
        this.appointments.push(payload);
        this.new_appointment = {
          title: null,
          description: null,
        };
        popup_data.close_popup = true;
      }
    }
  }
</script>


<style lang="scss">
  .demko-calendar{
    width: 100%;
    height: 100%;

    & .ds-week-header-day, & .ds-week-header-today{
      font-weight: bold !important;
      border-bottom: 1px solid $brand-primary;
    }

    & .ds-week-header-today{
      color: $brand-primary;
    }

    & .ds-day .ds-dom.ds-today-dom{
      background-color: $brand-primary;
    }
  }
</style>
