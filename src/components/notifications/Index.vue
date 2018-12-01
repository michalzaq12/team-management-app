<template>
  <div>
    <v-list two-line style="min-width: 400px;">

      <v-subheader class="subheading">Powiadomienia</v-subheader>

      <template v-for="(item, index) in notifications">

        <v-list-tile
          :key="item.id"
          avatar
          ripple
          @click="onClick(item)"
        >
          <v-list-tile-avatar v-if="item.data.sender.thumbnail">
            <img :src="apiUrl + item.data.sender.thumbnail">
          </v-list-tile-avatar>

          <v-list-tile-avatar v-else color="secondary">
            <span class="white--text headline">
              <span v-if="item.sender_type === 'player'">{{item.data.sender.first_name.charAt(0)}}</span>
              <span v-else-if="item.sender_type === 'team'">{{item.data.sender.name.charAt(0)}}</span>
            </span>
          </v-list-tile-avatar>

          <v-list-tile-content>


            <v-list-tile-title class="font-weight-bold">
              <span v-if="item.sender_type === 'player'">{{item.data.sender.first_name}} {{item.data.sender.last_name}}</span>
              <span v-else>{{item.data.sender.name}}</span>
            </v-list-tile-title>


            <v-list-tile-sub-title class="text--primary">
                <span v-if="item.type === 'team_join_request'">Prośba o dołączenie do zespołu {{item.data.team.name}}</span>
                <span v-else-if="item.type === 'team_membership_approval'">Zaakceptowano Twoją prośbę</span>
                <span v-else-if="item.type === 'match_invitation'">Zaproszenie na mecz</span>
                <span v-else-if="item.type === 'match_invitation_rejection'">Odrzucenie zaproszenia</span>
            </v-list-tile-sub-title>


            <v-list-tile-sub-title class="subheading">
              <span v-if="item.type === 'team_join_request'"></span>
              <span v-else-if="item.type === 'team_membership_approval'">Od teraz należysz do zespołu {{item.data.sender.name}}</span>
            </v-list-tile-sub-title>

          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text>{{item.create_time | date}}</v-list-tile-action-text>

            <v-btn icon @click.stop="deleteNotification">
              <v-icon>clear</v-icon>
            </v-btn>
          </v-list-tile-action>



        </v-list-tile>


        <v-divider
          v-if="index !== (notifications.length - 1)"
          :inset="true"
        ></v-divider>


      </template>
    </v-list>


    <membership-confirmation ref="membershipConfirmation"/>
    <match-invitation ref="matchInvitation" />


  </div>
</template>

<script>
  import moment from 'moment';
  import MembershipConfirmation from './MembershipConfirmation.modal';
  import MatchInvitation from './MatchInvitation.modal';
  export default {
    name: "notifications-list",
    components: {MembershipConfirmation, MatchInvitation},
    props: {
      notifications: {
        type: Array,
        required: true
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
      onClick(notification){
        if(notification.type === 'team_join_request') this.$refs.membershipConfirmation.open(notification);
        else if (notification.type === 'match_invitation') this.$refs.matchInvitation.open(notification);
      }
    }
  }
</script>

