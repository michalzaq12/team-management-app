<template>
  <div>
    <v-loading :active="isLoading" :isFullPage="true"/>
    <v-list two-line>

      <v-subheader>Powiadomienia</v-subheader>

      <template v-for="(item, index) in notifications">

        <v-list-tile
          :key="item.id"
          avatar
          @click="confirm(item)"
        >
          <v-list-tile-avatar v-if="item.data.sender.thumbnail">
            <img :src="item.data.sender.thumbnail">
          </v-list-tile-avatar>

          <v-list-tile-avatar v-else color="teal">
            <span class="white--text headline">
              <span v-if="item.sender_type === 'player'">{{item.data.sender.first_name.charAt(0)}}</span>
              <span v-else-if="item.sender_type === 'team'">{{item.data.sender.name.charAt(0)}}</span>
            </span>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>
              <span class="font-weight-bold">
                <span v-if="item.sender_type === 'player'">{{item.data.sender.first_name}} {{item.data.sender.last_name}}</span>
                <span v-else-if="item.sender_type === 'team'">{{item.data.sender.name}}</span>
              </span>
            </v-list-tile-title>
            <v-list-tile-sub-title>
                    <span>
                      <v-icon>mail</v-icon>
                      <span>{{item.create_time | date}}</span>
                      &mdash;
                    </span>
              <span class='text--primary'>
                <span v-if="item.type === 'team_join_request'">Prośba o dołączenie do zespołu {{item.data.team.name}}</span>
                <span v-else-if="item.type === 'team_membership_approval'">Zaakceptowano Twoją prośbę</span>
              </span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>


        <v-divider
          v-if="index !== (notifications.length - 1)"
          :inset="true"
        ></v-divider>


      </template>
    </v-list>


    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card v-if="selectedItem != null">
        <v-toolbar dark color="teal">
          <v-toolbar-title>Czy chcesz aby zawodnik {{selectedItem.data.sender.first_name}} dołączył do drużyny?</v-toolbar-title>
        </v-toolbar>

        <!--<v-card-title class="headline"></v-card-title>-->

        <v-card-text>
          <v-layout justify-space-between align-center class="ma-2 mt-4 mb-4">

            <div>
              <v-avatar v-if="selectedItem.data.sender.thumbnail"  class="elevation-2">
                <img :src="selectedItem.data.sender.thumbnail" >
              </v-avatar>

              <v-avatar v-else color="teal" class="elevation-2">
                <span class="white--text headline">{{selectedItem.data.sender.first_name.charAt(0)}}</span>
              </v-avatar>

              <span>{{selectedItem.data.sender.first_name}} {{selectedItem.data.sender.last_name}}</span>
            </div>

            <div>
              <v-icon x-large>forward</v-icon>
            </div>

            <div>
              <v-avatar v-if="selectedItem.data.team.thumbnail" class="elevation-2">
                <img :src="selectedItem.data.team.thumbnail">
              </v-avatar>

              <v-avatar v-else color="teal" class="elevation-2">
                <span class="white--text headline">{{selectedItem.data.team.name.charAt(0)}}</span>
              </v-avatar>

              <span>{{selectedItem.data.team.name}}</span>
            </div>

          </v-layout>


        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat="flat" @click="dialog = false">Nie</v-btn>

          <v-btn color="teal" @click="sendConfirmation" flat="flat">Tak</v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
  import moment from 'moment';
  import Loading from "./Loading";

    export default {
        name: "Notifications",
      components: {Loading},
      props: {
          notifications: {
            type: Array,
            required: true
          }
        },
        data(){
          return {
            isLoading: false,
            dialog: false,
            selectedItem: null
          }
        },
        filters: {
          date(date){
            date = moment.utc(date).toDate();
            const days = moment().diff(date, 'days');
            const hours = moment().diff(date, 'hours');
            const minutes = moment().diff(date, 'minutes');

            if(days > 0) return days + 'd ';
            if(hours > 0) return hours + 'h ';
            else return minutes + 'm ';
          },
        },
        methods: {
          confirm(selectedItem){
            this.dialog = true;
            this.selectedItem = selectedItem;
          },
          sendConfirmation(){
            this.isLoading = true;
            this.$http.post(`/team-memberships/${this.selectedItem.data.team_membership.id}/confirm`).then(() => {
              console.log('ok');
              this.dialog = false;
            }).finally(() => this.isLoading = false);
          }
        }
    }
</script>

<style scoped>

</style>
