<template>
  <div>
    <div v-if="busy" class="inline-loader">
      <!-- <div ></div> -->
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      ini: ''
    }
  },
  props: {
    busy: Boolean
  }
}
</script>

<style>

.inline-loader {
  margin: 8px;
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid var(--default-bg); /* Blue */
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
