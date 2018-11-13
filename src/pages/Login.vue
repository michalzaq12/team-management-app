<template>
  <startup-layout>
    <v-loading :active="isLoading"/>
    <v-form v-model="valid" @keyup.enter.native="login">

      <v-text-field color="demko" v-model="email" :rules="emailRules" label="E-mail" required />

      <v-text-field color="demko" type="password" v-model="password"
                    :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    :rules="passwordRules" label="Password" required />

    </v-form>

    <div class="text-xs-center">
      <v-btn round color="demko" class="font-weight-bold login-button" outline @click="login">Zaloguj się</v-btn>
    </div>

    <div class="text-xs-center">
      <v-btn round color="demko" class="font-weight-bold white--text register-button"
             @click="$router.push({name: 'sign-up'})">Zarejestruj się</v-btn>
    </div>
  </startup-layout>
</template>

<script>
  import StartupLayout from './StartupLayout';
  export default {
    name: 'login-page',
    components: {StartupLayout},
    data: () => ({
      isLoading: false,
      showPassword: false,
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required'
      ],
    }),
    methods: {
      login(){
        if(!this.valid) return;
        this.isLoading = true;
        this.$store.dispatch('auth/login', {email: this.email, password: this.password})
          .then(() => this.$router.push({name: 'home'}))
          .finally( () => this.isLoading = false);
      }
    }
  }
</script>



<style lang="scss" scoped>
  .login-button {
    margin: 15px 0;
    width: 100%;
  }

  .register-button {
    margin: 0;
    width: 100%;
  }
</style>
