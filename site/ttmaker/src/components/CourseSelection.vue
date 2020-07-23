<template>
  <div>
    <h2 class="subtitle">Courses</h2>
    <!-- <button class="button" @click="loadTest">Load Test</button> -->
    
    <!-- <p>Courses and sections without timeslots will not appear</p> -->

    <!-- Search bar -->
    <div class="">
      <v-select
      v-model="selected[curSemester]"
      :key="selected[curSemester]"
      :filterBy="filter"
      :options="options"
      :reduce="item => item.id"
      label="name"
      :placeholder="searchPlaceholder"
      selectOnTab
      transition=""
      >
      </v-select>
    </div>
    
    <!-- Add button -->
    <div style="text-align: right;">
      <button id="t_addBtn" class="button is-dark is-rounded" @click="fetchCourse">Add</button>
    </div>
    
    <!-- Message box -->
    <article  class="message is-dark is-marginless" :class="{'is-danger': combinationsNum > 10000000000 }">
      <div class="message-body">
        - Classes without an assigned timeslot will not appear.
        <br>
        - Remove and re-add courses to get updated section data.
        <br>
        Potential timetables: {{ combinationsNum | toLocaleString }}
        <span v-if="combinationsNum > 10000000000">
          <br>
          Too many to compute! Reduce the number of selected sections.
        </span>
      </div>
    </article>
    
    <div class="columns is-vcentered">
      <div class="column is-one-fifth">
        <!-- Remove All button -->
        <button id="t_removeBtn" class="button is-danger is-small is-outlined" @click="removeAll">Remove All</button>
      </div>
      <!--
      <div class="column" style="text-align: right">
        <strong>Campus: </strong>
        <label class="checkbox campusLabel">
          <input type="checkbox"> Main
        </label>
        <label class="checkbox campusLabel">
          <input type="checkbox"> Huron
        </label>
        <label class="checkbox campusLabel">
          <input type="checkbox"> Brescia
        </label>
        <label class="checkbox campusLabel">
          <input type="checkbox"> King's
        </label>
      </div>
      -->
    </div>

    <!-- List of added courses -->
    <Course
    v-for="(course, index) in selectedCourses"
    :key="course.id"
    :courseIndex="index"
    />
    
    <!-- Compute button -->
    <div style="text-align: center;">
      <button
      id="t_computeButton"
      class="button is-link is-rounded"
      :class="{'is-loading': computeLoading}"
      :disabled="disableCompute"
      @click="compute()"
      >
        Compute!
      </button>
      <p v-if="errorMsg.length" id="errorMsg">Error: {{ errorMsg }}</p>
      <p :class="{'is-loading': computeLoading}" id="patience">Patience is a virtue.</p>
    </div>

  </div>
</template>

<script>
import Course from './Course.vue'

export default {
  name: 'CourseSelection',
  components: {
    Course
  },
  computed: {
    curSemester() {
      return this.$store.state.curSemester
    },
    searchPlaceholder() {
      if (this.$store.state.curSemester == 0) return 'Search for Fall and full year courses...'
      else if (this.$store.state.curSemester == 1) return 'Search for Winter and full year courses...'
      else return "Error"
    },
    options() {
      return this.$store.state.semester[this.curSemester].searchList
    },
    selectedCourses() {
      return this.$store.state.semester[this.curSemester].courseList
    },
    combinationsNum(){
      if (!this.$store.state.semester[this.curSemester].courseList || this.$store.state.semester[this.curSemester].courseList.length == 0) 
        return 0;

      let n = 1;
      this.$store.state.semester[this.curSemester].courseList.forEach(function(course) {
        course.components.forEach(function(comp){
          if (!comp.selected) return;
          let s = comp.sections.filter(x => x.selected).length
          if (s>0) n *= s
        })
      })
      return n
      // return JSON.stringify(this.$store.state.semester[this.curSemester].courseList)
    },
    disableCompute() {
      return this.$store.state.semester[this.curSemester].courseList.length == 0 ||
        this.combinationsNum > 10000000000;
    },
    computeLoading() {
      return this.$store.state.semester[this.curSemester].computeLoading
    },
    errorMsg() {
      return this.$store.state.semester[this.curSemester].errorMsg
    }
  },
  data() {
    return {
      selected: [null,null]
    }
  },
  created() {
    this.$store.dispatch('loadSearch');
  },
  methods: {
    fetchCourse() {
      // console.log('fetchCourse:' + this.selected)
      this.$store.dispatch('fetchCourse', {
        semesterId: this.curSemester,
        courseId: this.selected[this.curSemester]
      })
      // Vue.set(this.selected,this.curSemester,null)
      this.selected[this.curSemester] = null
    },
    removeCourse(index) {
      this.$store.commit('removeCourse', index)
    },
    filter(option, label, search) {
      // don't show results until more than 1 characters typed
      if (search == null || label == null || search.length < 2) return false;
      return (label).toLowerCase().indexOf(search.toLowerCase()) > -1;
    },
    loadTest() {
      this.$store.dispatch('loadTest', {semesterId: this.curSemester})
    },
    compute() {
      this.$store.dispatch('compute', this.curSemester)
    },
    removeAll() {
      this.$store.dispatch('resetSemester', this.curSemester)
    }
  },
  filters: {
    toLocaleString(n) {
      return n.toLocaleString()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

button {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 8em;
}

#patience {
  opacity: 0;
}

#patience.is-loading {
  opacity: 1;
  transition: opacity 4s;
  transition-delay: 2s;
}

#errorMsg {
  color: darkorange;
}

.campusLabel {
  margin-right: 5px;
}

</style>
