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
      placeholder="Search for courses..."
      selectOnTab
      @input="focusOnAdd()"
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
        Potential timetables: {{ combinationsNum | toLocaleString }}
        <span v-if="combinationsNum > 10000000000">
          <br>
          Too many to compute! Reduce the number of selected sections.
        </span>
      </div>
    </article>
    
    <!-- Remove All button -->
    <button id="t_removeBtn" class="button is-danger is-small is-outlined" @click="removeAll">Remove All</button>
    
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
    // disableAdd() {
    //   return this.selected[this.curSemester] == null
    // },
    // addButtonTitle() {
    //   if (this.selected[this.curSemester] == null)
    //     return "Please select a course."
    //   else
    //     return ""
    // },
    disableCompute() {
      return this.$store.state.semester[this.curSemester].courseList.length == 0 ||
        this.combinationsNum > 10000000000;
    },
    computeLoading() {
      return this.$store.state.semester[this.curSemester].computeLoading
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
    focusOnAdd() {
      console.log('foa');
      // document.getElementById('t_addBtn').focus();
    },
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
}

</style>
