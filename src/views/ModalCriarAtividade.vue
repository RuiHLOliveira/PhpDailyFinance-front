<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <h1>Nova Atividade - {{dia.dataCompleta}} às {{hora.hora}} horas</h1>
        <label for="atividade">Atividade:</label>
        <input name="atividade" type="text" placeholder="atividade" v-model="atividade.descricao">
        <button @click="fecharModal()">Fechar</button>
        <button @click="criarAtividade()">Salvar</button>
      </div>
    </div>
    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>
  </div>
</template>

<script>
import deepCopy from '@/core/deepcopy.js';
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  components: {
    Loader,
    Notifier
  },
  data: function () {
    return {
      // exibirModalLocal: false,
      // horaLocal: {},
      atividade: {},
      busy: false,
      needReload: false,
      showNotify: false,
      notifyMessage: '',
    }
  },
  emits: ['reloadListaDias'],
  props: {
    exibirModal: Boolean,
    hora: Object,
    dia: Object,
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    resetFields(needReload = false){
      this.needReload = needReload;
      this.atividade = {};
    },
    fecharModal() {
      this.$emit('update:exibirModal', this.exibirModalLocal)
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaDias', [])
        this.resetFields();
      }
    },
    criarAtividade() {
      this.busy = true;
      let body = {
        'descricao': this.atividade.descricao,
        'hora': this.hora.id
      };

      let requestData = {
        'url': config.serverUrl + '/atividades', //config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.notify('Atividade criada!');
        this.busy = false;
        this.needReload = true;
        this.resetFields(true);
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
    hora(newProp, oldProp) {
      // this.horaLocal = deepCopy.deepCopy(newProp);
    }
  }
}
</script>

