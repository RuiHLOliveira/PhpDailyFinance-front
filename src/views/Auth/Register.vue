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
        <h1>Register</h1>

        <label for="invitationToken">Palavra Passe:</label>
        <input name="invitationToken" type="text" placeholder="invitationToken" v-model="invitationToken">

        <label for="email">Email:</label>
        <input name="email" type="email" placeholder="email" v-model="email">

        <label for="password">Senha:</label>
        <input name="password" type="password" placeholder="senha" v-model="password">

        <label for="repeatPassword">Repita a senha:</label>
        <input name="repeatPassword" type="password" placeholder="repeatPassword" v-model="repeatPassword">

        <button @click="register()">Criar conta</button>
      </section>
    </div>

    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import config from '@/core/config.js'
import Request from '@/core/request.js'
import Notifier from '@/components/Notifier.vue';

export default {
  name: 'ListaDias',
  components: {
    Loader,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      email: '',
      password: '',
      invitationToken: '',
      repeatPassword: '',
      showNotify: false,
      notifyMessage: '',
    }
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    register () {
      this.busy = true;
      let url = config.serverUrl + '/auth/register';
      let body = {
        'email': this.email,
        'password': this.password,
        'invitationToken': this.invitationToken,
        'repeatPassword': this.repeatPassword
      };
      let data = {
        method: 'POST',
        body: JSON.stringify(body),
      };

      let requestData = {
        'url': url,
        method: 'POST',
        data: body,
        notAuthenticated: true
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        console.log('data',data);
        this.notify('Registrado! Faça o login.');
        this.busy = false;
      })
      .catch((error) => {
        console.error(error);
        this.busy = false;
        this.notify('Ocorreu um erro.' + error);
      });
      
      // fetch(url,data)
      // .then(async response => {
      //   data = await response.json();
      //   console.log('[LOG]',response);
      //   console.log('[LOG]',data);
      //   this.dias = data
      //   this.busy = false;
      //   // notify.notify('carregado!', "success");
      // }).catch(error => {
      //   console.log('[LOG]',error);
      //   this.busy = false;
      // });
    },
  },
  watch: {
  },
  created () {
  },
  destroyed() {
  }
}
</script>
