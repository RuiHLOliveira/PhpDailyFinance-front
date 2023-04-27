<style>
</style>

<template>
  <div v-if="exibirModal">
    <div class="modalBackground">
      <div class="modal">

        <section>
          <h1>Editar Atividade - {{dia.dataCompleta}} às {{hora.hora}} horas</h1>
          <div>Atividade {{ atividade.situacaoDescritivo }}</div>
          <br>
          <label for="atividade">Atividade:</label>
          <input name="atividade" type="text" placeholder="atividade" v-model="atividadeLocal.descricao">
        </section>
          
        <section class="flex-justify-space-between">
          <div>
            <button @click="fecharModal()">Fechar</button>
            <button @click="editarAtividade()">Salvar</button>
          </div>
          <div>
            <button class="btn-red" @click="falheiAtividade()">Falhar</button>
            <button @click="concluirAtividade()">Concluir</button>
          </div>
        </section>

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
import Request from '@/core/request.js'
import config from '@/core/config.js'

export default {
  components: {
    Loader,
    Notifier
  },
  data: function () {
    return {
      atividadeLocal: [],
      busy: false,
      needReload: false,
      showNotify: false,
      notifyMessage: '',
    }
  },
  emits: ['reloadListaDias','update:exibirModal'],
  props: {
    exibirModal: Boolean,
    atividade: Object,
    hora: Object,
    dia: Object
  },
  methods: {
    resetFields(needReload = false){
      this.needReload = needReload;
    },
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    fecharModal() {
      this.$emit('update:exibirModal', this.exibirModalLocal)
      // this.$emit('update:atividade', this.atividadeLocal)
      console.log('this.needReload',this.needReload);
      if(this.needReload == true) {
        console.log('reload');
        this.$emit('reloadListaDias', []);
        this.resetFields();
      }
    },
    editarAtividade() {
      this.busy = true;
      let body = {
        'descricao': this.atividadeLocal.descricao,
      };
      let requestData = {
        'url': config.serverUrl + '/atividades/' + this.atividade.id, //config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'PUT',
        'data' : body
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.notify('Atividade editada!');
        this.busy = false;
        this.resetFields(true);
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.notify('Ocorreu um erro.' + error);
      });
    },
    concluirAtividade() {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/atividades/' + this.atividade.id + '/concluir', //config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.notify('Atividade concluída!');
        this.busy = false;
        this.resetFields(true);
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.notify('Erro!');
        // notify.notify(error, "error");
      });
    },
    falheiAtividade(){
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/atividades/' + this.atividade.id + '/falhar', //config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
        'headers': new Headers({'Content-Type': 'application/json'}),
        'method' : 'POST',
      };
      Request.fetch(requestData).then(([response, data]) => {
        this.notify("Atividade marcada como 'falhou'");
        this.busy = false;
        this.resetFields(true);
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.notify('Erro!');
        // notify.notify(error, "error");
      });
    }
  },
  watch: {
    exibirModal(newProp, oldProp) {
      // this.exibirModalLocal = newProp;
    },
    atividade(newProp, oldProp) {
      this.atividadeLocal = deepCopy.deepCopy(newProp);
    }
  }
}
</script>

