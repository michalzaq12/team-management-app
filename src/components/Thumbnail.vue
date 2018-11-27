<template>
  <v-avatar v-if="avatar" :size="size" class="elevation-2" :color="hasThumbnail ? '' : 'teal'">
    <img v-if="team && team.thumbnail" :src="apiUrl + team.thumbnail">
    <span v-else-if="team" class="white--text headline">{{team.name.charAt(0)}}</span>

    <img v-if="user && user.thumbnail" :src="apiUrl + user.thumbnail">
    <span v-else-if="user" class="white--text headline">{{user.first_name.charAt(0)}}</span>

  </v-avatar>

  <img v-else-if="team && team.thumbnail" :src="apiUrl + team.thumbnail" :height="size + 'px'" />
  <img v-else-if="user && user.thumbnail" :src="apiUrl + user.thumbnail" :height="size + 'px'" />
  <div v-else :style="style">
    <v-icon x-large>insert_photo</v-icon>
  </div>

</template>

<script>
    export default {
        name: "thumbnail",
        props: {
          size: {
            type: Number,
            default: 48
          },
          tile: {
            type: Boolean,
            default: false
          },
          avatar: {
            type: Boolean,
            default: false
          },
          user: {
            type: Object
          },
          team: {
            type: Object
          }
        },
        computed: {
          hasThumbnail(){
            return (this.team && this.team.thumbnail)
              ||(this.user && this.user.thumbnail)
          },
          style(){
            return {
              height: this.size + 'px'
            }
          }
        }
    }
</script>
