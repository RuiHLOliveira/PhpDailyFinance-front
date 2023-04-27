<style scoped>
.margemInputFiltro{
  margin-right: 8px;
}
</style>

<template>
  <div>
    <div class="container">

      <h1>Relatorios</h1>

      <section >
        <div class="flex-lateral-button">
          <div class="flex">
            <h2>Relatorios</h2>
          </div>
        </div>
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
          <button type="button" @click="buscaRelatorioBase()">Filtrar</button>
        </div>
      </section>

      <section>
          <h2>{{relatorioEntradasSaidas.nome}}</h2>
          <div v-for="dado in relatorioEntradasSaidas.dados" :key="dado.id">
            {{ dado.nome }} - R$ {{dado.valor}}
          </div>
      </section>

      <section>
          <h2>{{relatorioTotalPorTipoMovimento.nome}}</h2>
          <table class="table">
            <thead>
              <th></th>
              <th>entrada</th>
              <th>saida</th>
              <th>total</th>
            </thead>
            <tbody>
              <tr v-for="dado in relatorioTotalPorTipoMovimento.dados" :key="dado.id">
                <td>{{ dado.nome }} </td>
                <td>{{ dado.valorEntradas }}</td>
                <td>{{ dado.valorSaidas }}</td>
                <td>{{ dado.valorTotal }}</td>
              </tr>
            </tbody>
          </table>

      </section>
    </div>

    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>

  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import InlineLoader from '@/components/InlineLoader.vue';
import Notifier from '@/components/Notifier.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  name: 'Relatorios',
  components: {
    Loader,
    InlineLoader,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      showNotify: false,
      notifyMessage: '',
      dataCompleta: '',
      relatorioEntradasSaidas: [],
      relatorioTotalPorTipoMovimento: [],
      filtroDataIni: null,
      filtroDataFim: null,
    }
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
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
    buscaRelatorioBase () {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl +
          `/relatorios/relatorioBase?`+
          `&dataIni=${this.filtroDataIni}`+
          `&dataFim=${this.filtroDataFim}`
      };

      Request.fetch(requestData)
      .then(([response, data]) => {
        this.relatorioEntradasSaidas = data.relatorioEntradasSaidas
        this.relatorioTotalPorTipoMovimento = data.relatorioTotalPorTipoMovimento
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
    this.defaultFiltroIniFim();
    this.buscaRelatorioBase();
  },
}
</script>
