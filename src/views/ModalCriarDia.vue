<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <h1>Criar novo dia</h1>
        <label for="dataCompleta">Data:</label>
        <input name="dataCompleta" type="date" placeholder="nome" v-model="dataCompleta">
        <button @click="fecharModal()">Fechar</button>
        <button @click="criarDia()">Criar dia</button>
      </div>
    </div>
    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>
  </div>
</template>

<script>
import deepCopy from '@/core/deepcopy.js';
import Loader from '@/components/Loader.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'
import Notifier from '@/components/Notifier.vue';

export default {
  components: {
    Loader,
    Notifier
  },
  data: function () {
    return {
      dataCompleta: {},
      busy: false,
      needReload: false,
      showNotify: false,
      notifyMessage: '',
    }
  },
  emits: ['reloadListaDias'],
  props: {
    exibirModal: Boolean,
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    resetFields(needReload = false){
        this.needReload = needReload;
        this.busy = false;
        this.dataCompleta = {};
    },
    fecharModal() {
      this.$emit('update:exibirModal', false)
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaDias', [])
      }
      this.resetFields();
    },
    criarDia() {
      this.busy = true;
      let body = {
        'dataCompleta': this.dataCompleta,
      };

      let requestData = {
        'url': config.serverUrl + '/dias',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.resetFields(true)
        this.notify('Dia criado!');
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.notify('Ocorreu um erro.' + error);
      });
    },
  },
  watch: {
    exibirModal(newProp, oldProp) {
      // this.exibirModalLocal = newProp;
    },
  }
}
</script>

