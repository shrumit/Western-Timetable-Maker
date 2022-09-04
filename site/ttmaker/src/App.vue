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
        <li class="t_semesterTab" :class="{'is-active' : curSemester === 0 }" @click="changeSemester(0)"><a>FALL 2022</a></li>
        <li class="t_semesterTab" :class="{'is-active' : curSemester === 1 }" @click="changeSemester(1)"><a>WINTER 2023</a></li>
      </ul>
    </div>

    <article id="disclaimer" class="message is-info">
      <div class="message-body">
        Data last updated on <strong>{{ scrapeTime }}</strong>. Western Timetable Maker is not affiliated with the university.
      </div>
    </article>

    <!-- Body -->
    <div class="columns" :class="{'t_lowerFall': curSemester == 0, 't_lowerWinter': curSemester == 1}">
      <CourseSelection class="column is-5"/>
      <Results class="column"/>
    </div>

    <!-- Footer -->
    <footer id="footer">
      <strong>Western Timetable Maker</strong> is <a href="https://github.com/shrumit/Western-Timetable-Maker" target="_blank">open-source</a>.
    </footer>
  </div>
</div>
</template>

<script>
import CourseSelection from './components/CourseSelection.vue'
import Results from './components/Results.vue'

export default {
  name: 'app',
  components: {
    CourseSelection,
    Results
  },
  created() {
    this.$store.dispatch('loadMetadata');
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
    scrapeTime() {
      return this.$store.state.metadata.time
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
  border-radius: 3px;
}

#disclaimer {
  font-size: 0.8rem;
  // text-align: center;
}

#footer{
  text-align:center;
  padding-top: 4rem;
  font-size: 1rem;
}

#footer a {
  text-decoration: underline;
  white-space: nowrap;
}

.t_semesterTab.is-active {
  font-weight: 600;
}

.red {
  color: red;
  font-weight: bold;
}

@media (max-width: 1024px) {
  #t_bodyContainer {
    max-width: 99%;
    padding: 0.5rem;
  }
}
</style>
