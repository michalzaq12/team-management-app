<template>
    <v-container fill-height>
      <v-loading :active="isLoading" />
      <v-layout justify-center align-center>

        <v-flex xs12 sm8 md8 style="max-width: 600px">
          <v-card >

            <!--<v-card-title color="teal">-->

            <!--</v-card-title>-->

            <v-toolbar dark color="teal">
              <v-toolbar-side-icon>
                <v-icon>info</v-icon>
              </v-toolbar-side-icon>
              <v-toolbar-title>Your profile</v-toolbar-title>
            </v-toolbar>

            <v-flex class="pa-4">
              <v-avatar size="80" class="mr-4" >
                <img class="elevation-2 " :src="'/'+user.thumbnail">
              </v-avatar>

              <a class="v-btn v-btn--icon theme--light activator" v-if="editMode">
                <thumbnail-upload-button ref="upload" :raw="true" @file-selected="updateThumbnail">
                  <v-icon>create</v-icon>
                </thumbnail-upload-button>
              </a>
              <v-btn icon @click="deleteThumbnail" v-if="editMode">
                <v-icon>clear</v-icon>
              </v-btn>



            </v-flex>

            <v-spacer></v-spacer>
            <v-divider></v-divider>
            <v-spacer></v-spacer>

            <v-card-text class="pt-5 pb-5" v-if="editMode">
              <v-form>
                <v-text-field
                  prepend-icon="person"
                  required
                  v-model="user.first_name"
                  name="fullname"
                  label="Full Name"
                  type="text">
                </v-text-field>
                <v-text-field
                  v-if="user"
                  prepend-icon="email"
                  required
                  v-model="user.last_name"
                  name="email"
                  label="Email"
                  type="text">
                </v-text-field>
              </v-form>
              <v-btn block outline class="pa-1" @click="changePasswordDialog = true">Change password</v-btn>
            </v-card-text>


            <v-card-text class="pt-5 pb-5" v-else>
              <div class="pa-1"><span class="title font-weight-bold">First name: </span> <span class="title">{{user.first_name}}</span></div>
              <div class="pa-1"><span class="title font-weight-bold ">Last name: </span> <span class="title">{{user.last_name}}</span></div>
              <div class="pa-1"><span class="title font-weight-bold ">Born date: </span> <span class="title">{{user.born_date}}</span></div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>

              <v-btn flat @click.native="" color="red">Delete</v-btn>
              <v-spacer></v-spacer>
              <v-btn v-if="!editMode" flat @click.native="editMode = true" >Edit</v-btn>
              <v-btn v-else flat @click.native="" color="primary">Save</v-btn>
            </v-card-actions>
          </v-card>

        </v-flex>
      </v-layout>


      <v-dialog v-model="changePasswordDialog" width="500">

              <v-card >
                <v-toolbar dark color="teal">
                  <v-toolbar-title>Change password</v-toolbar-title>
                </v-toolbar>


                <v-card-text>
                  <v-form>
                    <v-text-field
                      prepend-icon="person"
                      required
                      v-model="user.first_name"
                      name="fullname"
                      label="Full Name"
                      type="text">
                    </v-text-field>
                    <v-text-field
                      v-if="user"
                      prepend-icon="email"
                      required
                      v-model="user.last_name"
                      name="email"
                      label="Email"
                      type="text">
                    </v-text-field>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat @click.native="" color="teal">Save</v-btn>
                </v-card-actions>

              </v-card>

      </v-dialog>

    </v-container>




</template>

<script>
    import ThumbnailUploadButton from './team/ThumbUpload';
    import {mapGetters}  from 'vuex';
    export default {
        name: "profile",
        components: {ThumbnailUploadButton},
        data(){
          return {
            changePasswordDialog: false,
            editMode: false,
            isLoading: false,
            user: {
              id: 1,
              first_name: 'Michal',
              last_name: 'Zarach'
            }
          }
        },
        computed: mapGetters('auth', ['userId']),
        methods: {
          fetchUserInfo(){
            this.isLoading = true;
            this.$http.get('/users/' + this.userId).then(({data}) => {
              this.user = data;
            }).finally(() => this.isLoading = false);
          },
          updateThumbnail(){
            this.isLoading = true;
            this.$refs.upload.send('/users/'+ this.userId +'/thumbnail').then(() => {
              this.fetchUserInfo();
            }).catch(() => this.isLoading = false);
          },
          deleteThumbnail(){
            this.$http.delete('/users/'+ this.userId +'/thumbnail').then(() => {
              this.fetchUserInfo();
            }).catch(() => this.isLoading = false);
          },
        },
        created(){
          this.fetchUserInfo();
        }
    }
</script>

<style scoped>

</style>
