<template>
<div>
  <div id="t_bodyContainer" class="container box">
    <!-- Title -->
    <div style="text-align:center">
      <h1 class="title">Western Timetable Maker</h1>
    </div>
    
    <!-- Semester selection tab -->
    <div class="tabs is-boxed">
      <ul>
        <li class="t_semesterTab" :class="{'is-active' : curSemester === 0 }" @click="changeSemester(0)"><a>FALL 2020</a></li>
        <li class="t_semesterTab" :class="{'is-active' : curSemester === 1 }" @click="changeSemester(1)"><a>WINTER 2021</a></li>
      </ul>
    </div>

    <article id="disclaimer" class="message is-info">
      <div class="message-body">
        Although efforts have been made to ensure accuracy, this website is non-authoritative, provided without any warranty, and <strong>you must verify the validity of anything appearing on this website yourself</strong>.
      </div>
    </article>

    <!-- Body -->
    <div class="columns" :class="{'t_lowerFall': curSemester == 0, 't_lowerWinter': curSemester == 1}">
      <CourseSelection class="column is-5"/>
      <Results class="column"/>
    </div>

    <!-- Footer -->
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

// html {
// 	background-color: #eeeeee;
// 	animation-name: bgChange;
// 	animation-duration: 30s;
// 	animation-direction: alternate;
// 	animation-iteration-count: infinite;
// 	animation-timing-function: ease;
// 	animation-delay: 2s;
// }

// @keyframes bgChange {
// 	0% {background-color: #eeeeee}
// 	100% {background-color: $tt-western-purple}
// }

#t_bodyContainer {
  max-width: 98%;
  margin-top: 10px;
  padding: 2rem;
  // min-height: 1000px;
  border-radius: 0px;
}

#disclaimer {
  font-size: 0.8rem;
  // text-align: center;
}

#footer{
  text-align:center;
  padding-top: 5rem;
  font-size: 0.8rem;
}

@media (max-width: 1300px) {
  #t_bodyContainer {
    max-width: 100%;
    padding: 0.5rem;
    transition: 0.5s;
  }
}
</style>
