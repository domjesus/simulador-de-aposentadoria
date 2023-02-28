<template>
  <div class="div_error alert alert-danger" v-if="error && show">{{msg}}</div>
</template>

<script>
export default {
  name: "ErrorComponent",
  props: {
    error: {
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
.error {
  position: absolute;
  z-index: 1052 !important;
  top: 0;
  right: 0;
}
</style>