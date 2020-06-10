<template>
<div>
  <div id="t_bodyContainer" class="container box" :class="{'cursorNotAllowed': demoReelActive}">
    <div style="text-align:center">
    <h1 class="title is-2">Western Timetable Maker</h1>
    </div>
    
    <!-- Semester tab -->
    <div class="tabs is-boxed">
      <ul>
        <li class="t_semesterTab" :class="{'is-active' : curSemester === 0 }" @click="changeSemester(0)"><a>Fall 2020</a></li>
        <li class="t_semesterTab" :class="{'is-active' : curSemester === 1 }" @click="changeSemester(1)"><a>Winter 2021</a></li>
      </ul>
    </div>
    <!-- <button @click="runDemoReel()" class="button">Demo</button> -->
    <div class="columns" :class="{'t_lowerFall': curSemester == 0, 't_lowerWinter': curSemester == 1}">
      <CourseSelection class="column is-6"/>
      <Results class="column"/>
    </div>
    <footer id="footer">
      <strong>Western Timetable Maker</strong> is free and <a href="https://github.com/shrumit/Western-Timetable-Maker" target="_blank">open-source</a>.
    </footer>
  </div>
</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import CourseSelection from './components/CourseSelection.vue'
import Results from './components/Results.vue'

export default {
  name: 'app',
  components: {
    CourseSelection,
    Results
  },
  computed: {
    curSemester() {
      return this.$store.state.curSemester
    },
    hasComputeData(){
      return this.$store.state.semester[this.curSemester].computeData && this.$store.state.semester[this.curSemester].computeData.length > 0
    },
    computeData(){
      return {tables: this.$store.state.semester[this.curSemester].computeData}
    },
    demoReelActive() {
      return this.$store.state.semester[this.curSemester].demoReelActive
    }
  },
  methods: {
    changeSemester(semesterId) {
      this.$store.commit('changeSemester', semesterId)
    },
    runDemoReel() {
      this.$store.dispatch('demoReel', this.curSemester)
    }
  }
}
</script>

<style lang="scss">
@import './styles.scss';

html {
  background: lightslategray;
  background: #4F2683;
}
.cursorNotAllowed {
  cursor: not-allowed;
}
html, body, button, input {
  font-family: 'Open Sans', sans-serif;
}
input {
}
#t_bodyContainer {
  max-width: 90%;
  margin-top: 10px;
  padding: 2rem;
  /* min-height: 1000px; */
}
.title {
  text-align: center;
  /* font-weight: normal !important; */
  /* font-size: 3rem !important; */
  font-family: 'Neuton', serif;
}
.subtitle {
  color: lightslategrey;
}
.t_semesterTab {
  
}
#footer{
  text-align:center;
  padding-top: 5rem;
  font-size: 0.8rem;
}
@media (max-width: 1200px) {
  #t_bodyContainer {
    max-width: 98%;
    padding: 0.5rem;
    transition: 0.5s;
  }
}
</style>
