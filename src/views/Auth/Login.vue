<style>
/* section {
  max-width: 700px;
  margin: 0 auto;
} */
</style>

<template>
  <div>
    <div class="container">

      <section>
        <h1>Login</h1>
        <label for="email">Email:</label>
        <input name="email" type="email" placeholder="email" v-model="email">

        <label for="password">Senha:</label>
        <input name="password" type="password" placeholder="senha" v-model="password">

        <button @click="login()">Entrar</button>
      </section>
    </div>

    <Loader :busy="busy"></Loader>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import AuthManager from '@/core/AuthManager.js';
import config from '@/core/config.js'

export default {
  name: 'ListaDias',
  components: {
    Loader,
  },
  data: () => {
    return {
      busy: false,
      email: '',
      password: '',
    }
  },
  emits: ['redirectAfterLogin'],
  methods: {
    login () {
      this.busy = true;
      let url = config.serverUrl + '/auth/login';
      let body = {
        'email': this.email,
        'password': this.password
      };
      let data = {
        method: 'POST',
        body: JSON.stringify(body)
      };
      fetch(url,data)
      .then(async response => {
        if(!response.ok){
          throw 'Error in loggin in';
        }
        data = await response.json();
        console.log('[LOG]',response);
        console.log('[LOG]',data);
        this.dias = data
        this.busy = false;
        AuthManager.storeToken(data.token);
        AuthManager.storeRefreshToken(data.refreshToken);
        this.$emit('redirectAfterLogin', [])
        // notify.notify('carregado!', "success");
      }).catch(error => {
        console.log('[LOG]',error);
        this.busy = false;
      });
    },
  },
  watch: {
  },
  mounted () {
    // if(AuthManager.isLoggedIn()) {
    //   this.$emit('redirectAfterLogin', [])
    // }
  },
  destroyed() {
  }
}
</script>
