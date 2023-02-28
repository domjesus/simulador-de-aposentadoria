<template>
  <div v-if="showBlockUI" class="text-black text-center block-ui">
    <div id="myModal" class="modal show" role="dialog">
      <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Aguarde</h4>
          </div>
          <div class="modal-body">
            <i class="fa fa-refresh fa-spin fa-2x fa-fw"></i>
            <p>{{ mensagem }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlockUiComponent",
  props: {
    show: {
      type: Number | Boolean,
      required: true,
    },
    mensagem: {
      type: String,
      required: false,
      default: "Carregando...",
    },
  },
  data() {
    return {
      showBlockUI: false,
    };
  },
  // mounted() {
  //   // console.log("No component: ", this.show);
  // },
  watch: {
    show() {
      // console.log("no watch: ", this.show);

      this.showBlockUI = this.show > 0 ? true : false;
    },
  },
};
</script>

<style scoped>
.block-ui {
  position: absolute;
  /* top: 250px; */
  /* left: 100px; */
  z-index: 9999;
}
</style>