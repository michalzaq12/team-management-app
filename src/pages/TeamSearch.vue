<template>
    <div class="team-list">

        <v-loading :active="isLoadingFull" :is-full-page="true"/>

        <v-container grid-list-xl fluid class="pt-0 pb-0">
            <v-layout wrap>
                <v-flex xs12 sm4>
                    <v-text-field color="demko" label="Nazwa drużyny" v-model="terms.name" prepend-icon="search"></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                    <vuetify-google-autocomplete id="map" ref="autocomplete" color="demko" prepend-icon="location_on" clearable required label="Nazwa miejscowości" types="(cities)" country="PL" @placechanged="getAddressData" />
                </v-flex>
                <v-flex>
                    <v-slider v-model="terms.radius"
                              single-line
                              type="number"
                              color="demko"
                              :step="10"
                              :min="0"
                              :max="1000"
                              thumb-label="always"
                              :disabled="isLoading"
                              label="Odległość [KM]"
                              hint="Promień "
                              persistent-hint
                    ></v-slider>
                </v-flex>
            </v-layout>
        </v-container>

        <v-container grid-list-xs text-xs-center>
            <v-layout row wrap fill-height>
              <v-loading :is-full-page="false" :active="isLoading" />
                <team v-for="team in teams" :key="team.id" :team="team" :allowJoin="true" @join="joinToTeam"/>
            </v-layout>
        </v-container>

      <div class="text-xs-center mb-3" v-if="!isLoading">
        <v-pagination v-model="currentPage" color="demko" :length="pageCount" circle></v-pagination>
      </div>

    </div>
</template>


<script>
    import Team from './team/Item';
    export default {
        name: 'search-team',
        components: {
            Team
        },
        data() {
            return {
                isLoading: false,
                terms:{
                    name: '',
                    lat: null,
                    lng: null,
                    radius: null,
                    order_by: null,
                },
                currentPage: 1,
                pageCount: 1,
               teams: []
            }
        },
        computed: {
            params(){
                const params = Object.assign({}, this.terms);
                if(params.name === '') delete params.name;
                else params.name+='%';
                return params;
            }
        },
        watch: {
            terms: {
                handler(){
                    this.fetchTeams();
                },
                deep: true
            },
            currentPage(){
              this.fetchTeams();
            }
        },
        methods: {
           fetchTeams(){
               this.isLoadingFull = false;
               this.isLoading = true;
               this.$http.get('/teams', {params: {...this.params, page: this.currentPage, per_page: 8}}).then(({data}) => {
                    this.teams = data.data;
                    this.pageCount = data.pagination.page_count;
                }).finally(() => this.isLoading = false)
           },
           getAddressData(addressData, placeResultData) {
                this.terms.lat = addressData ? addressData.latitude : null;
                this.terms.lng = addressData ? addressData.longitude : null;
            },
            joinToTeam(id){
              this.isLoadingFull = true;
              this.$http.post('/team-memberships', {team_id: id}).then(() => {
                this.$eventBus.$emit('info', 'Wysłano prośbę o dołączenie')
              }).finally(() => this.isLoadingFull = false);
            }
        },
        created() {
            this.fetchTeams();
        },
        destroyed() {
          // https://github.com/MadimetjaShika/vuetify-google-autocomplete/issues/56
          window.vgaMapState.initMap = true
        },
    }
</script>


<style lang="scss" scoped>
    .team-list {
        width: 100%;
    }

    .toolbar-wrapper {
        display: flex;
        //justify-content: center;
        margin-bottom: 10px;
        &>.toolbar {
            width: 30%;
        }
    }

    .wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
