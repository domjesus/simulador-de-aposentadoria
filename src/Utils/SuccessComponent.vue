<template>
  <div class="div_success alert alert-success" v-if="success">{{ msg }}</div>
</template>

<script>
export default {
  name: "SuccessComponent",
  props: {
    success: {
      type: Boolean,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    this.show = true;
  },
  watch: {
    msg() {
      this.show = true;
    },
  },
};
</script> 

<style scoped>
.div_success {
  position: absolute;
  z-index: 1052 !important;
  top: 0;
  right: 0;
}
</style>