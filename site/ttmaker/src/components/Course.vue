<template>
  <div>
    <div class="message is-unselectable t_courseBox">
      
      <!-- Accordian title -->
      <div class="message-header t_courseTitle" v-on:click="toggleExpand">
        <p v-show="!expanded">⋮</p>
        <p v-show="expanded">⋯</p>
        {{ this.course.name }}
        <button class="button is-danger is-small t_courseRemove" v-on:click="remove">✖</button>
      </div>
      
      <!-- Accordian body -->
        <table v-show="expanded" class="message-body t_courseBody table">
          <tbody>
            <tr v-for="(comp, compIndex) in this.course.components" style="background: whitesmoke;">
              <!-- Comp selection -->
              <th
              v-on:click="toggleComponent(compIndex)"
              class="t_comp"
              v-bind:class="{ 't_compSelected': comp.selected }"
              >
                <input type="checkbox" class="checkbox" v-bind:checked="comp.selected">
                {{ comp.name }}
              </th>
              <!-- Section selection -->
              <td style="background: none;">
                <table class="table t_sectionTable">
                  <tr class="t_sectionRowHeader" v-bind:class="{'t_sectionRowDisable': !comp.selected}">
                    <th></th>
                    <th>Section</th>
                    <th>Class Nbr</th>
                    <th>Location</th>
                    <th>Instructor</th>
                    <th>Time</th>
                  </tr>
                  <tr
                  v-for="(section, sectionIndex) in comp.sections"
                  v-on:click="toggleSection(compIndex, sectionIndex)"
                  class="t_sectionRow"
                  v-bind:class="{ 't_sectionRowSelected': section.selected , 't_sectionRowDisable': !comp.selected}"
                  v-bind:title="'Class Nbr: ' + section.number"
                  >
                    <td><input type="checkbox" class="checkbox" v-bind:checked="section.selected"></td>
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
      <!-- </div> -->
    </div>
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
    // timeString() {
    //   let days = ["M", "Tu", "W", "Th", "F"]
    //   str = ''
    //   for (let i = 0; i < 5; i++) {
    //     let t = this.course.timebits[i]
    //     if (t == 0)
    //       continue
    //
    //     // calculate string representation of timebit
    //     let intervals = 0
    //     while (t % 2 != 1) {
    //       t = t >> 1
    //       intervals++
    //     }
    //     str += days[i]
    //     if (intervals > 10) { // PM
    //       intervals -= 10;
    //       str += intervals/2  + ':'// hour
    //       str += intervals%2 == 0 ? '00' : '30' // minute
    //       str += "PM"
    //     } else { // AM
    //       str += (intervals/2 + 7) + ':' // hour
    //       str += intervals%2 == 0 ? '00' : '30' // minute
    //       str += "AM"
    //     }
    //     str += ","
    //   }
    //
    //   str = str.slice(0, -1) // remove trailing comma
    //   return str
    // }
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.t_courseRemove {
  /* width: 50px; */
}
.t_courseBox {
  margin-bottom: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}
.t_courseTitle {
  font-weight: normal;
  cursor: pointer;
  /* background: peru; */
  /* background: #363636; */
  /* background: slategrey; */
  max-height: 40px;
  /* box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24); */
  border-radius: 4px 4px 4px 4px;
}

.t_courseTitle:hover {
  opacity: 0.93;
}
.t_courseTitle:hover p {
  color:#00d1b2;
}
.t_courseBody {
  border-radius: 0 0 4px 4px;
}

.t_comp {
  /* text-decoration: line-through; */
}

.t_compSelected {
  text-decoration: none;
  background: lightcyan;
}

.t_sectionName {
  padding-left: 10px;
  text-decoration: underline;
}

.t_sectionRow {
  opacity: 0.7;
  cursor: pointer;
}

.t_sectionRowSelected:hover {
  /* opacity: 0.5; */
  text-decoration: line-through;
}

/* .t_sectionRow:active {
  opacity: 0.7;
} */

.t_sectionRowSelected, .t_sectionRowHeader {
  opacity: 1;
  background: beige;
  color: #363636;
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
