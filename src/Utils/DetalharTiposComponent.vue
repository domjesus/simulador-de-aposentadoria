<template>
  <tbody>
    <tr v-for="(tipo, i) in tipos_solicitados" :key="i">
      <td>{{ parseInt(i) + parseInt(1) }}</td>
      <td>{{ tipo.nome_solicitacao }}</td>
      <td>{{ tipo.qtde }}</td>
      <td>
        {{
          (
            (tipo.qtde /
              tipos_solicitados.reduce((value, item) => value + item.qtde, 0)) *
            100
          ).toFixed(2)
        }}%
      </td>
    </tr>
  </tbody>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "DetalharTiposComponent",
  computed: {
    ...mapGetters({
      tipos_solicitados: "getTiposSolicitados",
    }),
  },
};
</script>

<style>
</style>