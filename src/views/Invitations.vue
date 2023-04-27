<style>
</style>

<template>
  <div>
    <div class="container">

      <h1>Convites</h1>

      <section>
        <h2>Criar Convite</h2>
        <label for="newInvitationToken">newInvitationToken:</label>
        <input name="newInvitationToken" type="text" placeholder="nome" v-model="newInvitationToken">
        <button @click="criarConvite()">Criar newInvitationToken</button>
      </section>

      <section>
        <h2>Lista de Convites</h2>
        <div v-for="invitation in invitations" :key="invitation.id">
            {{ invitation.invitationToken }} - 
            {{ invitation.active }} - 
            {{ invitation.email }}
        </div>
      </section>
    </div>

    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'
import Notifier from '@/components/Notifier.vue';

export default {
  name: 'ListaConvites',
  components: {
    Loader,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      newInvitationToken: '',
      email: '',
      invitations: [],
      showNotify: false,
      notifyMessage: '',
    }
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    buscaConvites () {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/invitations',
      };

      Request.fetch(requestData)
      .then(([response, data]) => {
        this.invitations = data
        this.busy = false;
      })
      .catch((error) => {
        console.error(error);
        this.busy = false;
        this.notify('Ocorreu um erro.' + error);
      });
    },
    criarConvite() {
      this.busy = true;
      let body = {
        'newInvitationToken': this.newInvitationToken,
        'email': this.email
      };
      let requestData = {
        'url': config.serverUrl + '/invitations',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'post',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.notify('Convite criado!');
        this.busy = false;
        this.buscaConvites();
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.notify('Ocorreu um erro.' + error);
      });
    },
  },
  watch: {
  },
  created () {
    this.buscaConvites();
  },
  destroyed() {
  }
}
</script>
