<template>
  <div class="servidor_container">
    <h3>Simulador de aposentadoria</h3>
    <div class="s_container">
      <div class="servidor">
        <div class="nome">
          <label for="nome">Nome: </label>

          <input
            type="text"
            name="servidor_nome"
            id="servidor_nome"
            v-model="servidor.nome"
            class="form-control"
          />
        </div>
        <div class="">
          <label for="data_nascimento">Data de nascimento: </label>
          <input
            type="text"
            name="data_nascimento"
            id="data_nascimento"
            v-model="servidor.data_nascimento"
            v-mask="'##/##/####'"
            @blur="validaData"
          />
        </div>
        <div class="idade">
          <label for="idade">Idade:</label>
          <p style="display: inline; font-size: 20px">{{ servidor.idade }}</p>
        </div>
        <div class="genero">
          <label for="genero">Gênero: </label>
          <br />

          <input
            type="radio"
            name="genero"
            id="genero"
            v-model="servidor.genero"
            value="F"
          />F

          <input
            type="radio"
            name="genero"
            id="genero"
            v-model="servidor.genero"
            value="M"
          />M
        </div>
      </div>

      <div class="atividade hidden">
        <h5>Atividade</h5>
        <div class="">
          <input
            type="radio"
            name="atividade"
            value="Geral"
            v-model="servidor.atividade"
          />Geral
        </div>
        <div>
          <input
            type="radio"
            name="atividade"
            value="Professor Nível Fund/Médio"
            v-model="servidor.atividade"
          />Professor Nível Fundamental / Médio
        </div>

        <div>
          <input
            type="radio"
            name="atividade"
            value="Professor Nivel Superior"
            v-model="servidor.atividade"
          />Professor Nivel Superior
        </div>
        <div>
          <div>
            <input
              type="radio"
              name="atividade"
              value="Policial"
              v-model="servidor.atividade"
            />Policial
          </div>
        </div>
      </div>

      <div class="datas">
        <div class="">
          <label for="dt_ingresso">Data de aposentadoria compulsória: </label>
          <input
            type="text"
            name="dt_aposentadoria_compulsoria"
            id="dt_aposentadoria_compulsoria"
            v-model="servidor.dt_aposentadoria_compulsoria"
            readonly
          />
        </div>
        <div class="hidden">
          <label for="dt_ingresso">Data ingresso no serviço público: </label>
          <input
            type="text"
            name="dt_ingresso_servico_publico"
            id="dt_ingresso_servico_publico"
            v-model="servidor.dt_ingresso_servico_publico"
            v-mask="'##/##/####'"
            @blur="validaData"
          />
        </div>
        <div class="">
          <label for="licenca_premio">Licença prêmio não usufruída: </label>
          <input
            type="text"
            name="licenca_premio"
            id="licenca_premio"
            v-model="servidor.licenca_premio"
            v-mask="['##', '###']"
            @blur="dobraLicenca"
          />
        </div>
        <div class="">
          <label for="licenca_premio_em_dobro">Licença prêmio dobrada: </label>
          <input
            type="text"
            name="licenca_premio_em_dobro"
            id="licenca_premio_em_dobro"
            v-model="servidor.licenca_premio_em_dobro"
            v-mask="['##', '###']"
            readonly
          />
        </div>
      </div>
    </div>

    <ContadorComponent
      contadorName="Tempo no cargo atual"
      @totalizaTempo="totalizaTempo"
      @addTodosPeriodos="addTodosPeriodos"
      :todosPeriodos="[]"
      @deletePeriodo="deletePeriodo"
      :totalizaTempo="false"
      :verificaDuplicidade="false"
      ini="01/01/1990"
      fim="23/02/2023"
    />

    <ContadorComponent
      contadorName="Tempo na carreira"
      @totalizaTempo="totalizaTempo"
      @addTodosPeriodos="addTodosPeriodos"
      :todosPeriodos="todosPeriodos"
      @deletePeriodo="deletePeriodo"
      totalizaTempo
      verificaDuplicidade
      ini="01/01/1990"
      fim="23/02/2023"
    />
    <ContadorComponent
      contadorName="Outros períodos de contribuição no serviço público "
      @totalizaTempo="totalizaTempo"
      @addTodosPeriodos="addTodosPeriodos"
      :todosPeriodos="todosPeriodos"
      @deletePeriodo="deletePeriodo"
      totalizaTempo
      verificaDuplicidade
      ini="01/01/1980"
      fim="31/05/1984"
    />
    <ContadorComponent
      contadorName="Averbações de tempo (INSS):"
      @totalizaTempo="totalizaTempo"
      @addTodosPeriodos="addTodosPeriodos"
      :todosPeriodos="todosPeriodos"
      @deletePeriodo="deletePeriodo"
      totalizaTempo
      verificaDuplicidade
      ini="15/06/1984"
      fim="31/12/1989"
    />
    <!-- <pre>{{ tempos }}</pre> -->
    <!-- <pre>{{ deducoes }}</pre> -->
    <Deducoes @handleDeducoes="handleDeducoes" :deducoes="{ ...deducoes }" />

    <div class="errors">
      <ErrorsComponent :errors="errors" />
    </div>

    <div id="ts">
      <h4>Tempo Total:</h4>
      <div id="total">
        <label for="total">Total de dias: </label>
        <p class="p_tempo">
          {{ total_tempo_em_dias }}
        </p>
      </div>
      <div id="anos">
        <label for="anos">Anos:</label>
        <p class="p_tempo">
          {{ getTempoExtenso().anos }}
        </p>
      </div>
      <div id="meses">
        <label for="meses">Meses:</label>
        <p class="p_tempo">
          {{ getTempoExtenso().meses }}
        </p>
      </div>
      <div id="dias">
        <label for="dias">Dias: </label>
        <p class="p_tempo">
          {{ getTempoExtenso().dias }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ContadorComponent from "./ContadorComponent.vue";
import ModalAddComponent from "./ModalAddComponent.vue";
import { mask } from "vue-the-mask";
import moment from "moment";
import ErrorsComponent from "./..//errors/ErrorsComponent.vue";
import { diasParaExtenso, diffDateInDays } from "../Utils/utils";
import Deducoes from "./Deducoes.vue";

// const ANO_EM_DIAS = 365;
// const MES_EM_DIAS = 30;

export default {
  /* eslint-disable */
  data() {
    return {
      total_tempo_em_dias: 0,
      servidor: {
        nome: "FEITO FEITORIAFEITO FEITORIAFEITO FEITORIAFEITO ",
        data_nascimento: "01/01/1960",
        genero: "F",
        dt_ingresso_servico_publico: "01/01/1980",
        licenca_premio: "150",
        licenca_premio_em_dobro: "300",
        idade: "63",
      },
      errors: [],
      todosPeriodos: [],
      deducoes: {
        ate1998: 0,
        ate2003: 0,
        ate2019: 0,
        apos2019: 0,
      },
      tempos: {
        ate1998: 0,
        ate2003: 0,
        ate2019: 0,
        apos2019: 0,
      },
    };
  },
  components: {
    ModalAddComponent,
    ContadorComponent,
    ErrorsComponent,
    Deducoes,
  },
  methods: {
    handleDeducoes(qtdeDias, periodo) {
      //PERIODO=ate1998 = PERIODOS ATE 1998
      //PERIODO=ate2003 = PERIODOS DE 1998 ATE 2003
      //PERIODO=ate2019 = PERIODOS DE 1998 ATE 2003
      //PERIODO=apos2019 = PERIODOS APOS 2003

      if (qtdeDias < 0) {
        this.errors.push("Quantidade de dias deve ser positiva!");
        return;
      }

      if (this.total_tempo_em_dias <= 0) {
        this.errors = [];
        this.errors.push("Tempo total está zerado!");
        return;
      }

      if (this.tempos[periodo] === 0) {
        this.errors = [];
        this.errors.push("Não há tempos cadastrados nesta faixa.");
        return;
      }

      this.total_tempo_em_dias += parseInt(this.deducoes[periodo]);
      this.tempos[periodo] += parseInt(this.deducoes[periodo]);
      this.deducoes[periodo] = qtdeDias;

      this.total_tempo_em_dias -= qtdeDias;

      this.deducoes[periodo] = qtdeDias;
      this.tempos[periodo] -= qtdeDias;
    },
    somaTempo(periodo, days, somar = true) {
      if (somar) {
        this.tempos[periodo] += days;
        return;
      }

      this.tempos[periodo] += parseInt(this.deducoes[periodo]);
      this.total_tempo_em_dias += parseInt(this.deducoes[periodo]);
      // console.log("Deducoes: ", this.deducoes[periodo]);
      this.tempos[periodo] -= parseInt(days);
    },
    deletePeriodo(data_ini, data_fim) {
      // console.log(data_ini, data_fim);
      //PEGAR A DATA INI E FIM, CALCULAR QTDE DE DIAS E SOMAR NO ARRAY TEMPOS.

      let index_of_item = null;

      this.todosPeriodos.forEach((date, i) => {
        if (date.data_ini === data_ini) index_of_item = i; //SABER QUAL INDEX EXCLUIR
      });

      this.todosPeriodos.splice(index_of_item, 1);
      this.consolidaTempo({ data_ini, data_fim }, false);
      this.clearDeducoes(data_ini);
    },
    clearDeducoes(data_ini) {
      const data_ini_antes_de_1998 = this.whereDateIs(data_ini) === "ate1998";
      const data_ini_antes_de_2003 = this.whereDateIs(data_ini) === "ate2003";
      const data_ini_antes_de_2019 = this.whereDateIs(data_ini) === "ate2019";
      const data_ini_apos_2019 = this.whereDateIs(data_ini) === "apos2019";

      if (data_ini_antes_de_1998) {
        this.deducoes["ate1998"] = 0;
      }
      if (data_ini_antes_de_2003) {
        this.deducoes["ate2003"] = 0;
        f;
      }
      if (data_ini_antes_de_2019) {
        this.deducoes["ate2019"] = 0;
      }
      if (data_ini_apos_2019) {
        this.deducoes["apos2019"] = 0;
      }

      this.errors.push(
        "Atenção! Lance novamente os dias de dedução deste período!"
      );
    },
    whereDateIs(date) {
      if (moment(date, "DD/MM/YYYY").isSameOrBefore("1998-12-16"))
        return "ate1998";

      // if (moment(date, "DD/MM/YYYY").isAfter("1998-12-16")) return "apos1998";

      if (moment(date, "DD/MM/YYYY").isSameOrBefore("2003-12-31"))
        return "ate2003";
      // if (moment(date, "DD/MM/YYYY").isAfter("2003-12-31")) return "apos2003";

      if (moment(date, "DD/MM/YYYY").isSameOrBefore("2019-11-12"))
        return "ate2019";
      if (moment(date, "DD/MM/YYYY").isAfter("2019-11-12")) return "apos2019";
    },
    calcDifAte1998(date) {
      return diffDateInDays(moment(date, "DD/MM/YYYY"), moment("1998-12-16"));
    },
    calcDifAte2003(date) {
      return diffDateInDays(moment(date, "DD/MM/YYYY"), moment("2003-12-31"));
    },
    calcDifAte2019(date) {
      return diffDateInDays(moment(date, "DD/MM/YYYY"), moment("2019-11-12"));
    },
    calcDifApos2019(date) {
      return diffDateInDays(moment("2019-11-13"), moment(date, "DD/MM/YYYY"));
    },
    consolidaTempo({ data_ini, data_fim }, somar = true) {
      // console.log("Data Ini: ", data_ini, "Data Fim: ", data_fim);
      const d1 = this.whereDateIs(data_ini);
      const d2 = this.whereDateIs(data_fim);
      // console.log("Data: ", d1, d2);

      const data_ini_antes_de_1998 = this.whereDateIs(data_ini) === "ate1998";
      // const data_ini_apos_1998 = this.whereDateIs(data_ini) === "apos1998";
      const data_fim_antes_de_1998 = this.whereDateIs(data_fim) === "ate1998";

      const data_ini_apos_2003 = this.whereDateIs(data_ini) === "apos2003";
      const data_ini_antes_de_2003 = this.whereDateIs(data_ini) === "ate2003";
      const data_fim_antes_de_2003 = this.whereDateIs(data_fim) === "ate2003";

      const data_ini_antes_de_2019 = this.whereDateIs(data_ini) === "ate2019";
      const data_fim_antes_de_2019 = this.whereDateIs(data_fim) === "ate2019";

      const data_ini_apos_2019 = this.whereDateIs(data_ini) === "apos2019";

      const data_fim_apos_2019 = this.whereDateIs(data_fim) === "apos2019";

      if (data_fim_antes_de_1998) {
        //SOMA TUDO NO ATE1998
        const dif_date = diffDateInDays(data_ini, data_fim);
        this.somaTempo("ate1998", dif_date, somar);
        // this.tempos.ate1998 += dif_date;
      }

      if (data_fim_antes_de_2003) {
        //O PERIODO ESTA ENTRE 1998 E 2003
        if (data_ini_antes_de_1998) {
          //SOMA ATE 1998 E ATE 31/12/2003
          const ate1998 = this.calcDifAte1998(data_ini);
          const ate2003 = this.calcDifAte2003("17/12/1998");

          this.somaTempo("ate1998", ate1998, somar);
          this.somaTempo("ate2003", ate2003, somar);
        } else {
          const dif_date_ate2003 = diffDateInDays(
            moment(data_ini, "DD/MM/YYYY"),
            moment(data_fim, "DD/MM/YYYY")
          ); //CALCULA A DIFERENÇA ATE 16/12/1998
          this.somaTempo("ate2003", dif_date_ate2003, somar);
          // this.tempos.ate2003 += dif_date_ate2003;
        }
      }

      if (data_fim_antes_de_2019) {
        //FAZER CHECK SE DATA INI É ANTES DE 1998 O ANTES DE 2003
        if (data_ini_antes_de_1998) {
          //SOMA DA DATA INI ATE 16/12/1998, DE 17/12/1998 A 31/12/2003 E DE 01/01/2004 ATÉ DATA FIM
          const ate1998 = this.calcDifAte1998(data_ini);
          const ate2003 = this.calcDifAte2003("17/12/1998");
          const ate2019 = this.calcDifAte2019("01/01/2004");

          this.somaTempo("ate1998", ate1998, somar);
          this.somaTempo("ate2003", ate2003, somar);
          this.somaTempo("ate2019", ate2019, somar);
        } else if (
          moment(data_ini, "DD/MM/YYYY").isAfter("1998-12-16") &&
          data_ini_apos_2003
        ) {
          const ate2003 = this.calcDifAte2003("17/12/1998");
          const ate2019 = this.calcDifAte2019("01/01/2004");

          this.somaTempo("ate2003", ate2003, somar);
          this.somaTempo("ate2019", ate2019, somar);
        } else {
          const ate2019 = this.calcDifAte2019("01/01/2004");
          this.somaTempo("ate2019", ate2019, somar);
        }
      }

      if (data_fim_apos_2019) {
        //SOMA DA DATA INI ATE 16/12/1998, DE 17/12/1998 A 31/12/2003 E DE 01/01/2004 ATE 12/11/2019 E DE 13/11/2019 ATÉ DATA FIM
        if (data_ini_antes_de_1998) {
          const ate1998 = this.calcDifAte1998(data_ini);
          const ate2003 = this.calcDifAte2003("17/12/1998");
          const ate2019 = this.calcDifAte2019("01/01/2004");
          const apos2019 = this.calcDifApos2019(data_fim);

          this.somaTempo("ate1998", ate1998, somar);
          this.somaTempo("ate2003", ate2003, somar);
          this.somaTempo("ate2019", ate2019, somar);
          this.somaTempo("apos2019", apos2019, somar);
        } else if (data_ini_antes_de_2003) {
          const ate2003 = this.calcDifAte2003("17/12/1998");
          const ate2019 = this.calcDifAte2019("01/01/2004");
          const apos2019 = this.calcDifApos2019(data_fim);

          this.somaTempo("ate2003", ate2003, somar);
          this.somaTempo("ate2019", ate2019, somar);
          this.somaTempo("apos2019", apos2019, somar);
        } else if (data_ini_antes_de_2019) {
          const ate2019 = this.calcDifAte2019(data_ini);
          const apos2019 = this.calcDifApos2019(data_fim);

          this.somaTempo("ate2019", ate2019, somar);
          this.somaTempo("apos2019", apos2019, somar);
        } else {
          //HA TEMPOS SOMENTE APOS 12/11/2019

          const dif_date_apos2019 = diffDateInDays(
            moment("2019-11-12"),
            moment(data_fim, "DD/MM/YYYY")
          );

          this.somaTempo("apos2019", dif_date_apos2019, somar);
          // this.tempos.apos2019 += dif_date_apos2019;
        }
      }
    },
    addTodosPeriodos(dates) {
      // console.log("Datas: ", dates);
      this.consolidaTempo({ ...dates });

      this.todosPeriodos.push(dates);
      // console.log("Add dates to array all dates: ", this.todosPeriodos);
    },
    totalizaTempo(tempo, soma) {
      // console.log("Tempo: ", tempo, soma);
      if (!soma && this.total_tempo_em_dias - tempo < 0) {
        this.total_tempo_em_dias = 0;
        return;
      }

      this.total_tempo_em_dias =
        soma === true
          ? (this.total_tempo_em_dias += tempo)
          : (this.total_tempo_em_dias -= tempo);
    },
    getTempoExtenso() {
      return diasParaExtenso(this.total_tempo_em_dias);
    },
    validaData(e) {
      const date = e.target.value;
      if (!moment(date, "DD/MM/YYYY").isValid()) {
        this.errors.push("Data inválida");
        e.target.classList.add("bg-danger");
        e.target.focus();

        return;
      }

      if (e.target.name == "data_nascimento") {
        this.servidor.idade = moment().diff(
          moment(e.target.value, "DD/MM/YYYYY"),
          "years"
        );

        this.servidor.dt_aposentadoria_compulsoria = moment(
          this.servidor.data_nascimento,
          "DD/MM/YYYY"
        )
          .add(75, "y")
          .format("DD/MM/YYYY");
      }
      //DATE IS VALID
      document.getElementById(e.target.id).classList.remove("bg-danger");
    },
    dobraLicenca() {
      this.servidor.licenca_premio_em_dobro =
        parseInt(this.servidor.licenca_premio) * 2;

      // console.log("Type: ", typeof this.servidor.licenca_premio_em_dobro);
      this.total_tempo_em_dias += this.servidor.licenca_premio_em_dobro;
    },
  },
  directives: {
    mask,
  },
  watch: {
    errors() {
      if (this.errors.length) {
        const interval = setInterval(() => {
          clearInterval(interval);
          this.errors = [];
        }, 5000);
      }
    },
  },
};
</script>

<style>
@import "./../css/utilities.css";

input[type="text"] {
  border-radius: 6px;
  text-align: center;
  /* width: auto; */
}
#licenca_premio_em_dobro,
#dt_aposentadoria_compulsoria {
  background-color: #eceff1;
  /* color: white; */
  cursor: not-allowed;
}
input[type="radio"] {
  margin: 5px;
}
h6 {
  display: block;
}

