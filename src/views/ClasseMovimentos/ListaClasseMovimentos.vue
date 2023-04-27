<style>
</style>

<template>
  <div>
    <div class="container">

      <h1>Classes Movimentos</h1>

      <section class="flex-lateral-button">
        <h2>Lista de Classes Movimentos</h2>
        <button class="btn btn-sm" type="button" @click="toggleModalCriarClasse()">Novo +</button>
      </section>

      <section>

        <div v-for="classe in classeMovimentos" :key="classe.id">
          <button class='diaBox' type="button" @click="toggleShowHoras(classe)">{{ classe.nome }}</button>
        </div>
      </section>
    </div>

    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>

    <ModalCriarClasseMovimento
      v-model:exibirModal="exibirModalCriarClasseMovimento"
      @reloadListaClasseMovimentos="buscaClasseMovimentos()">
    </ModalCriarClasseMovimento>

  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import ModalCriarClasseMovimento from '@/views/ClasseMovimentos/ModalCriarClasseMovimento.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  name: 'ListaClasseMovimentos',
  components: {
    Loader,
    ModalCriarClasseMovimento,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      showNotify: false,
      notifyMessage: '',
      dataCompleta: '',
      classeMovimentos: [],
      exibirModalCriarClasseMovimento: false,
    }
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    toggleModalCriarClasse () {
      this.exibirModalCriarClasseMovimento = true;
    },
    buscaClasseMovimentos () {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/classemovimentos'// + '?orderBy=dataCompleta,desc',
      };

      Request.fetch(requestData)
      .then(([response, data]) => {
        this.classeMovimentos = data
        this.busy = false;
      })
      .catch((error) => {
        this.busy = false;
        this.notify('Ocorreu um erro.');
        console.error(error);
      });
    },
  },
  watch: {
  },
  created () {
    this.buscaClasseMovimentos();
  },
}
</script>
