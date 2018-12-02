<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    lazy
  >
    <v-loading :active="isLoading" :isFullPage="true"/>

    <v-card v-if="notification">


      <v-toolbar dark color="primary" class="mb-2">
        <v-toolbar-title>Zaproszenie na mecz od {{notification.data.sender.name}}</v-toolbar-title>
      </v-toolbar>


      <v-card-text>

        <div class="text-xs-center">
          <div class="title">{{getDate(notification.data.invitation.date)}}</div>
          <br><div class="title mb-1">({{getDayName(notification.data.invitation.date)}})</div>
          <br><div>{{getTime(notification.data.invitation.date)}}</div>

        </div>




        <v-layout justify-space-between align-center class="ma-2 mt-0 mb-4">

          <div style="min-width: 100px">
            <v-layout align-center justify-center column fill-height>
              <v-thumbnail :user="notification.data.sender"/>
              <div class="mt-2">{{notification.data.sender.name}}</div>
            </v-layout>
          </div>

          <div>
            <span class="headline font-weight-thin font-italic">VS</span>
          </div>

          <div style="min-width: 100px">
            <v-layout align-center justify-center column fill-height>
              <v-thumbnail :team="notification.data.invitation.invited_team" />
              <div class="mt-2">{{notification.data.invitation.invited_team.name}}</div>
            </v-layout>
          </div>

        </v-layout>


        <gmap-map :center="notification.data.invitation.location"
                  :zoom="8"
                  :options="{}"
                  style="width:100%;  height: 250px;"
        >
          <gmap-marker :position="notification.data.invitation.location"/>
        </gmap-map>


      </v-card-text>

      <v-card-actions class="mt-3">
        <v-spacer></v-spacer>

        <v-btn flat="flat" @click="answer('rejected')">Odrzuć</v-btn>

        <v-btn color="primary" @click="answer('approved')">Akceptuj</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "match-invitation",
        data(){
          return {
            isLoading: false,
            dialog: false,
            notification: null
          }
        },
        methods: {
          open(notification){
            this.notification = notification;
            this.dialog = true;
          },
          getDate(date){
            return moment(date).format('DD-MM-YYYY');
          },
          getDayName(date){
            return moment(date).locale(this.$i18n.locale).format('dddd');
          },
          getTime(date){
            return moment(date).format('HH:mm');
          },
          answer(status = 'approved'){
            this.isLoading = true;
            this.$http.put(`/match-invitations/${this.notification.data.invitation.id}/status`, {
              status
            }).then(() => this.dialog = false)
              .finally(() => this.isLoading = false);
          }
        }
    }
</script>

