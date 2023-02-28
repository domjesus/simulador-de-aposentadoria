<template>
  <div v-if="showModal" class="text-black text-center modal-itens">
    <div id="myModal" class="modal show" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ modal_title }}</h4>
          </div>
          <div class="modal-body body-container">
            <table class="table table-condensed table-striped">
              <thead>
                <tr>
                  <td>Seq</td>
                  <td v-for="(header, i) in header_values" :key="i">
                    {{ header }}
                  </td>
                </tr>
              </thead>
              <detalhar-tarefas-component
                v-if="
                  solicitacoes_filtradas.length > 0 && name != 'detalhar_tipos'
                "
              />
              <detalhe-servidor-component v-if="name == 'detalhe_servidores'" />
              <detalhar-tipos-component v-if="name == 'detalhar_tipos'" />
              <detalhar-servidor-solicitante
                v-if="name == 'detalha_serv_solici'"
              />
              <rel-tarefas-tbl-detalha v-if="name == 'rel_tarefas_detalha'" />
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-md btn-primary" @click="$emit('closeModal')">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DetalharTarefasComponent from "../solicita/DetalharTarefasComponent.vue";
import DetalheServidorComponent from "../solicita/DetalheServidorComponent.vue";
import { mapGetters } from "vuex";
import DetalharTiposComponent from "./DetalharTiposComponent.vue";
import DetalharServidorSolicitante from "../solicita/DetalharServidorSolicitante.vue";
import RelTarefasTblDetalha from "../alocacao/RelTarefasTblDetalha.vue";

export default {
  components: {
    DetalharTarefasComponent,
    DetalheServidorComponent,
    DetalharTiposComponent,
    DetalharServidorSolicitante,
    RelTarefasTblDetalha,
  },
  name: "ModalComponent",
  props: {
    header_values: {
      type: Array,
      required: true,
    },
    modal_title: {
      type: String,
      required: true,
    },
    show: {
      type: Number | Boolean,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  //   mounted() {
  //     console.log("No component: ", this.itens);
  //   },
  watch: {
    show() {
      // console.log("no watch: ", this.show);
      //   console.log("No component: ", this.itens);
      // console.log("Store: ",this.$store.getters)
      this.showModal = this.show > 0;
    },
  },
  computed: {
    ...mapGetters({
      solicitacoes_filtradas: "getSolicitacoesFiltradas",
    }),
  },
};
</script>
<style scoped>
.modal-dialog {
  height: 600px;
  width: 800px;
  max-height: 600px;
  max-width: 800px;
}
.body-container {
  overflow-y: auto;
  height: 550px;
  width: 750px;
}
</style>

