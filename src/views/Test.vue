<template>
  <div>test</div>
  <TypingTest
    :text="text"
    :author="author"
    @testComplete="complete"
    ref="tTest"
  />
  <div ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import TypingTest from "../components/TypingTest.vue";

export default defineComponent({
  name: "Test",
  components: {
    TypingTest,
  },
  setup(props, {}) {
    const tTest = ref(null);
    const text = ref("");
    const author = ref("");
    onBeforeMount(async () => {
      await fetchQuote();
      tTest.value.reset();
    });
    const complete = async () => {
      console.log("finnnnnnnn");
      console.log(tTest);
      await fetchQuote();
      tTest.value.reset();
    };
    const fetchQuote = async () => {
      console.log("fetch quote");
      const rand = Math.random().toString(36).substring(7);
      let data;

      const result = await fetch(
        "https://api.paperquotes.com/apiv1/quotes/?minlength=200&maxlength=1000&limit=1&random=" +
          rand +
          "&order=?&lang=en",
        {
          method: "GET",
          headers: {
            Authorization: "Token aeb41416fb8b0237b783412adb67e45e78d4e473",
            "Content-Type": "application/json",
          },
        }
      );
      if (!result.ok) {
        data = {
          results: [
            {
              quote: "The quick brown fox jumps over the lazy dog.",
              author: "Joe Bob",
            },
          ],
        };
      } else {
        data = await result.json();
      }

      console.log(data);
      console.log(data.results[0].quote);
      console.log(data.results[0].author);
      author.value =
        data.results[0].author.trim().replace(/[^\x20-\x7E]/gim, "") || "";
      text.value = data.results[0].quote
        .trim()
        .replace(/[^\x20-\x7E]/gim, "")
        .replace(/\s\s.*$/gm, "")
        .replace(author.value, "");

      //loading.value = false;
    };
    return {
      complete,
      tTest,
      text,
      author,
    };
  },
});
</script>

<style scoped></style>
