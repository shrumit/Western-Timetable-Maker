<template>
  <div>
    <h2>Courses</h2>
    
    <!-- Search bar -->
    <div>
      <v-select
      v-model="selected[curSemester]"
      :key="selected[curSemester]"
      :filterBy="filter"
      :options="options"
      :reduce="item => item.id"
      label="name"
      :placeholder="searchPlaceholder"
      selectOnTab
      >
      </v-select>
    </div>

    <!-- Add button -->
    <div style="text-align: right;">
      <button
        class="button is-dark is-rounded"
        @click="fetchCourse"
        :disabled="courseAlreadyAdded"
        >
          Add
      </button>
      <p v-if="courseAlreadyAdded" class="errorMsg">Course already in list</p>
    </div>

    <!-- Message box -->
    <article  class="message is-dark is-marginless">
      <div class="message-body">
        <!-- · Courses and sections without an assigned time slot will not appear.
        <br> -->
        · Please remove and re-add courses to get updated data.
        <!-- <br> -->
        <!-- · Potential timetables: {{ toLocaleString(combinationsNum) }} -->
      </div>
    </article>
    
    <!-- Reset button -->
    <div class="columns is-vcentered">
      <div class="column is-half">
        <button class="button is-danger is-small is-outlined" @click="removeAll">Reset All</button>
      </div>
    </div>

    <!-- Generate button -->
    <div id="t_computeButtonDiv">
      <button id="t_computeButton"
        class="button is-link is-rounded"
        :class="{'is-loading': computeLoading}"
        :disabled="disableCompute"
        @click="compute()">
          Generate Timetables
      </button>
      <p v-if="combinationsNum > 0">{{ toLocaleString(combinationsNum) }} possible combinations</p>
      <p v-if="combinationsNum > COMBINATIONS_LIMIT" class="errorMsg">
        Too many combinations to filter! Please de-select some sections manually or select fewer courses.
      </p>
      <p v-if="errorMsg.length" class="errorMsg">Error: {{ errorMsg }}</p>
    </div>

    <!-- Filters -->
    <h2>Filters</h2>
    <div class="columns is-variable is-1" style="margin:0px;">
      <div class="column">
        <v-select
        :options="campusTypes.filter(e => selectedCampusTypes.indexOf(e) < 0)"
        :value="selectedCampusTypes"
        @input="updateSelectedCampusTypes"
        placeholder="Any campus"
        multiple
        selectOnTab
        :searchable="false"
        :closeOnSelect="false"
        >
          <template #no-options>&nbsp;</template>
          <!-- <template #open-indicator>&nbsp;</template> -->
        </v-select>
      </div>
      <div class="column">
        <v-select
        :options="deliveryTypes.filter(e => selectedDeliveryTypes.indexOf(e) < 0)"
        :value="selectedDeliveryTypes"
        @input="updateSelectedDeliveryTypes"
        placeholder="Any delivery type"
        multiple
        selectOnTab
        :searchable="false"
        :closeOnSelect="false"
        >
          <template #no-options>&nbsp;</template>
        </v-select>
      </div>
    </div>
    <label class="checkbox" style="margin-bottom: 1rem;">
      <input type="checkbox" v-model="showFilteredOut">
      Show filtered sections in table
    </label>
    
    

    <!-- List of added courses -->
    <Course
    v-for="(course, index) in selectedCourses"
    :key="course.id"
    :curSemester="curSemester"
    :courseIndex="index"
    :showFilteredOut="showFilteredOut"
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
    searchPlaceholder() {
      if (this.$store.state.curSemester == 0) return 'Search for fall semester courses...'
      else if (this.$store.state.curSemester == 1) return 'Search for winter semester courses...'
      else return "Error"
    },
    options() {
      return this.$store.state.semester[this.curSemester].searchList
    },
    selectedCourses() {
      return this.$store.state.semester[this.curSemester].courseList
    },

    combinationsNum() {
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
        this.combinationsNum > this.COMBINATIONS_LIMIT;
    },
    computeLoading() {
      return this.$store.state.semester[this.curSemester].computeLoading
    },
    errorMsg() {
      return this.$store.state.semester[this.curSemester].errorMsg
    },
    courseAlreadyAdded() {
      return this.$store.state.semester[this.curSemester].courseList.some((e => e.id === this.selected[this.curSemester]));
    },
    campusTypes() {
      return this.$store.state.metadata.campusTypes
    },
    deliveryTypes() {
      return this.$store.state.metadata.deliveryTypes
    },
    selectedCampusTypes() {
      return this.$store.state.filters.selectedCampusTypes
    },
    selectedDeliveryTypes() {
      return this.$store.state.filters.selectedDeliveryTypes
    }
  },
  data() {
    return {
      COMBINATIONS_LIMIT: 15000000000,
      selected: [null,null],
      showFilteredOut: false
    }
  },
  created() {
    this.$store.dispatch('loadSearch')
  },
  methods: {
    fetchCourse() {
      this.$store.dispatch('fetchCourse', {
        semesterId: this.curSemester,
        courseId: this.selected[this.curSemester]
      })
      this.selected[this.curSemester] = null
    },
    removeCourse(index) {
      this.$store.commit('removeCourse', index)
    },
    filter(option, label, search) {
      // don't show results until more than 2 characters typed
      if (search == null || label == null || search.length < 2) return false;
      return (label).toLowerCase().indexOf(search.toLowerCase()) > -1;
    },
    compute() {
      this.$store.dispatch('compute', this.curSemester)
    },
    removeAll() {
      this.$store.dispatch('resetSemester', this.curSemester)
    },
    updateSelectedCampusTypes(value) {
      this.$store.commit('updateSelectedCampusTypes', value)
    },
    updateSelectedDeliveryTypes(value) {
      this.$store.commit('updateSelectedDeliveryTypes', value)
    },
    toLocaleString(n) {
      return n.toLocaleString()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* @import '../styles.scss'; */

button {
  margin-top: 10px;
  margin-bottom: 10px;
  min-width: 8em;
}

#patience {
  opacity: 0;
}

#patience.is-loading {
  opacity: 1;
  transition: opacity 4s;
  transition-delay: 2s;
}

.campusLabel {
  margin-right: 5px;
}

#t_computeButtonDiv {
  text-align: center;
}

#t_computeButton {
  margin: 0px;
  box-shadow: 0px 13px 10px -10px rgba(0,0,0,0.4);
}

</style>
