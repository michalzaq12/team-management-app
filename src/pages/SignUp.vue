<template>
  <startup-layout>
    <v-loading :active="isLoading"/>
    <v-form v-model="valid" @keyup.enter.native="signup">

      <v-text-field color="demko" v-model="form.first_name"  label="Name"
                    :counter="30" prepend-icon="account_box" required />

      <v-text-field color="demko" v-model="form.last_name" label="Surname"
                    :counter="30" prepend-icon="account_box" required />



      <v-text-field color="demko" v-model="form.email" :rules="emailRules" label="E-mail" required />

      <v-text-field color="demko" ref="password" v-model="form.password"
                    :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    :rules="passwordRules" label="Password" required />

      <v-text-field color="demko" type="password" @input="validateRepeatedPassword"
                    :append-icon="showRepeatedPassword ? 'visibility_off' : 'visibility'"
                    :type="showRepeatedPassword ? 'text' : 'password'"
                    @click:append="showRepeatedPassword = !showRepeatedPassword"
                    :error-messages="passwordRepeatHint" :error="passwordRepeatError" label="Repeat password" required />
    </v-form>

    <div class="text-xs-center">
      <v-btn round color="demko" class="font-weight-bold white--text register-button" outline @click="signup">Zarejestruj się</v-btn>
    </div>
  </startup-layout>
</template>

<script>
  import StartupLayout from './StartupLayout';
  export default {
    name: 'sign-up',
    components: {StartupLayout},
    data: () => ({
      isLoading: false,
      valid: false,
      form: {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      },
      showPassword: false,
      showRepeatedPassword: false,
      passwordRepeatError: false,
      passwordRepeatHint: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required'
      ]
    }),
    methods: {
      signup(){
        if(!this.valid) return;
        this.isLoading = true;
        this.$http.post('/users', this.form)
          .then(() => {
            this.$router.push({name: 'login'});
            this.$eventBus.$emit('info', 'Confirmation mail was send to ' + this.form.email)
          })
          .finally(() => this.isLoading = false);
      },
      validateRepeatedPassword(v){
        if(v !== this.form.password) {
          this.passwordRepeatHint = 'Passwords don`t match';
          this.passwordRepeatError = true;
        } else {
          this.passwordRepeatError = false;
          this.passwordRepeatHint = '';
        }
      }
    }
  }
</script>



<style lang="scss" scoped>
  .register-button {
    margin: 15px 0 0 0;
    width: 100%;
  }
</style>
