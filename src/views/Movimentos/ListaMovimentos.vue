<style scoped>
.margemInputFiltro{
  margin-right: 8px;
}
</style>

<template>
  <div>
    <div class="container">

      <h1>Movimentos</h1>

      <section >
        <div class="flex-lateral-button">
          <div class="flex">
            <h2>Lista de Movimentos {{contaNome}}</h2>
            <InlineLoader :busy="busyConta"></InlineLoader>
          </div>
          <button class="btn" type="button" @click="toggleModalCriar()"><i class="fas fa-plus-square"></i></button>
        </div>
        <div>Total: {{conta?.saldo}}</div>
      </section>

      <section class="flex-column">
        <div>
          <span>filtros</span>
        </div>
        <div class="flex justify-spacebetween">
          <div class="flex-grow-1 margemInputFiltro">
            <label for="filtroDataIni">Data início:</label>
            <input name="filtroDataIni" type="date" placeholder="filtroDataIni" v-model="filtroDataIni">
          </div>
          <div class="flex-grow-1 margemInputFiltro">
            <label for="filtroDataFim">Data fim:</label>
            <input name="filtroDataFim" type="date" placeholder="filtroDataFim" v-model="filtroDataFim">
          </div>
          <button type="button" @click="buscaMovimentos()">Filtrar</button>
        </div>
      </section>

      <section>
        <table class="table">
          <thead>
            <th>data</th>
            <th>descricao</th>
            <th>conta</th>
            <th>tipo</th>
            <th>valor</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="movimento in movimentos" :key="movimento.id">
              <td>{{ movimento.dataMovimentoReadable }} ({{movimento.dataMovimentoDiaSemana}})</td>
              <td>{{ movimento.descricao }}</td>
              <td>{{ movimento.conta.nome }}</td>
              <td>{{ movimento.tipoMovimento.nome }}</td>
              <td class="text-align-right" :class="{ 'movimento-despesa' : movimento.valor < 0 }">R$ {{ movimento.valorExibicao }}</td>
              <td>
                <button type="button" class="btn_atividade_concluida" @click="toggleModalEditar(movimento)"><i class="fas fa-edit"></i></button>
                <button type="button" class="btn_atividade_falhou" @click="deletarMovimento(movimento)"><i class="fas fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- <div v-for="movimento in movimentos" :key="movimento.id">
          <button class='diaBox' type="button" @click="toggleShowHoras(movimento)">
          </button>
        </div> -->
      </section>
    </div>

    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>

    <ModalCriarMovimento
      v-model:exibirModal="exibirModalCriarMovimento"
      v-model:contaId="contaId"
      @reloadListaMovimentos="recarregaDadosContaEMovimento()">
    </ModalCriarMovimento>

    <ModalEditarMovimento
      v-model:exibirModal="exibirModalEditarMovimento"
      v-model:contaId="contaId"
      v-model:movimento="movimentoEditar"
      @reloadListaMovimentos="recarregaDadosContaEMovimento()">
    </ModalEditarMovimento>

  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
import ModalCriarMovimento from '@/views/Movimentos/ModalCriarMovimento.vue';
import ModalEditarMovimento from '@/views/Movimentos/ModalEditarMovimento.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  name: 'ListaMovimentos',
  components: {
    Loader,
    InlineLoader,
    ModalCriarMovimento,
    ModalEditarMovimento,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      busyConta: false,
      showNotify: false,
      notifyMessage: '',
      dataCompleta: '',
      movimentos: [],
      contaId: null,
      contaNome: null,
      conta: null,
      movimentoEditar: null,
      exibirModalCriarMovimento: false,
      exibirModalEditarMovimento: false,
      filtroDataIni: null,
      filtroDataFim: null,
    }
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    toggleModalCriar () {
      this.exibirModalCriarMovimento = true;
    },
    toggleModalEditar (movimento) {
      this.movimentoEditar = movimento;
      this.exibirModalEditarMovimento = true;
    },
    dateFormat(date){
      return date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    },
    defaultFiltroIniFim(){
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      this.filtroDataIni = this.dateFormat(firstDay);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      this.filtroDataFim = this.dateFormat(lastDay);
    },
    recarregaDadosContaEMovimento(){
      this.atribuiDadosConta();
      this.buscaMovimentos();
    },
    processaMovimentosApi(movimentos) {
      movimentos.forEach(movimento => {
        movimento.valorExibicao = movimento.valor.replaceAll('.',',')
      });
      return movimentos;
    },
    async atribuiDadosConta(movimentos){
      this.contaId = parseInt(this.$route.params.contaId);
      if(this.contaId == null) return;
      await this.buscaConta(this.contaId);
      this.contaNome = this.conta.nome;
    },
    async buscaConta (contaId) {
      this.busyConta = true;
      let requestData = {
        'url': config.serverUrl + `/contas/${contaId}`// + '?orderBy=dataCompleta,desc',
      };
      await Request.fetch(requestData)
      .then(([response, data]) => {
        this.conta = data
        this.busyConta = false;
      })
      .catch((error) => {
        this.busyConta = false;
        this.notify('Ocorreu um erro.');
        console.error(error);
      });
    },
    buscaMovimentos () {
      console.log('filtroDataIni',this.filtroDataIni);
      console.log('filtroDataFim',this.filtroDataFim);
      this.busy = true;
      let requestData = {
        'url': config.serverUrl +
          `/movimentos?conta=${this.contaId}`+
          `&dataIni=${this.filtroDataIni}`+
          `&dataFim=${this.filtroDataFim}`+
          `&orderBy=dataMovimento,desc`,
      };

      Request.fetch(requestData)
      .then(([response, data]) => {
        this.movimentos = this.processaMovimentosApi(data)
        // this.atribuiDadosConta(this.movimentos)
        this.busy = false;
      })
      .catch((error) => {
        this.busy = false;
        this.notify('Ocorreu um erro.');
        console.error(error);
      });
    },
    deletarMovimento (movimento) {
      this.busy = true;
      let requestData = {
        'method': 'DELETE',
        'url': config.serverUrl + `/movimentos/${movimento.id}`,
      };
      Request.fetch(requestData)
      .then(([response, data]) => {
        this.buscaMovimentos();
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
    this.defaultFiltroIniFim();
    this.recarregaDadosContaEMovimento();
  },
}
</script>
