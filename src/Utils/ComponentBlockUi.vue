<template>
  <div
    :class="[objectModal,showModal]"
    class="modalMain"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Aguarde</h5>
        </div>
        <div class="modal-body">
          <i class="fa fa-refresh fa-spin fa-3x fa-fw"></i>
          <span class="sr-only">Carregando...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentBlockUi",
  props: {
    objectModal: {
      type: String,
      required: true,
    },
    showModal: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.modal-body {
  text-align: center;
}
.modal-dialog {
  margin-top: 0;
  margin-bottom: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modalMain {
  z-index: 1053 !important;
}
</style>