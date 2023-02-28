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
            <h6>
              Lançando licença no período de
              <b>{{ dt_ini }} - {{ dt_fim }} ({{ difInDays() }} dias)</b>
            </h6>
            <div id="licenca_em_periodos" v-if="tipo_licenca !== 'dias'">
              <label for="licenca_ini">Início:</label>
              <input
                type="date"
                name="licenca_ini"
                id="licenca_ini"
                v-model="licenca_ini"
              />
              <label for="licenca_fim">Fim:</label>
              <input
                type="date"
                name="licenca_ini"
                id="licenca_ini"
                v-model="licenca_fim"
              />
              <span
                class="fa fa-plus btn btn-sm btn-primary"
                @click="verificaDatas"
                >Adicionar lincença</span
              >
            </div>
            <div class="row" v-if="tipo_licenca === 'dias'">
              <div class="col col-md-12">
                <div class="col col-md-6">
                  <label for="dias_de_licenca">Dias de licença: </label>
                </div>
                <div class="col col-md-5">
                  <input
                    type="number"
                    value="0"
                    min="0"
                    class="form-control"
                    v-model.number="licenca_em_dias"
                    :disabled="difInDays() == licencas.sum"
                  />
                </div>
                <div class="col col-md-6 pull-right m-3">
                  <span
                    class="btn btn-md btn-primary m-3"
                    @click="addLicencaEmDias"
                    :disabled="difInDays() == licencas.sum"
                    ><i class="fa fa-plus-circle"
                      ><p style="display: inline" class="ml-3">
                        Adicionar licença
                      </p></i
                    ></span
                  >
                </div>
              </div>
            </div>

            <div v-if="!!licencas" class="m-3">
              <div v-for="(licenca, i) in licencas" :key="i" class="row">
                <div class="col col-md-9">
                  <label for="licenca_ini">Inicial: </label>
                  <p class="p_date">
                    {{ formatDate(licenca.licenca_ini) }}
                  </p>
                  <label for="licenca_final">Final: </label>
                  <p class="p_date">
                    {{ formatDate(licenca.licenca_fim) }}
                  </p>
                  ({{
                    `${diffLicenca(licenca.licenca_ini, licenca.licenca_fim)} ${
                      diffLicenca(licenca.licenca_ini, licenca.licenca_fim) ===
                      1
                        ? "dia"
                        : "dias"
                    }`
                  }})
                </div>
                <div class="col col-md-1 ml-auto">
                  <span
                    class="btn btn-sm btn-danger"
                    @click="$emit('deleteLicence', i)"
                    ><i class="fa fa-trash"></i
                  ></span>
                </div>
              </div>
            </div>
            <div class="" v-if="licencas.sum > 0">
              <p>
                Este período tem <b>{{ licencas.sum }}</b> dia(s) de licença já
                lançados!
              </p>
              <button
                class="btn btn-sm btn-danger fa fa-trash"
                @click="$emit('deleteLicence', false, licencas.sum)"
              ></button>
            </div>

            <ErrorsComponent
              :errors="errors"
              v-if="errors.length > 0"
              class="m-5 p-3 text-left"
            />
            <div v-if="msgSuccessLicence" class="alert alert-success m-3">
              <p>{{ msgSuccessLicence }}</p>
            </div>

            <!-- <div class="pull-left" style="margin: 25px">
              <button
                class="btn btn-primary btn-md"
                @click="tipo_licenca = 'periodo'"
                v-if="tipo_licenca === 'dias'"
              >
                Lançar por período
              </button>
              <button
                class="btn btn-primary btn-md"
                @click="tipo_licenca = 'dias'"
                v-if="tipo_licenca === 'periodo'"
              >
                Lançar por dias corridos
              </button>
            </div> -->
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
import moment from "moment";
import ErrorsComponent from "../errors/ErrorsComponent.vue";
import { diffDateInDays, formatDateToBr, isDatasOk } from "../Utils/utils";
export default {
  props: {
    errorsLicences: {
      type: Array,
      required: true,
    },
    showModal: {
      type: Boolean,
      required: true,
      default: true,
    },
    modal_title: {
      type: String,
      required: true,
    },
    dt_ini: {
      type: String,
      required: true,
    },
    dt_fim: {
      type: String,
      required: true,
    },
    licencas: {
      type: Array || Object,
      required: true,
    },
    msgSuccessLicence: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      licenca_em_dias: 0,
      tipo_licenca: "dias",
      licenca_ini: "",
      licenca_fim: "",
      errors: [],
    };
  },
  methods: {
    addLicencaEmDias() {
      if (this.difInDays() == this.licencas.sum) {
        return;
      }

      console.log("Lançando licença em dias:", typeof this.licenca_em_dias);

      const diffDays = diffDateInDays(this.dt_ini, this.dt_fim);
      if (!this.licenca_em_dias) {
        this.errors.push(
          "A quantidade de dias de licença precisa ser maior do que zero!"
        );
        return;
      }

      if (this.licenca_em_dias > diffDays) {
        this.errors.push(
          "Quantidade de dias de licença excede a contagem de dias do período!"
        );
        return;
      }

      this.$emit("addLicence", this.licenca_em_dias, false, false);
    },
    formatDate(date) {
      return formatDateToBr(date);
    },
    verificaDatas() {
      this.errors = [];
      const check_data = isDatasOk(this.licenca_ini, this.licenca_fim);

      if (
        moment(this.licenca_ini).isBefore(moment(this.dt_ini, "DD/MM/YYYY")) ||
        moment(this.licenca_fim).isAfter(moment(this.dt_fim, "DD/MM/YYYY"))
      ) {
        this.errors.push("Início ou fim de licença fora do período original!");
        return;
      }

      if (!check_data) {
        this.errors.push("Data inicial ou final inválida!");
        return;
      }

      this.errors = [];
      //   @click="$emit('lancarLicenca')"
      const diffDays = diffDateInDays(
        this.licenca_ini,
        this.licenca_fim,
        "YYYY-MM-DD"
      );

      this.$emit("addLicence", diffDays, this.licenca_ini, this.licenca_fim);
    },

    diffLicenca(licenca_ini, licenca_fim) {
      const dif = diffDateInDays(licenca_ini, licenca_fim, "YYYY-MM-DD");
      // console.log(licenca_ini, licenca_fim, dif);

      return dif;
    },
    difInDays() {
      return diffDateInDays(this.dt_ini, this.dt_fim);
    },
  },
  components: { ErrorsComponent },
  watch: {
    errors() {
      if (this.errors.length) {
        const interval = setInterval(() => {
          clearInterval(interval);
          this.errors = [];
        }, 5000);
      }
    },
    dt_ini() {
      this.licenca_ini = "";
      this.licenca_fim = "";
      this.licenca_em_dias = 0;
    },
    errorsLicences() {
      // console.log("Errors: ", this.errorsLicences);
      this.errors = this.errors.concat(this.errorsLicences);
    },

    // licencas() {
    //   console.log("Alt licencas: ", this.licencas);
    // },
  },
};
</script>

<style scoped>
label {
  margin: 6px;
}
.p_date {
  margin: 5px;
  display: inline;
}
</style>