<template>
  <div>
    <h2>Results</h2>

    <article v-if="validCount != null" class="message is-dark is-marginless">
      <div class="message-body">
        · Conflict-free combinations: {{ validCount | toLocaleString }}
        <span v-if="validCount == 0" class="t_nonePossible">
          <br>
          · Sorry, no conflict-free timetables found!
        </span>
        <br>
        · Processed in: {{ timeTaken | toLocaleString }}s
      </div>
    </article>

    
    <!-- Sorting scheme tabs -->
    <div class="tabs is-centered">
      <ul>
        <li
        v-for="(scheme, schemeIdx) in computeData.schemes"
        :class="{'is-active' : selectedIdx === schemeIdx }"
        :key="schemeIdx"
        @click="changeTab(schemeIdx)"
        >
          <a>{{ scheme.type }}</a>
        </li>
      </ul>
    </div>

    <Instructions />
    
    <!-- Tables -->
    <div
    v-for="(tab,tabIndex) in computeData.schemes"
    v-show="selectedIdx === tabIndex"
    class="t_tablesWrapper"
    :key="tabIndex"
    >
      <Table v-for="(table,tableIndex) in tab.tables" :table="table" :key="tableIndex" />
    </div>
  </div>
</template>

<script>
import Instructions from './Instructions.vue'
import Table from './Table.vue'

export default {
  name: 'Results',
  components: {
    Table,
    Instructions
  },
  data: function(){
    return {
      selectedIdx: 0
    }
  },
  computed: {
    curSemester() {
      return this.$store.state.curSemester
    },
    coursecomp(){
      return this.$store.state.semester[this.curSemester].coursecomp
    },
    computeData(){
      return this.$store.state.semester[this.curSemester].computeData
    },
    validCount() {
      return this.computeData.info ? Number(this.computeData.info.validCount) : null
    },
    timeTaken() {
      return this.computeData.info ? Number(this.computeData.info.timeTaken)/1000 : null
    }
  },
  methods: {
    changeTab(tabIdx) {
      this.selectedIdx = tabIdx
    }
  },
  filters: {
    toLocaleString(n) {
      return n != null ? n.toLocaleString() : null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '../styles.scss';

.t_nonePossible {
  color: $danger;
}
.is-active {
  font-weight: bold;
}
</style>
