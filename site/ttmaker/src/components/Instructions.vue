<template>
  <div v-show="curStep !== 2">
      <ol>
        <li :class="{'is-active' : curStep === 0 }">Select and add a course.</li>
        <li :class="{'is-active' : curStep === 1 }">Click "Generate Timetables" to compute conflict-free timetables!</li>
      </ol>
  </div>
</template>

<script>
export default {
  name: 'Instructions',
  computed: {
    curSemester() {
      return this.$store.state.curSemester
    },
    curStep() {
      if (this.$store.state.semester[this.curSemester].courseList.length == 0
        && this.$store.state.semester[this.curSemester].computeData.length == 0) {
        return 0
      }
      else if (this.$store.state.semester[this.curSemester].computeData.length == 0) {
        return 1
      }
      else {
        return 2
      }
    }
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
