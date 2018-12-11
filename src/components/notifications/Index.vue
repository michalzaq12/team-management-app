<template>
  <div>
    <v-list two-line style="min-width: 400px;">

      <v-subheader class="subheading">{{$t('notifications.notifications')}}</v-subheader>

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
                <span v-if="item.type === 'team_join_request'">
                  <v-icon :color="item.data.team_membership.confirmed ? 'grey lighten-1' : 'yellow darken-2'">star</v-icon>
                  {{$t('notifications.wantsToJoin')}}
                </span>
                <span v-else-if="item.type === 'team_membership_approval'">
                  <v-icon color="grey lighten-1">verified_user</v-icon>
                  {{$t('notifications.joined')}}
                </span>
                <span v-else-if="item.type === 'match_invitation'">
                  <v-icon :color="item.data.invitation.status === 'waiting' ? 'yellow darken-2' : 'grey lighten-1'">star</v-icon>
                  {{$t('notifications.wantsToPlay')}}
                </span>
                <span v-else-if="item.type === 'match_invitation_approval'">
                  <v-icon color="grey lighten-1">thumb_up</v-icon>
                  {{$t('notifications.acceptedInvitation')}}
                </span>
                <span v-else-if="item.type === 'match_invitation_rejection'">
                  <v-icon color="grey lighten-1">thumb_down</v-icon>
                  {{$t('notifications.rejectedInvitation')}}
                </span>
            </v-list-tile-sub-title>

          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text>{{item.create_date | date}}</v-list-tile-action-text>

            <v-btn icon @click.stop="removeNotification(item)">
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
  import {mapGetters}  from 'vuex';
  import moment from 'moment';
  import MembershipConfirmation from './MembershipConfirmation.modal';
  import MatchInvitation from './MatchInvitation.modal';
  export default {
    name: "notifications-list",
    components: {MembershipConfirmation, MatchInvitation},
    data(){
      return {
        notifications: []
      }
    },
    filters: {
      date(date){
        date = moment(date).toDate();
        const days = moment().diff(date, 'days');
        const hours = moment().diff(date, 'hours');
        const minutes = moment().diff(date, 'minutes');

        if(days > 0) return days + 'd ';
        if(hours > 0) return hours + 'h ';
        else if(minutes > 0) return minutes + 'm ';
        else return 'teraz';
      },
    },
    computed: mapGetters('auth', ['userId']),
    methods: {
      fetchNotifications(){
        this.$http.get(`/users/${this.userId}/notifications`).then(({data}) => {
          this.notifications = [];
          this.notifications = data;
          this.$emit('notifications-count', this.notifications.length);
        })
      },
      onClick(notification){
        if(notification.type === 'team_join_request') this.$refs.membershipConfirmation.open(notification);
        else if (notification.type === 'match_invitation') this.$refs.matchInvitation.open(notification);
      },
      removeNotification(notification){
        this.$http.delete('/notifications/' + notification.id);
        this.notifications.splice(this.notifications.indexOf(notification), 1);
      }
    },
    created(){
      this.fetchNotifications();
      this.notificationInterval = window.setInterval(this.fetchNotifications, 10000);
    },
    beforeDestroy(){
      window.clearInterval(this.notificationInterval);
    },
  }
</script>

