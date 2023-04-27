<style>
</style>

<template>
  <div v-if="exibirModalImport">
    <div class="modalBackground">
      <div class="modal">
        <div class="flex-column alignitens-start pv5 ph10">
          <div>
            <div class="pageTitle">Import Backup</div>
          </div>
          <div>
              Import File
              <input type="file" name="importfile" id="importfile" ref="importfile">
          </div>
          <!-- <div>
              <input class="form-input" type="text" v-model="contaLocal.nome">
          </div> -->
          <div class="flex">
            <button class="btn form-input" @click="fecharModal()">Fechar</button>
            <button class="btn form-input" @click="importFile()">Salvar</button>
          </div>
        </div>
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
import AuthManager from '@/core/AuthManager.js';
import config from '@/core/config.js'
import Notifier from '@/components/Notifier.vue';

export default {
  name: "ImportData",
  components: {
    Loader,
    Notifier
  },
  data () {
    return {
      // exibirModal: false,
      busy: false,
      fileToImport: null,
      editadoComSucesso: false,
      showNotify: false,
      notifyMessage: '',
    };
  },
  props: {
    exibirModalImport: Boolean,
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    fecharModal() {
      this.exibirModal = false;
      this.$emit('update:exibirModalImport', this.exibirModal)
      if(this.editadoComSucesso == true) {
        // EventBus.$emit('LISTACONTAS_INDEX', {});
      }
    },
    async importFile() {
      this.busy = true;
      
      let file = this.$refs.importfile.files[0];
      let fileJson = await file.text();
      console.log('1',fileJson);
      let fileJson2 = JSON.parse(fileJson);
      console.log('2',fileJson2);

      console.log('[fileJson2]', fileJson2);

      let headers = new Headers();
      headers.append("Authorization", AuthManager.getToken());
      headers.append('Accept','application/json');

      let requestData = {
        'url': config.serverUrl + "/backup/import",
        'headers': headers,
        'method' : 'POST',
        'data' : fileJson2,
      };

      Request.fetch(requestData).then(([response,data]) => {
        console.log('[response]',response);
        console.log('[data]',data);
        this.busy = false;
        this.editadoComSucesso = true;
        this.fecharModal();
        this.notify('Importado! Atualize a listagem.');
      }).catch((error) => {
        console.error(error);
        this.busy = false;
        this.notify(error);
      });

    },
  },
  watch: {
  }
}
</script>
