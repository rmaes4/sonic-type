<template>
  <div v-html="preview" id="test-wrapper"></div>
  <h1>{{ wordsPerMinute }} WPM</h1>
  Current word: {{ currentWord }} Current letter: {{ currentLetter }} Errors:
  {{ errors }}
  <br />
  {{ userText }}
  <br />
  {{ targetText }}
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { Timer } from "./Timer";

interface Word {
  letters: string[];
}

export default defineComponent({
  name: "TypingTest",
  props: {
    text: {
      type: String,
      required: true,
    },
    author: String,
  },
  setup(props) {
    //TODO: count premature space as error(s)
    const currentWord = ref(0);
    const currentLetter = ref(0);
    onMounted(() => {
      window.addEventListener("keypress", function (ev) {
        if (ev.key === " ") {
          userText.value.push([]);
          currentWord.value++;
          currentLetter.value = 0;
        } else if (
          ev.key === "Backspace" &&
          (currentWord.value > 0 || currentLetter.value > 0)
        ) {
          console.log(currentWord.value);
          console.log(currentLetter.value);
          if (currentLetter.value > 0) {
            userText.value[currentWord.value].pop();
            currentLetter.value--;
          } else {
            userText.value.pop();
            currentWord.value--;
            currentLetter.value = userText.value[currentWord.value].length;
          }
        } else if (ev.key !== "Backspace" && ev.key !== "Enter") {
          currentLetter.value++;
          userText.value[currentWord.value].push(ev.key);
        }
        if (
          (currentWord.value === targetText.value.length - 1 &&
            currentLetter.value >=
              targetText.value[targetText.value.length - 1].length - 1) ||
          currentWord.value > targetText.value.length - 1
        ) {
          console.log("STOP");
          timer.value.end();
        }
        if (started.value === false) {
          console.log("start");
          timer.value.start();
          started.value = true;
        }
      });
    });
    const timer = ref(new Timer());
    const targetText = ref<string[][]>([]);
    const userText = ref<string[][]>([[]]);
    const started = ref(false);
    const words = props.text.split(" ");
    for (let word of words) {
      const letters = word.split("");
      targetText.value.push(letters);
    }

    const errors = computed(() => {
      let errorCount = 0;
      if (started.value) {
        for (let i = 0; i < userText.value.length; i++) {
          for (let j = 0; j < userText.value[i].length; j++) {
            console.log(i);
            console.log(j);
            if (targetText.value[i] && targetText.value[i][j]) {
              if (targetText.value[i][j] !== userText.value[i][j]) {
                errorCount++;
              }
            } else {
              errorCount++;
            }
          }
        }
      }

      return errorCount;
    });

    const wordsPerMinute = computed(() => {
      let allTypedEntries = 0;
      for (let i = 0; i < userText.value.length; i++) {
        allTypedEntries += userText.value[i].length;
      }
      const words = allTypedEntries / 5;
      const wpm = Math.trunc(
        ((words - errors.value) / timer.value.elapsedTime) * 60
      );
      return wpm ? wpm : 0;
    });

    const preview = computed(() => {
      let letterClass = "";
      let output = "";
      for (let i = 0; i < targetText.value.length; i++) {
        output += "<word>";
        const userWordLetters = userText.value[i]?.length || 0;
        const targetWordLetters = targetText.value[i].length;
        // console.log(userWordLetters, targetWordLetters);
        if (userWordLetters >= targetWordLetters) {
          for (let j = 0; j < userWordLetters; j++) {
            if (userText.value[i] && userText.value[i][j]) {
              letterClass =
                userText.value[i][j] === targetText.value[i][j]
                  ? "correct"
                  : "incorrect";
            } else {
              letterClass = "";
            }
            output +=
              `<letter class="${letterClass}">` +
              userText.value[i][j] +
              "</letter>";

            if (i === currentWord.value && j === currentLetter.value - 1) {
              output += "<span id='cursor'>|</span>";
            }
          }
        } else {
          for (let j = 0; j < userWordLetters; j++) {
            if (userText.value[i] && userText.value[i][j]) {
              letterClass =
                userText.value[i][j] === targetText.value[i][j]
                  ? "correct"
                  : "incorrect";
            } else {
              letterClass = "";
            }
            if (i === currentWord.value && j === currentLetter.value) {
              output += "<span id='cursor'>|</span>";
            }
            output +=
              `<letter class="${letterClass}">` +
              userText.value[i][j] +
              "</letter>";
          }
          for (let j = userWordLetters; j < targetText.value[i].length; j++) {
            if (userText.value[i] && userText.value[i][j]) {
              letterClass =
                userText.value[i][j] === targetText.value[i][j]
                  ? "correct"
                  : "incorrect";
            } else {
              letterClass = "";
            }
            if (i === currentWord.value && j === currentLetter.value) {
              output += "<span id='cursor'>|</span>";
            }
            output +=
              `<letter class="${letterClass}">` +
              targetText.value[i][j] +
              "</letter>";
          }
        }
        output += "</word>";
      }
      return output;
    });
    return {
      currentWord,
      currentLetter,
      preview,
      userText,
      targetText,
      errors,
      wordsPerMinute,
    };
  },
});
</script>

<style>
#test-wrapper {
  width: 800px;
  overflow-wrap: anywhere;
  word-wrap: break-word;
  border: 1px solid black;
}
word {
  margin-right: 5px;
  display: inline-block;
}
letter {
  display: inline;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
}

#cursor {
  font-weight: 100;
  color: #2e3d48;
  animation: 1s blink step-end infinite;
  font-size: 30px;
}

@keyframes blink {
  from,
  to {
    color: black;
  }
  50% {
    color: transparent;
  }
}
</style>
