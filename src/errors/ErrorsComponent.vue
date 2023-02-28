<template>
  <div class="">
    <div
      v-for="(v, k) in errors"
      :key="k"
      class="bg-danger border rounded m-2 p-2"
    >
      <div v-if="typeof v != 'string'">
        <h4 v-for="error in v" :key="error">
          {{ error.toUpperCase() }}
        </h4>
      </div>
      <div v-else class="m-2 p-2">
        <ul>
          <li>
            {{ v }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorsComponent",
  // mounted() {
  //   console.log(this.errors);
  // },
  props: {
    errors: {
      type: Array,
      required: true,
    },
  },
  //   watch: {
  //     errors() {
  //       console.log("Errors: ", this.errors);
  //     },
  //   },
};
</script>
<style scoped>
.error_container {
  position: fixed;
  bottom: 60px;
  right: 50%;
}
</style>