<style>
</style>

<template>
  <div>
    <div class="container">

      <h1>Contas</h1>

      <section class="flex-lateral-button">
        <h2>Lista de Contas</h2>
        <!-- <button class="btn btn-sm" type="button" @click="toggleModalCriarConta()">Novo +</button> -->
        <button class="btn" type="button" @click="toggleModalCriarConta()"><i class="fas fa-plus-square"></i></button>
      </section>

      <section>

        <div v-for="conta in contas" :key="conta.id">
          <div class="flex">
            <button class='contaBox' type="button" @click="openListaMovimentos(conta)">
              <span>{{ conta.nome }}</span>
              <span>R$ {{ conta.saldoExibicao }}</span>
            </button>
            <button class="btn btn_secondary" type="button" @click="toggleMenuConta(conta)"><i class="fas fa-ellipsis-v"></i></button>
            <div v-if="conta.mostraMenuConta">
              <button type="button" class="btn_atividade_falhou" @click="deletarConta(conta)"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          <!-- <div v-if="conta.showHoras">
            <div v-for="hora in dia.horas" :key="hora.id">
              <span class='hora'>{{ hora.hora }}</span>
              <button class="btn" type="button" @click="toggleModalCriarAtividade(hora,dia)">+</button>
              <button class="btn" :class="{ btn_atividade_concluida: atividade.situacao == 1, btn_atividade_falhou: atividade.situacao == 2}" type="button" v-for="atividade in hora.atividades" :key="atividade.id"
                @click="toggleModalEditarAtividade(atividade,hora,dia)" >
                {{ atividade.descricao }}
              </button>
            </div>
          </div> -->
        </div>
      </section>
    </div>

    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>

    <ModalCriarConta
      v-model:exibirModal="exibirModalCriarConta"
      @reloadListaContas="buscaContas()">
    </ModalCriarConta>

    <!-- <ModalCriarAtividade
      v-model:exibirModal="exibirModalCriarAtividade"
      :hora="horaModalNovaAtividade"
      :dia="diaModalNovaAtividade"
      @reloadListaDias="buscaDias()">
    </ModalCriarAtividade> -->
    
    <!-- <ModalEditarAtividade
      v-model:exibirModal="exibirModalEditarAtividade"
      :atividade="atividadeModalEditarAtividade"
      :hora="horaModalEditarAtividade"
      :dia="diaModalEditarAtividade"
      @reloadListaDias="buscaDias()">
    </ModalEditarAtividade> -->
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import ModalCriarConta from '@/views/Contas/ModalCriarConta.vue';
// import ModalCriarAtividade from '@/views/ModalCriarAtividade.vue';
// import ModalEditarAtividade from '@/views/ModalEditarAtividade.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  name: 'ListaContas',
  components: {
    Loader,
    ModalCriarConta,
    // ModalCriarAtividade,
    // ModalEditarAtividade,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      showNotify: false,
      notifyMessage: '',
      dataCompleta: '',
      contas: [],
      exibirModalCriarConta: false,
      // exibirModalCriarAtividade: false,
      // exibirModalEditarAtividade: false,
      // horaModalNovaAtividade: [],
      // diaModalNovaAtividade: [],
      // atividadeModalEditarAtividade: [],
      // horaModalEditarAtividade: [],
      // diaModalEditarAtividade: []
    }
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    // toggleShowHoras(dia) {
    //   dia.showHoras = !dia.showHoras
    // },
    toggleMenuConta(conta){
      conta.mostraMenuConta = !conta.mostraMenuConta;
    },
    toggleModalCriarConta () {
      this.exibirModalCriarConta = true;
    },
    openListaMovimentos(conta){
      this.$router.push({ path: `/listaMovimentos/${conta.id}` })
    },
    // toggleModalCriarAtividade (hora,dia) {
    //   this.horaModalNovaAtividade = hora
    //   this.diaModalNovaAtividade = dia
    //   this.exibirModalCriarAtividade = true;
    // },
    // toggleModalEditarAtividade (atividade, hora, dia) {
    //   this.atividadeModalEditarAtividade = atividade
    //   this.exibirModalEditarAtividade = true;
    //   this.horaModalEditarAtividade = hora
    //   this.diaModalEditarAtividade = dia
    // },
    processaContasApi(contas){
      contas.forEach(conta => {
        conta.mostraMenuConta = false
        conta.saldoExibicao = conta.saldo.replaceAll('.',',')
      });
      return contas;
    },
    buscaContas () {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/contas'// + '?orderBy=dataCompleta,desc',
      };

      Request.fetch(requestData)
      .then(([response, data]) => {
        this.contas = this.processaContasApi(data)
        this.busy = false;
      })
      .catch((error) => {
        this.busy = false;
        this.notify('Ocorreu um erro.');
        console.error(error);
      });
    },
    deletarConta (conta) {
      this.busy = true;
      let requestData = {
        'method': 'DELETE',
        'url': config.serverUrl + `/contas/${conta.id}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        this.buscaContas();
        this.busy = false;
      })
      .catch((error) => {
        this.busy = false;
        this.notify('Ocorreu um erro.');
        console.error(error);
      });
    }
  },
  watch: {
  },
  created () {
    this.buscaContas();
  },
}
</script>
