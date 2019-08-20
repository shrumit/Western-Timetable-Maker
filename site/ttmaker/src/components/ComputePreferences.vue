<template>
  <div>
    <h2 class="subtitle">Preferences</h2>
    <h3>{{ curSemester }}</h3>
  </div>
</template>

<script>

export default {
  name: 'ComputePreferences',
  computed: {
    curSemester() {
      return this.$store.state.curSemester
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
