<template>
  <div class="t_bodyContainer container box">
    <h1 class="title is-2">Western Timetable Maker</h1>
    <!-- Semester tab -->
    <div class="tabs is-centered">
      <ul>
        <li v-bind:class="{'is-active' : curSemester === 0 }" v-on:click="changeSemester(0)"><a>Fall 2019</a></li>
        <li v-bind:class="{'is-active' : curSemester === 1 }" v-on:click="changeSemester(1)"><a>Winter 2020</a></li>
      </ul>
    </div>
    <div class="columns">
      <CourseSelection class="column is-7"/>
      <ComputePreferences class="column"/>
    </div>
    
    <!-- Compute button -->
    <hr class="hr">
    <div style="text-align: center;">
      <button
      class="button is-large t_computeButton"
      v-bind:class="{'is-loading': computeLoading}"
      v-on:click="compute()"
      v-bind:disabled="disableCompute"> Compute!
      </button>
    </div>

  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import CourseSelection from './components/CourseSelection.vue'
import ComputePreferences from './components/ComputePreferences.vue'

export default {
  name: 'app',
  components: {
    ComputePreferences,
    CourseSelection
  },
  computed: {
    curSemester() {
      return this.$store.state.curSemester
    },
    disableCompute() {
      return this.$store.state.semester[this.curSemester].courseList.length == 0;
    },
    computeLoading() {
      return this.$store.state.semester[this.curSemester].computeLoading
    }
  },
  methods: {
    changeSemester(semesterId) {
      this.$store.commit('changeSemester', semesterId)
    },
    compute() {
      this.$store.dispatch('compute', this.curSemester)
    }
  }
}
</script>

<style>
@import '../node_modules/bulma/css/bulma.css';

html {
  background: aliceblue;
  /* background: mintcream; */
  /* background: linear-gradient(#e66465, #9198e5); */
  /* background: linear-gradient(lightpink, lightsteelblue);
  background-repeat: no-repeat;
  background-attachment: fixed; */
}

.t_bodyContainer {
  
}

.title {
  text-align: center;
  /* color: #807F83; */
}

.t_computeButton {
  color: #4F2683;
  border-color: #4F2683;
  background-color: white;
  /* background-color: #807F83; */
}
.t_computeButton:hover {
  color: white;
  background-color: #4F2683;
}
</style>