.servidor_container {
  background-color: #cfd8dc;
  padding: 10px;
  /* margin: 10px; */
  border-radius: 6px;
  /* border: solid 1px black; */
}
.s_container {
  background-color: #90caf9;
  /* margin: 12px; */
  padding: 10px;
  border: solid 1px black;
  border-radius: 6px;
}

.servidor {
  display: flex;
  flex-flow: row;
  justify-content: space-between;

  border: solid 1px black;
  border-radius: 6px;
  /* padding: 6px; */
  margin-bottom: 15px;
}
.servidor > div {
  border-left: solid 1px black;
  border-right: solid 1px black;
  /* border: 1px solid black; */
  border-radius: 6px;
  /* margin: 6px; */
  padding: 6px;
}

.nome {
  width: 50%;
}

/* .genero {
  display: inline;
} */

.errors {
  position: fixed;
  bottom: 50px;
  right: 0;
  width: "auto";
  font-weight: bold;
  text-align: left;
  z-index: 999;
}
#ts {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
}
/* #ts > h4 { */
/* margin: 30px; */
/* } */
#ts > div {
  margin-left: 30px;
  margin-right: 30px;
  /* padding: 15px; */
  /* border: 1px solid black; */
  /* border-radius: 6px; */
}

.p_tempo {
  display: inline;
  /* margin-left: 15px; */
  /* margin-right: 10px; */
  font-size: larger;
  font-weight: 900;
}
.idade > p {
  font-size: 16rem;
  /* background-color: gold; */
  /* color: red; */
  margin: 10px;
}
input[type="radio"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  border-radius: 50%;
  width: 20px;
  height: 20px;

  border: 2px solid #040405;
  transition: 0.2s all linear;
  margin-right: 5px;

  position: relative;
  top: 4px;
  /* border: 3px solid black; */
}

input:checked {
  border: 6px solid rgb(24, 37, 87);
  outline: unset !important; /* I added this one for Edge (chromium) support */
}

.atividade > h5 {
  font-weight: 900;
}

.atividade {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  /* background-color: white; */
  border: 1px solid black;
  border-radius: 6px;
}

.datas {
  display: flex;
  flex-flow: row;
  border: 1px solid black;
  border-radius: 6px;
  margin-top: 10px;
}

.datas > div {
  border-left: 1px solid black;
  border-radius: 6px;
  padding: 10px;
}

.atividade > div {
  /* border: 1px solid black; */
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 6px;
  /* box-shadow: 5px 10px #c4c2c2; */
  /* box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; */
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, */
  /* rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; */
}

@media print {
  input[type="text"] {
    border: 2px solid rgb(17, 120, 106);
    /* display: inline; */
    width: "auto";
  }
  input[type="number"] {
    border: none;
    background-color: white;
    /* display: inline; */
    font-weight: 900;
    text-align: right;
    width: "auto";
  }
  .div-periodos,
  .actions,
  .btn {
    display: none;
  }
}

input[type="number"] {
  text-align: center;
}
</style>