<template>
    <div class="message is-marginless is-dark t_courseDiv">
      <!-- Accordian title -->
      <div class="message-header t_courseTitle" @click="toggleExpand">
        <p class="t_openSymbol" v-show="!expanded">+&nbsp;</p>
        <p class="t_openSymbol" v-show="expanded">−&nbsp;</p>
        {{ this.course.name }}
        <div class="t_colorSquare" :style="{'background-color': this.course.color}"></div>
        <a class="delete is-medium t_courseRemove" @click="remove"></a>
      </div>
      
      <!-- Accordian body -->
      <table v-show="expanded" class="message-body table">
        <tbody>
          <tr>
            <td></td>
            <td style="display:flex; justify-content: space-around;">
              <a :href="timetableLink" target="_blank">View in Academic Timetable</a>&emsp;
              <a :href="calendarLink" target="_blank">View in Academic Calendar</a>
            </td>
          </tr>
          <tr v-for="(comp, compIndex) in this.course.components" :key="compIndex">
            <!-- Component selection -->
            <th
            class="t_comp"
            :class="{ 't_compSelected': comp.selected }"
            @click="toggleComponent(compIndex)"
            >
              <input type="checkbox" class="checkbox" :checked="comp.selected">
              {{ comp.name }}
            </th>
            <!-- Section selection -->
            <td>
              <table class="table t_sectionTable">
                <tr class="t_sectionRowHeader" :class="{'t_sectionRowDisable': !comp.selected}">
                  <th>
                    Section
                    <br>
                    <button @click="selectAllInComp(compIndex)" class="button is-small is-text">Select All</button>
                    <br>
                    <button @click="deselectAllInComp(compIndex)" class="button is-small is-text">Deselect All</button>
                  </th>
                  <!-- <th>Section</th> -->
                  <th>Class Nbr</th>
                  <th>Location</th>
                  <th>Instructor</th>
                  <th>Campus</th>
                  <th>Time</th>
                </tr>
                <tr
                v-for="(section, sectionIndex) in comp.sections"
                class="t_sectionRow"
                :class="{ 't_sectionRowSelected': section.selected , 't_sectionRowDisable': !comp.selected}"
                :title="section.timeFull"
                :key="sectionIndex"
                @click="toggleSection(compIndex, sectionIndex)"
                >
                  <td><input type="checkbox" class="checkbox" :checked="section.selected"> {{ section.name }}</td>
                  <!-- <td></td> -->
                  <td>{{ section.number }}</td>
                  <td>{{ section.location }}</td>
                  <td>{{ section.instructor }}</td>
                  <td>{{ section.campus }}</td>
                  <td>{{ section.timeShort }}</td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>

export default {
  name: 'Course',
  props: {
    courseIndex: Number
  },
  data() {
    return {
      expanded: false,
      counter: 0
    }
  },
  computed: {
    curSemester() {
      return this.$store.state.curSemester
    },
    course() {
      return this.$store.state.semester[this.curSemester].courseList[this.courseIndex]
    },
    timetableLink() {
      let sub = this.course.name.split(' ')[0]
      let num = this.course.name.split(' ')[1]
      return `https://studentservices.uwo.ca/secure/timetables/mastertt/ttindex.cfm?subject=${sub}&catalognbr=${num}`
    },
    calendarLink() {
      let sub = this.course.name.split(' ')[0]
      return `http://www.westerncalendar.uwo.ca/Courses.cfm?Subject=${sub}`
      //+ sub
      //+ '&SelectedCalendar=Live&ArchiveID='
    }
  },
  methods: {
    remove() {
      this.$store.commit('removeCourse', {
        semesterId: this.curSemester,
        courseIndex: this.courseIndex
      })
    },
    toggleExpand() {
      this.expanded = !this.expanded
      this.counter++
    },
    toggleSection(compIndex, sectionIndex) {
      this.$store.commit('toggleSection', {
        semesterId: this.curSemester,
        courseIndex: this.courseIndex,
        compIndex: compIndex,
        sectionIndex: sectionIndex
      })
    },
    toggleComponent(compIndex) {
      this.$store.commit('toggleComponent', {
        semesterId: this.curSemester,
        courseIndex: this.courseIndex,
        compIndex: compIndex
      })
    },
    selectAllInComp(compIndex) {
      this.$store.commit('setAllSelectedInComponent', {
        semesterId: this.curSemester,
        courseIndex: this.courseIndex,
        compIndex: compIndex,
        selected: true
      })
    },
    deselectAllInComp(compIndex) {
      this.$store.commit('setAllSelectedInComponent', {
        semesterId: this.curSemester,
        courseIndex: this.courseIndex,
        compIndex: compIndex,
        selected: false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../styles.scss';

.t_courseDiv {
  overflow: auto;
  // max-height: 90vh;
}

.t_courseRemove:hover {
  background: $danger;
}

.message {
  margin-bottom: 3px !important;
}

.t_courseTitle {
  cursor: pointer;
  border-radius: 4px 4px 4px 4px;
}
.t_courseTitle:hover {
  background: darken($dark,2.5%) !important;
}

.t_openSymbol {
  font-weight: $tt-bold-weight;
}
// .t_courseTitle:hover .t_openSymbol {
//   color:limegreen !important;
// }

.t_comp {
  text-decoration: line-through;
  cursor:pointer;
}
.t_compSelected {
  text-decoration: none;
  background: $tt-course-comp;
}

.t_sectionRow {
  cursor: pointer;
  background:$tt-course-section;
  opacity: 0.6;
}

.t_sectionRowSelected, .t_sectionRowHeader {
  opacity: 1;
  background: $tt-course-section;
}

.t_sectionRow:hover {
  background: darken($tt-course-section, 2.5%);
}

.t_sectionRowDisable {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.t_sectionTable, .t_sectionTable td, .t_sectionTable th {
  border:solid lightgrey 1px;
  padding: 3px !important;
}

.t_colorSquare {
  min-height: 1rem;
  min-width: 1.5rem;
  border-radius: 2px;
  margin-right: 0.75rem;
  margin-left: auto;
}

</style>