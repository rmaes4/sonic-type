<template>
  <div>high scores</div>

  <h1>Average Score</h1>
  <ol>
    <li v-for="avgScore of avgScores" :key="avgScore.name">
      {{ avgScore.name }} - {{ avgScore.avgScore }}
    </li>
  </ol>
  <h1>Highest Score</h1>
  <ol>
    <li v-for="hScore of highestScores" :key="hScore.name">
      {{ hScore.name }} - {{ hScore.highestScore }}
    </li>
  </ol>
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

<style scoped></style>
