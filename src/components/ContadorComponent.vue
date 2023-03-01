<template>
  <div class="contador_container">
    <h4>{{ contadorName }}</h4>
    <div>
      <div class="div-periodos">
        <label for="dt_ini">Data inicial:</label>
        <input
          type="text"
          v-model="data_ini"
          v-mask="'##/##/####'"
          :id="`data_ini_${contadorName}`"
        />
        <label for="dt_fim">Data fim:</label>
        <input
          type="text"
          v-model="data_fim"
          v-mask="'##/##/####'"
          :id="`data_fim_${contadorName}`"
        />

        <span
          type="button"
          @click="addPeriod"
          class="btn btn-md btn-primary fa fa-plus-circle ml-2"
        />
      </div>

      <div class="table-container">
        <table
          class="table table-bordered table-condensed"
          v-if="datas_ini.length > 0"
        >
          <thead>
            <tr>
              <th>PERIODO:</th>
              <!-- <th>LICENÇA</th> -->
              <th>DIAS</th>
              <th>EXTENSO</th>
              <th class="actions">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data, i) in datas_ini"
              :key="i"
              class=""
              style="border: 1px solid black"
            >
              <td class="">
                {{ i + 1 }}: {{ trataData(datas_ini[i]) }} -
                {{ trataData(datas_fim[i]) }}
              </td>
              <!-- <td class="detail_licences" @click="detailLicences(i)">
                {{ licencas[i] ? licencas[i].sum : "" }}
              </td> -->
              <td class="">
                {{
                  !!licencas[i]
                    ? difDate(datas_ini[i], datas_fim[i]) - licencas[i].sum
                    : difDate(datas_ini[i], datas_fim[i])
                }}
              </td>
              <td class="">
                {{
                  `${calculaTempoPorExtenso(i).anos} ano(s) - ${
                    calculaTempoPorExtenso(i).meses
                  } mes(es) - ${calculaTempoPorExtenso(i).dias} dia(s)`
                }}
              </td>
              <td class="ml-auto actions">
                <div>
                  <!-- <span
                  class="btn btn-sm btn-default"
                  @click="licenceShowModal(i)"
                  ><i class="fa fa-pencil"></i
                ></span> -->
                  <span class="btn btn-sm btn-danger" @click="deletePeriod(i)"
                    ><i class="fa fa-trash"></i
                  ></span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ErrorsComponent :errors="errors" v-if="errors.length" />
    <!-- eslint-disable-next-line -->
    <ModalAddComponent
      :showModal="showModal"
      modal_title="Lançar licença"
      @closeModal="closeModal"
      :dt_ini="licenca_ini"
      :dt_fim="licenca_fim"
      @addLicence="addLicence"
      :licencas="licencasDetalhar"
      @deleteLicence="deleteLicence"
      :errorsLicences="errorsLicences"
      :msgSuccessLicence="msgSuccessLicence"
    />
  </div>
</template>
  
  <script>
/* eslint-disable */
import moment from "moment";
import { diasParaExtenso, diffDateInDays } from "../Utils/utils";
import { mask } from "vue-the-mask";
import ModalAddComponent from "./ModalAddComponent.vue";
import ErrorsComponent from "./../errors/ErrorsComponent.vue";

