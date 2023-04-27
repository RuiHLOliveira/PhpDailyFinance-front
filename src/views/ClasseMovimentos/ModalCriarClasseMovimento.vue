<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <h1>Criar nova classe Movimento</h1>

        <label for="nome">Nome:</label>
        <input name="nome" type="text" placeholder="nome" v-model="nome">

        <button @click="fecharModal()">Fechar</button>
        <button @click="criarClasseMovimento()">Criar Classe Movimento</button>
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
      nome: null,
      busy: false,
      needReload: false,
      showNotify: false,
      notifyMessage: '',
    }
  },
  emits: ['reloadListaClasseMovimentos'],
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
        this.nome = null;
    },
    fecharModal() {
      this.$emit('update:exibirModal', false)
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaClasseMovimentos', [])
      }
      this.resetFields();
    },
    criarClasseMovimento() {
      this.busy = true;
      let body = {
        'nome': this.nome
      };

      let requestData = {
        'url': config.serverUrl + '/classemovimentos',
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.resetFields(true)
        this.notify('Classe Movimento criada!');
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

