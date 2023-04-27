<template>
  <div id="app">

    <nav class="shadow-1">
      <router-link v-if="!loggedIn" class="menulink" to="/">Entrar</router-link>
      <router-link v-if="!loggedIn" class="menulink" to="/register">Registrar</router-link>
      <router-link v-if="loggedIn" class="menulink" to="/relatorios">Relatorios</router-link>
      <router-link v-if="loggedIn" class="menulink" to="/invitations">Convites</router-link>
      <router-link v-if="loggedIn" class="menulink" to="/listaContas">Contas</router-link>
      <router-link v-if="loggedIn" class="menulink" to="/listaClasseMovimentos">Classes de Movimentos</router-link>
      <router-link v-if="loggedIn" class="menulink" to="/listaTipoMovimentos">Tipos de Movimentos</router-link>
      <a class="menulink" v-if="loggedIn" @click="logout()">Sair</a>
      <a class="menulink" v-if="loggedIn" @click="exportData()">Export Data</a>
      <a class="menulink" v-if="loggedIn" @click="openImportDataModal()">Import Data</a>
    </nav>

    <router-view
      @redirectAfterLogin="redirectAfterLogin()"
    />

    <ImportData v-model:exibirModalImport="exibirModalImport" />
    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>
  </div>
</template>

<style>
@import url('@/assets/main.css');
</style>

<script>
import Loader from '@/components/Loader.vue';
import ImportData from "@/views/ImportData.vue";
import Request from '@/core/request.js';
import config from '@/core/config.js'
import Notifier from '@/components/Notifier.vue';
import AuthManager from '@/core/AuthManager.js';

export default {
  name: "App",
  components: {
    ImportData,
    Loader,
    Notifier,
    AuthManager
  },
  data: function () {
    return {
      busy: false,
      exibirModalImport: false,
      showNotify: false,
      notifyMessage: '',
      loggedIn: false,
    }
  },
  created() {
    this.defineLoggedIn();
  },
  methods: {
    defineLoggedIn(){
      this.loggedIn = AuthManager.isLoggedIn();
    },
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    redirectAfterLogin(){
      this.defineLoggedIn();
      this.$router.push({ path: '/listaContas' })
    },
    openImportDataModal() {
      this.exibirModalImport = true;
    },
    logout() {
      AuthManager.eraseTokens();
      this.defineLoggedIn();
      this.$router.push({ path: '/' })
    },
    exportData() {
      this.busy = true;

      let requestData = {
        'url': config.serverUrl + "/backup/export",
        'headers': new Headers({'Content-Type': 'application/json'}),
      };

      Request.fetch(requestData).then(([response, data]) => {
        console.log('[LOG]',response);
        console.log('[LOG]',data);
        
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        let date = new Date();
        date = date.toISOString().substr(0, 19);
        date = date.replaceAll( ':','.');
        console.log('date',date);
        link.download = date + '.phpdailyfinance.export.json'
        link.click()
        URL.revokeObjectURL(link.href)
        this.busy = false;
      }).catch((error) => {
        this.busy = false;
        console.error(error);
        this.notify(error);
      });

    },
  }
};
</script>
