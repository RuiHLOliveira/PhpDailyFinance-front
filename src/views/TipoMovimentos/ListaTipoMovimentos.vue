<style>
</style>

<template>
  <div>
    <div class="container">

      <h1>Tipos Movimentos</h1>

      <section class="flex-lateral-button">
        <h2>Lista de Tipos Movimentos</h2>
        <button class="btn btn-sm" type="button" @click="toggleModalCriarTipo()">Novo +</button>
      </section>

      <section>
        <div v-for="tipo in tipoMovimentos" :key="tipo.id">
          <button class='diaBox' type="button" @click="toggleShowHoras(tipo)">{{ tipo.nome }}</button>
        </div>
      </section>
    </div>

    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>

    <ModalCriarTipoMovimento
      v-model:exibirModal="exibirModalCriarTipoMovimento"
      @reloadListaTipoMovimentos="buscaTipoMovimentos()">
    </ModalCriarTipoMovimento>

  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import ModalCriarTipoMovimento from '@/views/TipoMovimentos/ModalCriarTipoMovimento.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  name: 'ListaTipoMovimentos',
  components: {
    Loader,
    ModalCriarTipoMovimento,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      showNotify: false,
      notifyMessage: '',
      dataCompleta: '',
      tipoMovimentos: [],
      exibirModalCriarTipoMovimento: false,
    }
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    toggleModalCriarTipo () {
      this.exibirModalCriarTipoMovimento = true;
    },
    buscaTipoMovimentos () {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/tipomovimentos' + '?orderBy=nome,asc',
      };

      Request.fetch(requestData)
      .then(([response, data]) => {
        this.tipoMovimentos = data
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
    this.buscaTipoMovimentos();
  },
}
</script>
