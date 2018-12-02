<template>
  <v-dialog
    v-model="dialog"
    max-width="400"
    lazy
  >
    <v-loading :active="isLoading" :isFullPage="true"/>

    <v-card v-if="notification">


      <v-toolbar dark color="primary">
        <v-toolbar-title>Czy chcesz aby {{notification.data.sender.last_name}} dołączył do drużyny?</v-toolbar-title>
      </v-toolbar>


      <v-card-text>
        <v-layout justify-space-between align-center class="ma-2 mt-4 mb-4">

          <div style="min-width: 100px">
            <v-layout align-center justify-center column fill-height>
              <v-thumbnail :user="notification.data.sender" :avatar="true"/>
              <div class="mt-2">{{notification.data.sender.first_name}} {{notification.data.sender.last_name}}</div>
            </v-layout>
          </div>

          <div>
            <v-icon x-large>forward</v-icon>
          </div>

          <div style="min-width: 100px">
            <v-layout align-center justify-center column fill-height>
              <v-thumbnail :team="notification.data.team" />
              <div class="mt-2">{{notification.data.team.name}}</div>
            </v-layout>
          </div>

        </v-layout>


      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn flat="flat" @click="dialog = false">Nie</v-btn>

        <v-btn color="primary" @click="sendConfirmation">Tak</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    export default {
        name: "membership-confirmation",
        data(){
          return {
            isLoading: false,
            dialog: false,
            notification: null,
          }
        },
        methods: {
          open(notification){
            this.notification = notification;
            this.dialog = true;
          },
          sendConfirmation(){
            this.isLoading = true;
            this.$http.post(`/team-memberships/${this.notification.data.team_membership.id}/confirm`).then(() => {
              this.dialog = false;
            }).finally(() => this.isLoading = false);
          }
        }
    }
</script>
