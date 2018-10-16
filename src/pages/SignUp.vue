<template>
  <transition name="fade" appear>
  <div id="wrapper">
    <div id="login-form">
      <img id="logo" src="http://via.placeholder.com/150x150">

      <v-form v-model="valid" @keyup.enter.native="signup">

        <v-text-field color="demko" v-model="form.first_name"  label="Name" required></v-text-field>

        <v-text-field color="demko" v-model="form.last_name" label="Surname" required></v-text-field>

        <v-text-field color="demko" v-model="form.email" :rules="emailRules" label="E-mail" required></v-text-field>

        <v-text-field color="demko" ref="password" v-model="form.password"
                      :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                      :type="showPassword ? 'text' : 'password'"
                      @click:append="showPassword = !showPassword"
                      :rules="passwordRules" label="Password" required />

        <v-text-field color="demko" type="password" @input="validateRepeatedPassword"
                      :error-messages="passwordRepeatHint" :error="passwordRepeatError" label="Repeat password" required />
      </v-form>

      <div class="text-xs-center">
        <v-btn round color="demko" class="font-weight-bold white--text register-button" @click="signup">Zarejestruj się</v-btn>
      </div>

    </div>
  </div>
  </transition>
</template>

<script>
  export default {
    name: 'sign-up',
    data: () => ({
      valid: false,
      form: {
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      },
      showPassword: false,
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
        this.$eventBus.$emit('loading', true);
        this.$http.post('/users', this.form)
          .then(() => {
            this.$router.push({name: 'login'});
            this.$eventBus.$emit('info', 'Confirmation mail was send to ' + this.form.email)
          })
          .finally(() => this.$eventBus.$emit('loading', false));
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
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 1.5s
  }

  .slide-up-enter,
  .slide-up-leave-to
    /* .fade-leave-active in <2.1.8 */

  {
    opacity: 0;
    bottom: 20% !important;
  }


  #wrapper {
    height: 100vh;
    width: 100vw;
  }

  #login-form {
    width: 400px;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    text-align: center
  }

  #logo {
    width: 50%;
    margin-bottom: 30px;
  }

  .login-button {
    margin: 30px 0;
    width: 100%;
  }

  .register-button {
    margin: 0;
    width: 100%;
  }
</style>
