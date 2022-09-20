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
        <li class="t_semesterTab" :class="{'is-active' : semester === 0 }" @click="semester=0"><a>FALL 2022</a></li>
        <li class="t_semesterTab" :class="{'is-active' : semester === 1 }" @click="semester=1"><a>WINTER 2023</a></li>
      </ul>
    </div>

    <article id="disclaimer" class="message is-info">
      <div class="message-body">
        Data last updated on <strong>{{ scrapeTime }}</strong>. Western Timetable Maker is not affiliated with the university.
      </div>
    </article>

    <!-- Body -->
    <div class="columns" v-show="semester === 0">
      <CourseSelection :semester="0" class="column is-5"/>
      <Results :semester="1" class="column"/>
    </div>
    <div class="columns" v-show="semester === 1">
      <CourseSelection :semester="1" class="column is-5"/>
      <Results :semester="1" class="column"/>
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
  data() {
    return { semester: 0 }
  },
  created() {
    this.$store.dispatch('loadMetadata')
  },
  computed: {
    hasComputeData(){
      return this.$store.state.semester[this.semester].computeData && this.$store.state.semester[this.semester].computeData.length > 0
    },
    computeData(){
      return {tables: this.$store.state.semester[this.semester].computeData}
    },
    scrapeTime() {
      return this.$store.state.metadata.time
    }
  },
  methods: {
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

h2 {
  font-size: 1.25rem;
}

h3 {
  font-size: 1.1rem;
}

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

.errorMsg {
  color: $danger;
}
</style>
