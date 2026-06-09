<template>
  <div>
    <h2 class="subtitle">Results</h2>

    <article v-if="validCount != null" class="message is-dark is-marginless">
      <div class="message-body">
        · Conflict-free combinations: {{ formattedValidCount }}
        <span v-if="validCount == 0" class="t_nonePossible">
          <br>
          · Sorry, no conflict-free timetables found!
        </span>
        <br>
        · Processed in: {{ formattedTimeTaken }}s
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

<script setup>
import { computed, ref } from 'vue'
import Instructions from './Instructions.vue'
import Table from './Table.vue'
import { useStore } from '../store.js'

defineOptions({
  name: 'Results'
})

const store = useStore()
const selectedIdx = ref(0)

const curSemester = computed(() => store.curSemester)
const computeData = computed(() => store.semester[curSemester.value].computeData)
const validCount = computed(() => computeData.value.info ? Number(computeData.value.info.validCount) : null)
const timeTaken = computed(() => computeData.value.info ? Number(computeData.value.info.timeTaken)/1000 : null)
const formattedValidCount = computed(() => validCount.value != null ? validCount.value.toLocaleString() : null)
const formattedTimeTaken = computed(() => timeTaken.value != null ? timeTaken.value.toLocaleString() : null)

function changeTab(tabIdx) {
  selectedIdx.value = tabIdx
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@use '../theme' as *;

.t_nonePossible {
  color: $danger;
}
.is-active {
  font-weight: bold;
}
</style>
