<template>
    <div class="message is-unselectable t_courseBox">
      <!-- Accordian title -->
      <div class="message-header t_courseTitle" @click="toggleExpand">
        <p v-show="!expanded">➕</p>
        <p v-show="expanded">➖</p>
        {{ this.course.name }}
        <a class="delete is-medium t_courseRemove" @click="remove"></a>
      </div>
      
      <!-- Accordian body -->
      <table v-show="expanded" class="message-body t_courseBody table">
        <tbody>
          <tr>
            <td></td>
            <td style="text-align:center;">
              <a :href="timetableLink" target="_blank">See in Academic Timetable🡵</a>&emsp;
              <a :href="calendarLink" target="_blank">See in Academic Calendar🡵</a>
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
                    <button @click="selectAllInComp(compIndex)" class="button is-small is-text">Select All</button>
                    <button @click="deselectAllInComp(compIndex)" class="button is-small is-text">Deselect All</button>
                  </th>
                  <th>Section</th>
                  <th>Class Nbr</th>
                  <th>Location</th>
                  <th>Instructor</th>
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
                  <td><input type="checkbox" class="checkbox" :checked="section.selected"></td>
                  <td>{{ section.name }}</td>
                  <td>{{ section.number }}</td>
                  <td>{{ section.location }}</td>
                  <td>{{ section.instructor }}</td>
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
      return 'https://studentservices.uwo.ca/secure/timetables/mastertt/ttindex.cfm?subject='
      + sub
      + '&Designation=Any&catalognbr='
      + num
      + '&CourseTime=All&Component=All&time=&end_time=&day=m&day=tu&day=w&day=th&day=f&Campus=Any&command=search'
    },
    calendarLink() {
      let sub = this.course.name.split(' ')[0]
      return 'http://www.westerncalendar.uwo.ca/Courses.cfm?Subject='
      + sub
      + '&SelectedCalendar=Live&ArchiveID='
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
<style scoped>
.t_courseRemove:hover {
  background: red;
}
.t_courseBox {
  margin-bottom: 5px !important;
  margin-top: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
.t_courseTitle {
  font-weight: normal;
  cursor: pointer;
  background: silver;
  color: black;
  max-height: 40px;
  border-radius: 4px 4px 4px 4px;
}

.t_courseTitle:hover {
  opacity: 0.93;
}
.t_courseTitle:hover p {
  color:limegreen;
}
.t_courseTitle p {
  /* font-weight: bold; */
}
.t_courseBody {
  background: whitesmoke;
  border-radius: 0 0 4px 4px;
}

.t_comp {
  text-decoration: line-through;
}

.t_compSelected {
  text-decoration: none;
  background: azure;
}

.t_sectionName {
  padding-left: 10px;
  text-decoration: underline;
}

.t_sectionRow {
  opacity: 0.7;
  cursor: pointer;
  background: beige;
  /* text-decoration: line-through; */
}

.t_sectionRowSelected:hover {
  opacity: 0.8;
  /* text-decoration: line-through; */
}

.t_sectionRowSelected, .t_sectionRowHeader {
  opacity: 1;
  background: beige;
  color: #363636;
  text-decoration: none;
}

.t_sectionRowDisable {
  opacity: 0.2;
  cursor: not-allowed;
  pointer-events: none;
}

.t_sectionTable {
  border-collapse:separate;
  border:solid lightgrey 1px;
  border-radius:6px;
  -moz-border-radius:6px;
}

.t_sectionTable td, .t_sectionTable th {
  padding: 0.3em !important;
  border-left: solid lightgrey 1px;
  border-top: solid lightgrey 1px;
}

.t_sectionTable th {
  border-top: none;
}

.t_sectionTable td:first-child, .t_sectionTable th:first-child {
  border-left: none;
}

</style>
