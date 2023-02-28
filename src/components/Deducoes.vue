<template>
  <div class="deducoes">
    <h4>Deduções</h4>
    <div>
      <div class="item">Ate 1998</div>
      <div class="item2">
        <input
          type="number"
          v-model.number="licencas.ate1998"
          min="0"
          @change="$emit('handleDeducoes', $event.target.value, 'ate1998')"
        />
      </div>
    </div>
    <div>
      <div class="item">De 1998 a 2003 (EC 20/1998)</div>
      <div class="item2">
        <input
          type="number"
          v-model.number="licencas.ate2003"
          min="0"
          @change="$emit('handleDeducoes', $event.target.value, 'ate2003')"
        />
      </div>
    </div>
    <div>
      <div class="item">Até 2019 (EC 41/2003)</div>
      <div class="item2">
        <input
          type="number"
          v-model.number="licencas.ate2019"
          min="0"
          @change="$emit('handleDeducoes', $event.target.value, 'ate2019')"
        />
      </div>
    </div>
    <div>
      <div class="item">Após 2019 (EC103/2019)</div>
      <div class="item2">
        <input
          type="number"
          v-model.number="licencas.apos2019"
          min="0"
          @change="$emit('handleDeducoes', $event.target.value, 'apos2019')"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Deducoes",
  data() {
    return {
      licencas: {
        ate1998: 0,
        ate2003: 0,
        ate2019: 0,
        apos2019: 0,
      },
    };
  },
};
</script>

<style scoped>
/* .item2 { */
/* border: 1px solid black; */
/* } */
.item {
  /* align-self: center; */
  font-weight: 900;
  width: 50%;
  /* border: 1px solid black; */
}
h6 {
  display: inline;
  text-align: center;
}
.deducoes > div {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  border: 1px solid black;
  /* margin: 5px; */
  /* padding: 15px; */
  border-radius: 6px;
}
.deducoes {
  border: 1px solid black;
  border-radius: 6px;
  text-align: left;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
  width: 50%;
}
input[type="number"] {
  text-align: right;
}
</style>