export default {
  name: "ContadorComponent",
  props: {
    ini: {
      type: String,
    },
    fim: {
      type: String,
    },
    totalizaTempo: {
      type: Boolean,
      required: true,
    },
    verificaDuplicidade: {
      type: Boolean,
      required: true,
    },
    contadorName: {
      type: String,
      required: true,
    },
    todosPeriodos: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      licenca_ini: "",
      licenca_fim: "",
      data_ini: this.ini ? this.ini : "",
      data_fim: this.fim ? this.fim : "",
      licencasDetalhar: [],
      licencas: [],
      datas_ini: [],
      datas_fim: [],
      errors: [],
      errorsLicences: [],
      showModal: false,
      showModalDetalhe: false,
      indexLicencaPeriodo: null,
      msgSuccessLicence: "",
    };
  },
  methods: {
    deleteLicence(index, diasDeLicenca) {
      // console.log(
      //   "Deleting licences: ",
      //   this.licencas[this.indexLicencaPeriodo].dates[index]
      // );
      if (index === false && diasDeLicenca) {
        // console.log("Entrou no delete licence!");
        this.licencas[this.indexLicencaPeriodo].sum -= diasDeLicenca;
        this.$emit("totalizaTempo", diasDeLicenca, true);
        this.msgSuccessLicence = "Dias de licença excluídos com sucesso!";
        return;
      }

      const licenca_ini =
        this.licencas[this.indexLicencaPeriodo].dates[index].licenca_ini;
      const licenca_fim =
        this.licencas[this.indexLicencaPeriodo].dates[index].licenca_fim;
      const licenca_dias = diffDateInDays(
        licenca_ini,
        licenca_fim,
        "YYYY-MM-DD"
      );

      this.licencas[this.indexLicencaPeriodo].sum -= licenca_dias;

      this.$emit("totalizaTempo", licenca_dias, true);

      this.licencas[this.indexLicencaPeriodo].dates.splice(index, 1);
      this.licencasDetalhar = this.licencas[this.indexLicencaPeriodo].dates;
    },
    detailLicences(index) {
      if (!this.licencas[index]) return;

      this.licenca_fim = this.datas_fim[index];
      this.licenca_ini = this.datas_ini[index];
      this.licencasDetalhar = this.licencas[index];
      this.showModal = true;
      this.msgSuccessLicence = "";

      // console.log("Detalhar licenças: ", this.licencas[index].dates);
    },
    verifyIfDateExists(index, ini, fim) {
      // console.log("Dates: ", this.licencas[index]?.dates);
      let nao_existe = true;
      this.licencas[index]?.dates.forEach(({ licenca_ini, licenca_fim }, i) => {
        // console.log("Date: ", dt_ini);
        const data_inicial = moment(licenca_ini); //CONVERTE A LICENÇA INICIAL PARA UM OBJETO MOMENT
        const data_final = moment(licenca_fim); //IDEM PARA A LICENÇA FINAL
        if (
          //FAZER DEMAIS VALIDAÇÕES E FECHOU.
          (moment(ini).isSameOrAfter(data_inicial) &&
            moment(fim).isSameOrBefore(data_final)) ||
          (moment(fim).isSameOrAfter(data_inicial) &&
            moment(fim).isSameOrBefore(data_final)) ||
          (data_inicial.isSameOrAfter(moment(ini)) &&
            data_inicial.isSameOrBefore(moment(fim))) ||
          (data_final.isSameOrAfter(moment(ini)) &&
            data_final.isSameOrBefore(moment(fim)))
        ) {
          // console.log("Data de licença já existe!");

          nao_existe = false;
          this.errors.push("Data da licença já existe!");
        }
      });
      // console.log("Não existe: ", nao_existe);
      return nao_existe;
    },
    addLicence(diasDeLicenca, ini, fim) {
      //ANTES DE INCLUIR, VERIFICAR SE A DATA INI E FIM JÁ NÃO CONSTAM NO ARRAY.
      // console.log("Getting from modal: ", ini, fim);

      if (!this.licencas[this.indexLicencaPeriodo]) {
        this.licencas[this.indexLicencaPeriodo] = [];
        this.licencas[this.indexLicencaPeriodo]["sum"] = 0;
        this.licencas[this.indexLicencaPeriodo]["dates"] = [];
      }

      if (!ini && !fim) {
        //QUER INCLUIR LICENÇA POR DIAS CORRIDOS.

        const data_inicial = this.datas_ini[this.indexLicencaPeriodo];
        const data_final = this.datas_fim[this.indexLicencaPeriodo];

        const diferenca = diffDateInDays(data_inicial, data_final);

        if (
          diferenca <
          parseInt(this.licencas[this.indexLicencaPeriodo]["sum"]) +
            parseInt(diasDeLicenca)
        ) {
          // console.log(
          //   "Menor: ",
          //   parseInt(this.licencas[this.indexLicencaPeriodo]["sum"]) +
          //     parseInt(diasDeLicenca)
          // );
          this.errorsLicences.push("Dias de licença excedem dias no período!");
          return;
        }

        this.licencas[this.indexLicencaPeriodo]["sum"] =
          parseInt(this.licencas[this.indexLicencaPeriodo]["sum"]) +
          parseInt(diasDeLicenca);

        // this.licencas[this.indexLicencaPeriodo]["dates"] = [
        //   { dt_ini: null, dt_fim: null },
        // ];
        // console.log(
        //   "Soma: ",
        //   this.licencas[this.indexLicencaPeriodo],
        //   diferenca
        // );

        this.$emit("totalizaTempo", parseInt(diasDeLicenca), false);
        this.msgSuccessLicence = "Período de licença informado com sucesso!";
        this.licencasDetalhar = this.licencas[this.indexLicencaPeriodo];

        // console.log(
        //   "Lic: ",
        //   this.licencas[this.indexLicencaPeriodo],
        //   this.datas_ini[this.indexLicencaPeriodo],
        //   this.datas_fim[this.indexLicencaPeriodo],
        //   diferenca
        // );
        return;
      }

      const nao_existe = this.verifyIfDateExists(
        this.indexLicencaPeriodo,
        ini,
        fim
      );
      if (nao_existe) {
        //SE EXISTIR NÃO SOMA OS DIAS DA LICENÇA NEM FAZ PUSH NO ARRAY DE DATES
        this.licencas[this.indexLicencaPeriodo]["sum"] =
          this.licencas[this.indexLicencaPeriodo]["sum"] > 0
            ? (this.licencas[this.indexLicencaPeriodo]["sum"] += diasDeLicenca)
            : diasDeLicenca;
        // if (this.licencas[this.indexLicencaPeriodo].indexOf("dates") < 0) {
        //   this.licencas[this.indexLicencaPeriodo]["dates"] = [];
        //   console.log("Criou array de dates...");
        // }
        // console.log("Lic: ", this.licencas[this.indexLicencaPeriodo]);
        this.licencas[this.indexLicencaPeriodo]["dates"].push({
          licenca_ini: ini,
          licenca_fim: fim,
        });
        this.licencasDetalhar = this.licencas[this.indexLicencaPeriodo].dates;

        const total_em_dias = diasDeLicenca;
        this.$emit("totalizaTempo", total_em_dias, false);
      } //ENDIF DATE EXISTS
      // console.log("Licenças: ", this.licencas);
    },
    licenceShowModal(index) {
      this.indexLicencaPeriodo = index;
      this.licencasDetalhar = this.licencas[this.indexLicencaPeriodo]
        ? this.licencas[this.indexLicencaPeriodo]
        : [];
      this.licenca_ini = this.datas_ini[index];
      this.licenca_fim = this.datas_fim[index];
      // console.log(
      //   "Lançar licença no index: ",
      //   index,
      //   this.datas_ini[index],
      //   this.datas_fim[index]
      // );
      this.showModal = true;
      this.msgSuccessLicence = "";
    },
    validaData(e) {
      const date = e.target.value;
      if (!moment(date, "DD/MM/YYYY").isValid()) {
        this.errors.push("Data inválida");
        e.target.classList.add("bg-danger");
        e.target.focus();
        return;
      }

      //DATE IS VALID
      document.getElementById(e.target.id).classList.remove("bg-danger");
    },
    deletePeriod(index) {
      // console.log(this.total_tempo_em_dias);

      const total_dias = this.difDate(
        this.datas_ini[index],
        this.datas_fim[index]
      );

      this.$emit("deletePeriodo", this.datas_ini[index], this.datas_fim[index]);

      if (this.totalizaTempo) this.$emit("totalizaTempo", total_dias, false);

      if (this.licencas[index]) {
        this.$emit("totalizaTempo", this.licencas[index].sum, true);
        this.licencas[index].sum = 0;
      }

      this.datas_ini.splice(index, 1);
      this.datas_fim.splice(index, 1);
      this.licencas.splice(index, 1);

      // console.log(this.total_tempo_em_dias);
    },
    momentConverter(date, format = "DD/MM/YYYY") {
      return moment(date, format);
    },
    addPeriod() {
      // console.log("Add period");

      if (
        !this.momentConverter(this.data_ini).isValid() ||
        !this.momentConverter(this.data_fim).isValid()
      ) {
        this.errors.push("Data inválida! Verifique as datas informadas!");
        return;
      }
      if (
        this.momentConverter(this.data_ini).isAfter(moment()) ||
        this.momentConverter(this.data_fim).isAfter(moment())
      ) {
        this.errors.push("Data inicial ou final no futuro!");
        return;
      }

      if (
        //CHECA SE AS DATAS ESTÃO CORRETAS
        this.momentConverter(this.data_fim).isBefore(
          this.momentConverter(this.data_ini)
        )
      ) {
        this.errors.push("Data fim menor que data inicial!");
        this.pintaCampo(`data_ini_${this.contadorName}`, "bg-danger");
        this.pintaCampo(`data_fim_${this.contadorName}`, "bg-danger");
        // document.getElementById('data_fim')
        return;
      } else {
        this.removeClasse(`data_ini_${this.contadorName}`, "bg-danger");
        this.removeClasse(`data_fim_${this.contadorName}`, "bg-danger");
        // document.getElementById("data_fim").classList.remove("bg-danger");
        // document.getElementById("data_ini").classList.remove("bg-danger");
      }
      let inclui = true;
      let duplicidade_entre_periodos = false;
      // console.log("Datas Ini: ", this.datas_ini);
      this.datas_ini.forEach((dt_ini, i) => {
        const data_inicial = this.momentConverter(dt_ini); //DATA NO ARRAY DATAS_INI
        const data_final = this.momentConverter(this.datas_fim[i]); //DATA NO ARRAY DATAS_FIM
        // QUERO SABER SE A DATA INFORMADA, INICIAL OU FINAL, ESTÁ ENTRE ALGUMA DAS DATAS CONSTANTES NO ARRAY.
        //VERIFICAR TAMBÉM DENTRO DAS DATAS DO OUTRO COMPONENT: TEMPOS AVERBADOS
        if (
          (this.momentConverter(this.data_ini).isSameOrAfter(data_inicial) &&
            this.momentConverter(this.data_ini).isSameOrBefore(data_final)) ||
          (this.momentConverter(this.data_fim).isSameOrAfter(data_inicial) &&
            this.momentConverter(this.data_fim).isSameOrBefore(data_final)) ||
          (data_inicial.isSameOrAfter(this.momentConverter(this.data_ini)) &&
            data_inicial.isSameOrBefore(this.momentConverter(this.data_fim))) ||
          (data_final.isSameOrAfter(this.momentConverter(this.data_ini)) &&
            data_final.isSameOrBefore(this.momentConverter(this.data_fim)))
          // ) &&
          // (moment(this.data_fim, "DD/MM/YYYY").isSameOrAfter(
          //   moment(this.datas_ini[i], "DD/MM/YYYY")
          // ) ||
          //   moment(this.data_fim, "DD/MM/YYYY").isSameOrBefore(
          //     moment(this.datas_ini[i], "DD/MM/YYYY")
          //   ))
        ) {
          // console.log(dt_ini, i);
          this.pintaCampo(`data_ini_${this.contadorName}`, "bg-danger");
          this.pintaCampo(`data_fim_${this.contadorName}`, "bg-danger");
          inclui = false;
        }
      });

      this.todosPeriodos.forEach(({ data_ini, data_fim }, i) => {
        const data_inicial = this.momentConverter(data_ini); //DATA NO ARRAY DATAS_INI
        const data_final = this.momentConverter(data_fim); //DATA NO ARRAY DATAS_FIM

        if (
          (this.momentConverter(this.data_ini).isSameOrAfter(data_inicial) &&
            this.momentConverter(this.data_ini).isSameOrBefore(data_final)) ||
          (this.momentConverter(this.data_fim).isSameOrAfter(data_inicial) &&
            this.momentConverter(this.data_fim).isSameOrBefore(data_final)) ||
          (data_inicial.isSameOrAfter(this.momentConverter(this.data_ini)) &&
            data_inicial.isSameOrBefore(this.momentConverter(this.data_fim))) ||
          (data_final.isSameOrAfter(this.momentConverter(this.data_ini)) &&
            data_final.isSameOrBefore(this.momentConverter(this.data_fim)))
        ) {
          // console.log(dt_ini, i);
          this.pintaCampo(`data_ini_${this.contadorName}`, "bg-danger");
          this.pintaCampo(`data_fim_${this.contadorName}`, "bg-danger");
          inclui = false;
          duplicidade_entre_periodos = true;
        }
      });

      if (inclui) {
        //DATAS ESTÃO OK, PODE INCLUIR
        if (this.verificaDuplicidade)
          this.$emit("addTodosPeriodos", {
            data_ini: this.data_ini,
            data_fim: this.data_fim,
          });

        this.datas_ini.push(this.data_ini);
        this.datas_fim.push(this.data_fim);
        //TOTALIZA O TEMPO EM DIAS
        const total_dias = diffDateInDays(this.data_ini, this.data_fim);

        if (this.totalizaTempo) this.$emit("totalizaTempo", total_dias, true);
      } else {
        //HÁ PERÍODO CONCOMITANTE, PINTA OS CAMPOS DE VERMELHO.
        this.errors.push(
          duplicidade_entre_periodos
            ? "Há período(s) concomitante(s) em outro contador!"
            : "Há período(s) concomitante(s) neste contador! Verifique."
        );
        this.pintaCampo(`data_ini_${this.contadorName}`, "bg-danger");
        this.pintaCampo(`data_fim_${this.contadorName}`, "bg-danger");
      }
    },
    trataData(data) {
      return moment(data, "DD/MM/YYYY").format("DD/MM/YYYY");
    },
    difDate(dt_ini, dt_fim) {
      return diffDateInDays(dt_ini, dt_fim);
    },
    calculaTempoPorExtenso(index) {
      let dias_totais = this.difDate(
        this.datas_ini[index],
        this.datas_fim[index]
      );
      if (!!this.licencas[index]) {
        //O PERÍODO TEM LICENÇA INFORMADA, DESCONTAR OS DIAS DA CONTAGEM POR EXTENSO
        dias_totais -= this.licencas[index].sum;
      }

      const { anos, meses, dias } = diasParaExtenso(dias_totais);
      // console.log(anos, meses, anos);
      // const anos = Math.floor(dias_totais / 365);
      // let meses =
      //   anos > 0
      //     ? Math.floor((dias_totais - anos * 365) / 30)
      //     : Math.floor(dias_totais / 30);
      // const dias = dias_totais - anos * 365 - meses * 30;
      // console.log("Ano: ", anos, "meses: ", meses, "dias: ", dias);
      return { anos, meses, dias };
    },
    pintaCampo(campo, cor) {
      document.getElementById(campo).classList.add(cor);
    },
    removeClasse(campo, classe) {
      document.getElementById(campo).classList.remove(classe);
    },
    closeModal() {
      this.showModal = false;
    },
  },
  watch: {
    ini() {
      console.log("Ini: ", this.ini);
      this.data_ini = this.ini;
    },
    fim() {
      this.data_fim = this.fim;
    },
    errorsLicences() {
      if (this.errorsLicences.length) {
        const interval = setInterval(() => {
          clearInterval(interval);
          this.errorsLicences = [];
        }, 5000);
      }
    },
    errors() {
      // console.log("Errors alterado");
      if (this.errors.length) {
        const interval = setInterval(() => {
          clearInterval(interval);
          this.errors = [];
        }, 5000);
      }
    },
    msgSuccessLicence() {
      if (this.msgSuccessLicence.length) {
        const interval = setInterval(() => {
          clearInterval(interval);
          this.msgSuccessLicence = "";
        }, 5000);
      }
    },
    // licencas() {
    //   console.log("Licenças: ", this.licencas);
    // },
  },
  directives: {
    mask,
  },
  components: { ModalAddComponent, ErrorsComponent },
};
</script>
  
  <style scoped>
.contador_container {
  background-color: #90caf9;
  /* margin: 12px; */
  /* padding: 10px; */
  border: solid 1px black;
  border-radius: 6px;
  /* width: 100%; */
}
.periodos {
  display: flex;
  flex-flow: row;
  /* padding: 8px; */
  border-radius: 6px;
}
.detail_licences {
  cursor: pointer;
}
th {
  text-align: center;
  font-weight: bold;
}
.table-container {
  display: flex;
  /* justify-content: center; */
  /* flex-flow: row; */
  justify-content: center;
  /* align-content: center; */
  /* margin-left: auto; */
}
table {
  /* margin-left: auto; */
  width: 90%;
  /* border: 1px solid black; */
}
</style>