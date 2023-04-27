<template>
  <div>
    <div v-if="showNotify" :class="{ modalNotifyContainer : modalMode == true }">
      <div :class="{ modalNotify : modalMode == true }">
        {{message}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      modalMode: true
    }
  },
  emits: ['update:showNotify'],
  props: {
    showNotify: Boolean,
    message: String
  },
  watch: {
    showNotify (newValue, oldValue) {
      if(newValue === true) {
        setTimeout(() => {
          this.$emit('update:showNotify', false)
          console.log('emitted');
        }, 3000);
      }
    }
  },
}
</script>

<style>
.modalNotifyContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  /* height: 100vh; */
  /* background: #0000008f; */
  display: flex;
  justify-content: center;
  align-items: top;
}

.modalNotify {
  margin-top: 20px;
  background-color: #29bb55;
  background-color: #67cc85;
  border-radius: 3px;
  padding: 10px 50px;
  display: flex;
  justify-content: center;
  align-items: top;
  /* min-width: 300px; */
  /* height: 50px; */
}

</style>
