<template>
    <v-container fill-height>
      <v-loading :active="isLoading" />
      <v-layout justify-center align-center>

        <v-flex xs12 sm8 md8 style="max-width: 600px">
          <v-card>
            <v-toolbar dark color="teal">
              <v-toolbar-side-icon @click="editMode = false">
                <v-icon v-if="!editMode">info</v-icon>
                <v-icon v-else>keyboard_arrow_left</v-icon>
              </v-toolbar-side-icon>
              <v-toolbar-title>Your profile</v-toolbar-title>
            </v-toolbar>

            <v-flex class="pa-4">
              <v-thumbnail :user="user" :size="80" :avatar="true"/>
              <a class="v-btn v-btn--icon theme--light activator" v-if="editMode">
                <thumbnail-upload-button ref="upload" :raw="true" @file-selected="updateThumbnail">
                  <v-icon>create</v-icon>
                </thumbnail-upload-button>
              </a>
              <v-btn icon @click="deleteThumbnail" v-if="editMode">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-flex>

            <v-divider></v-divider>

            <v-card-text class="py-3" v-if="editMode">

              <v-form>
                <v-text-field color="demko" type="text" v-model="user.first_name" label="First Name" required />
                <v-text-field color="demko" type="text" v-model="user.last_name" label="Last Email" required />

                <v-dialog
                  persistent
                  v-model="modal"
                  lazy
                  full-width
                  width="290px"
                >
                  <v-text-field
                    color="demko"
                    slot="activator"
                    label="Date of birth"
                    v-model="user.born_date"
                    readonly
                  ></v-text-field>
                  <v-date-picker actions color="teal"
                                 @input="user.born_date = parseDate($event)"
                                 ref="pickerInDialog" :max="maxDate" :min="minDate" :locale="$i18n.locale">
                    <template>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat @click.stop="user.born_date = null; modal = false">Cancel</v-btn>
                        <v-btn flat color="demko" @click.stop="modal = false">OK</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-dialog>

              </v-form>
              <v-btn block color="teal" class="white--text" @click="updateUserInfo">Save</v-btn>


              <v-form class="mt-3">
                <v-text-field color="demko" type="password" v-model="password" label="Password" required />
                <v-text-field color="demko" type="password" v-model="repeatedPassword" label="Repeat password" required
                              @input="validateRepeatedPassword"
                              :error-messages="passwordRepeatHint" :error="passwordRepeatError"/>
              </v-form>
              <v-btn block color="teal" class="white--text" @click="updatePassword">Change password</v-btn>


            </v-card-text>


            <v-card-text class="pt-5 pb-5" v-else>
              <div class="pa-1"><span class="title font-weight-bold">Email: </span> <span class="title">{{user.email}}</span></div>
              <div class="pa-1"><span class="title font-weight-bold">First name: </span> <span class="title">{{user.first_name}}</span></div>
              <div class="pa-1"><span class="title font-weight-bold ">Last name: </span> <span class="title">{{user.last_name}}</span></div>
              <div class="pa-1"><span class="title font-weight-bold ">Born date: </span> <span class="title">{{user.born_date}}</span></div>



            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions v-if="!editMode">
              <v-btn flat color="red" @click="" >Remove</v-btn>
              <v-spacer></v-spacer>
              <v-btn flat @click="editMode = true" >Edit</v-btn>
            </v-card-actions>
          </v-card>

        </v-flex>
      </v-layout>

    </v-container>




</template>

<script>
    import moment from 'moment';
    import ThumbnailUploadButton from './team/ThumbUpload';
    import {mapGetters}  from 'vuex';
    export default {
        name: "profile",
        components: {ThumbnailUploadButton},
        data(){
          return {
            editMode: false,
            isLoading: false,
            user: {
              first_name: '',
              last_name: '',
              born_date: null
            },
            password: '',
            repeatedPassword: '',
            passwordRepeatError: false,
            passwordRepeatHint: '',
            minDate: moment().subtract(100, 'years').format('YYYY-MM-DD'),
            maxDate: moment().format('YYYY-MM-DD'),
            modal: false
          }
        },
        watch: {
          modal (value) {
            value && this.$nextTick(() => this.$refs.pickerInDialog.activePicker = 'YEAR')
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
          updateUserInfo(){
            this.isLoading = true;
            this.$http.put('/users/' + this.userId, this.user)
              .then(() => {
                this.editMode = false;
                this.fetchUserInfo();
              })
              .finally(() => this.isLoading = false)
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
          validateRepeatedPassword(v){
            if(v !== this.password) {
              this.passwordRepeatHint = 'Passwords don`t match';
              this.passwordRepeatError = true;
            } else {
              this.passwordRepeatError = false;
              this.passwordRepeatHint = '';
            }
          },
          updatePassword(){
            this.isLoading = true;
            this.$http.put(`/users/${this.userId}/password`, {password: this.password})
              .then(() => {
                this.editMode = false;
                this.$eventBus.$emit('info', 'Zaktualizowano hasło')
              })
              .finally(() => this.isLoading = false)
          },
          parseDate(date){
            return moment(date).format('YYYY-MM-DD');
          }
        },
        created(){
          this.fetchUserInfo();
        }
    }
</script>

<style scoped>

</style>
