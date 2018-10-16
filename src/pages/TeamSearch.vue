<template>
    <div class="team-list">



        <v-container grid-list-xl fluid>
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
          :max="100"
          thumb-label="always"
                    ></v-slider>
                </v-flex>
            </v-layout>
        </v-container>

        <v-container grid-list-xs text-xs-center>
            <v-layout row wrap fill-height>
                <team v-for="team in teams" :key="team.id" :team="team" />
            </v-layout>
        </v-container>


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
                terms:{
                    name: '',
                    lat: null,
                    lng: null,
                    radius: null,
                    order_by: null,
                },
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
            }
        },
        methods: {
           fetchTeams(){
               //this.$eventBus.$emit('loading', true);
               this.$http.get('/teams', {params: this.params}).then(({data}) => {
                    this.teams = data.data;
                    this.pageCount = data.pagination.page_count;
                    //this.$eventBus.$emit('loading', false);
                }).finally(() => this.$eventBus.$emit('loading', false))
           },
           getAddressData(addressData, placeResultData) {
                this.terms.lat = addressData ? addressData.latitude : null,
                this.terms.lng = addressData ? addressData.longitude : null
            },
        },
        created() {
            this.fetchTeams();
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
