<template>
  <div id="hsWrap" class="clearfix">
    <div class="left">
      <h1>Average Score</h1>
      <ol>
        <li v-for="avgScore of avgScores" :key="avgScore.name">
          {{ avgScore.name }} - {{ avgScore.avgScore }} wpm
        </li>
      </ol>
    </div>
    <div class="right">
      <h1>Highest Score</h1>
      <ol>
        <li v-for="hScore of highestScores" :key="hScore.name">
          {{ hScore.name }} - {{ hScore.highestScore }} wpm
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { usersCollection } from "../firebase";

export default defineComponent({
  setup() {
    const userData = ref([]);
    onMounted(async () => {
      const users = await usersCollection.get();
      users.forEach((snapshot) => {
        const data = snapshot.data();
        userData.value.push({
          name: data.name,
          avgScore: data.avgScore,
          highestScore: data.highestScore,
        });
      });
    });
    const avgScores = computed(() => {
      return userData.value.sort((a, b) => (a.avgScore < b.avgScore ? 1 : -1));
    });
    const highestScores = computed(() => {
      return userData.value.sort((a, b) =>
        a.highestScore < b.highestScore ? 1 : -1
      );
    });
    return { userData, avgScores, highestScores };
  },
});
</script>

<style lang="scss">
@import "../scss/shared.scss";
#hsWrap {
  background-color: $surface;
  padding: 100px;
}
h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
ol {
  list-style: decimal;
}
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

.left {
  float: left;
}

.right {
  float: right;
}
</style>
