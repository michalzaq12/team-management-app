<template>
  <v-flex xs12 sm6 md4 lg4 xl2>
    <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`" class="ma-2">
        <v-card-text>
          <match-info :match="match" :locationName="true"/>
        </v-card-text>
      </v-card>
    </v-hover>
  </v-flex>
</template>

<script>
    import MatchInfo from './Info';
    export default {
        name: "match",
        components: {MatchInfo},
        props: {
          match: {
            type: Object,
            required: true
          }
        }
    }
</script>
