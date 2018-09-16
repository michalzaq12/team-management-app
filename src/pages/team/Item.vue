<template>
    <v-flex xs12 sm6 md4 lg3 xl2 style="z-index: 0">
        <v-card class="item" style="z-index: 0">
            <div class="pa-3">
                <img v-if="team.thumbnail" :src="apiUrl + team.thumbnail" height="100px" />
                <img v-else src="https://via.placeholder.com/80x100" height="100px" />
            </div>
            <v-card-title primary-title>
    
                <v-layout row wrap align-center class="card-content">
                    <v-flex xs12 class="text-xs-center">
                        <h3 class="mb-0 font-weight-bold" :style="teamNameStyle">{{team.name}}</h3>
                    </v-flex>
                    <v-flex xs12 class="text-xs-center">
                        <div>{{team.location.name}}</div>
                    </v-flex>
                </v-layout>
            </v-card-title>
    
            <v-card-actions>
                <v-flex align-content-center align-end>
                    <div class="text-xs-center">
                        <v-chip outline color="demko">
                            <span v-if="team.discipline === 'football'" class="icon-soccer-ball3"></span>
                            <span v-else-if="team.discipline === 'basketball'" class="icon-basketball6"></span>
                            <span v-else-if="team.discipline === 'volleyball'" class="icon-volleyball"></span>
                            <span v-else class="icon-baseball2"></span>

                            <span class="font-weight-bold">{{$t(`discipline.${team.discipline}`)}}</span>
                        </v-chip>
                    </div>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>


<script>
    export default {
        name: 'team',
        props: {
            team: Object
        },
        computed: {
            teamNameStyle() {
                const nameLength = this.team.name.length;
                let fontSize = 24;
                if (nameLength > 15 && nameLength < 24) fontSize = 20;
                else if (nameLength >= 24) fontSize = 16;
                return {
                    'font-size': fontSize + 'px',
                    'line-height': fontSize + 'px'
                }
            }
        }
    }
</script>


<style lang="scss" scoped>
    .item {
        margin: 10px;
        min-width: 200px;
        //width: 20%;
        &:hover {
            opacity: 0.8;
        }
        & .card-content {
            min-height: 80px;
        }
    }
    
    [class^="icon-"],
    [class*=" icon-"] {
        font-size: 1.8rem;
        margin-right: 5px;
    }
</style>