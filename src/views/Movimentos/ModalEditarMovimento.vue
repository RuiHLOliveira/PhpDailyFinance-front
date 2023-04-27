<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">
        <h1>Editar Movimento</h1>

        <label for="descricao">descricao:</label>
        <input name="descricao" type="text" placeholder="descricao" v-model="descricao">

        <label for="valor">valor:</label>
        <input name="valor" type="text" placeholder="valor" v-model="valor">

        <label for="dataMovimento">dataMovimento:</label>
        <input name="dataMovimento" type="date" placeholder="dataMovimento" v-model="dataMovimento">

        <label for="tipoMovimento">tipoMovimento:</label>
        <select @click="reloadMovimentos($event)" @keypress="reloadMovimentos($event)" name="tipoMovimento" id="tipoMovimento" v-model="tipoMovimento">
          <option v-if="busySelectMovimentos">loading...</option>
          <option v-else value="">-</option>
          <option v-for="tipo in tipoMovimentos" :key="tipo.id" :value="tipo.id">{{tipo.nome}}</option>
        </select>

        <button class="btn_secondary" @click="fecharModal()">Fechar</button>
        <button @click="editarMovimento()">Salvar  Movimento</button>
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
      descricao: null,
      valor: null,
      dataMovimento: null,
      tipoMovimento: null,
      conta: null,
      busy: false,
      busySelectMovimentos: false,
      needReload: false,
      showNotify: false,
      notifyMessage: '',
      tipoMovimentos: [],
      reloadSelectTipoMovimento: false,
    }
  },
  emits: ['reloadListaMovimentos'],
  props: {
    exibirModal: Boolean,
    contaId: Number,
    movimento: Object
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    resetFields(needReload = false){
        this.needReload = needReload;
        this.busy = false;
        this.busySelectMovimentos = false;
        this.descricao = null;
        this.valor = null;
        this.dataMovimento = null;
        this.tipoMovimento = null;
        this.conta = null;
    },
    dateFormat(date){
      return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    },
    processaMovimentoRecebido() {
      this.descricao = this.movimento.descricao;
      this.valor = this.movimento.valor.replace('.',',');
      let date = new Date(this.movimento.dataMovimento.date);
      this.dataMovimento = this.dateFormat(date);
      this.tipoMovimento = this.movimento.tipoMovimento.id;
    },
    fecharModal() {
      this.$emit('update:exibirModal', false)
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaMovimentos', [])
      }
      this.resetFields();
    },
    reloadMovimentos(event) {
      console.log('event',event);
      if(this.reloadSelectTipoMovimento == trueevent.target.tagName === 'SELECT') {
        this.tipoMovimentos = [];
        this.buscaTipoMovimentos();
      }
    },
    buscaTipoMovimentos () {
      this.busySelectMovimentos = true;
      let requestData = {
        'url': config.serverUrl + '/tipomovimentos' + '?orderBy=nome,asc',
      };

      Request.fetch(requestData)
      .then(([response, data]) => {
        this.tipoMovimentos = data
        this.busySelectMovimentos = false;
      })
      .catch((error) => {
        this.busySelectMovimentos = false;
        this.notify('Ocorreu um erro.');
        console.error(error);
      });
    },
    editarMovimento() {
      this.busy = true;
      let body = {
        'descricao': this.descricao,
        'valor': this.valor?.replace(',','.'),
        'dataMovimento': this.dataMovimento,
        'tipoMovimento': this.tipoMovimento,
        'conta': this.contaId
      };

      let requestData = {
        'url': config.serverUrl + `/movimentos/${this.movimento.id}`,
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.busy = false;
        this.needReload = true;
        this.notify('Movimento editado!');
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.notify('Ocorreu um erro.' + error);
      });
    },
  },
  watch: {
    exibirModal(newProp, oldProp) {
      if(newProp == true && oldProp == false) {
        this.processaMovimentoRecebido();
      }
    },
  },
  created () {
    this.buscaTipoMovimentos();
  }
}
</script>

