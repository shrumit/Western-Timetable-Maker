<template>
  <div>
    <h2 class="subtitle">Course Selection</h2>
    <!-- Search bar -->
    <div class="columns is-marginless">
      <v-select :filterBy="filter" class="column is-10 is-paddingless" v-model="selected" :options="options" :reduce="item => item.id" label="name" placeholder="Search for courses..." selectOnTab></v-select>
      <button class="column is-paddingless button is-dark is-outlined t_addBtn" v-on:click="fetchCourse">Add</button>
    </div>
    <hr class="hr">
    
    <!-- Selected courses -->
    <Course
      v-for="(course, index) in selectedCourses"
      v-bind:key="course.id"
      :courseIndex="index"
    />
    
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
    }
  },
  data() {
    return {
      selected: null
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
        courseId: this.selected
      })
    },
    removeCourse(index) {
      this.$store.commit('removeCourse', index)
    },
    filter(option, label, search) {
      if (search == null || label == null || search.length < 2) return false;
      return (label).toLowerCase().indexOf(search.toLowerCase()) > -1;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.t_addBtn {
  margin-left: 5px;
}
</style>
