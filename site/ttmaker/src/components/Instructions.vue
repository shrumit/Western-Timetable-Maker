<template>
  <div>
      <ol>
        <li :class="{'is-active' : curStep === 0 }">Select and add a course.</li>
        <li :class="{'is-active' : curStep === 1 }">Click "Generate Timetables" to compute conflict-free timetables!</li>
      </ol>
  </div>
</template>

<script>
export default {
  name: 'Instructions',
  props: {
    curStep: Number,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles.scss';

div {
  padding: 2rem;
}

.is-active {
  font-weight: bold;
  color: $tt-western-purple;
}
</style>
