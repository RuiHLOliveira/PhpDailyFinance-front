<style>
</style>

<template>
  <div>
    <div class="container">

      <h1>Dias</h1>
      

      <!-- <section>
        <h2>Criar Dia</h2>
        <label for="dataCompleta">Data:</label>
        <input name="dataCompleta" type="date" placeholder="nome" v-model="dataCompleta">
        <button @click="criarDia()">Criar dia</button>
      </section> -->

      <section class="flex-lateral-button">
        <h2>Lista de Dias</h2>
        <button class="btn btn-sm" type="button" @click="toggleModalCriarDia()">Novo +</button>
      </section>

      <section>

        <div v-for="dia in dias" :key="dia.id">
          <button class='diaBox' type="button" @click="toggleShowHoras(dia)">{{ dia.dataCompleta }}</button>
          <div v-if="dia.showHoras">
            <div v-for="hora in dia.horas" :key="hora.id">
              <span class='hora'>{{ hora.hora }}</span>
              <button class="btn" type="button" @click="toggleModalCriarAtividade(hora,dia)">+</button>
              <button class="btn" :class="{ btn_atividade_concluida: atividade.situacao == 1, btn_atividade_falhou: atividade.situacao == 2}" type="button" v-for="atividade in hora.atividades" :key="atividade.id"
                @click="toggleModalEditarAtividade(atividade,hora,dia)" >
                {{ atividade.descricao }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Loader :busy="busy"></Loader>
    <Notifier v-model:showNotify="showNotify" :message="notifyMessage"></Notifier>

    <ModalCriarDia
      v-model:exibirModal="exibirModalCriarDia"
      @reloadListaDias="buscaDias()">
    </ModalCriarDia>

    <ModalCriarAtividade
      v-model:exibirModal="exibirModalCriarAtividade"
      :hora="horaModalNovaAtividade"
      :dia="diaModalNovaAtividade"
      @reloadListaDias="buscaDias()">
    </ModalCriarAtividade>
    
    <ModalEditarAtividade
      v-model:exibirModal="exibirModalEditarAtividade"
      :atividade="atividadeModalEditarAtividade"
      :hora="horaModalEditarAtividade"
      :dia="diaModalEditarAtividade"
      @reloadListaDias="buscaDias()"><!-- @update:atividade="buscaDias()" -->
    </ModalEditarAtividade>
  </div>
</template>

<script>
import Loader from '@/components/Loader.vue';
import Notifier from '@/components/Notifier.vue';
import ModalCriarDia from '@/views/ModalCriarDia.vue';
import ModalCriarAtividade from '@/views/ModalCriarAtividade.vue';
import ModalEditarAtividade from '@/views/ModalEditarAtividade.vue';
import Request from '@/core/request.js';
import config from '@/core/config.js'

export default {
  name: 'ListaDias',
  components: {
    Loader,
    ModalCriarDia,
    ModalCriarAtividade,
    ModalEditarAtividade,
    Notifier
  },
  data: () => {
    return {
      busy: false,
      showNotify: false,
      notifyMessage: '',
      dataCompleta: '',
      dias: [],
      exibirModalCriarDia: false,
      exibirModalCriarAtividade: false,
      exibirModalEditarAtividade: false,
      horaModalNovaAtividade: [],
      diaModalNovaAtividade: [],
      atividadeModalEditarAtividade: [],
      horaModalEditarAtividade: [],
      diaModalEditarAtividade: []
    }
  },
  methods: {
    notify(message, type = 'success'){
        this.showNotify = true;
        this.notifyMessage = message;
    },
    toggleShowHoras(dia) {
      dia.showHoras = !dia.showHoras
    },
    toggleModalCriarDia () {
      this.exibirModalCriarDia = true;
    },
    toggleModalCriarAtividade (hora,dia) {
      this.horaModalNovaAtividade = hora
      this.diaModalNovaAtividade = dia
      this.exibirModalCriarAtividade = true;
    },
    toggleModalEditarAtividade (atividade, hora, dia) {
      this.atividadeModalEditarAtividade = atividade
      this.exibirModalEditarAtividade = true;
      this.horaModalEditarAtividade = hora
      this.diaModalEditarAtividade = dia
    },
    buscaDias () {
      this.busy = true;
      let requestData = {
        'url': config.serverUrl + '/dias' + '?orderBy=dataCompleta,desc',
      };

      Request.fetch(requestData)
      .then(([response, data]) => {
        this.dias = data
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
    this.buscaDias();
  },
}
</script>
