<template>
  <div class="clearfix topInfo">
    <div class="left" id="author">&mdash; {{ author }}</div>
    <div class="right" id="wpm">
      <span id="score" :style="{ color: color }">{{ wordsPerMinute }}</span>
      <span id="unit">wpm</span>
    </div>
  </div>
  <div id="testWrap">
    <div
      v-html="preview"
      id="test-wrapper"
      :class="focused ? 'focused' : 'unfocused'"
    ></div>
    <div id="continue" v-if="completed">Press [ENTER] to begin a new test</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { Timer } from "./Timer";
import { auth, usersCollection, firebase } from "../firebase";

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

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
  emits: {
    testComplete: null,
  },
  setup(props, { emit }) {
    const reset = () => {
      currentWord.value = 0;
      currentLetter.value = 0;
      focused.value = true;
      completed.value = false;
      timer.value = new Timer();
      targetText.value = [];
      userText.value = [[]];
      started.value = false;
      setup();
    };
    const addScoreToDB = async () => {
      console.log(wordsPerMinute.value);
      const user = await getCurrentUser();
      if (user) {
        const uid = user.uid;
        console.log(user);
        await usersCollection.doc(uid).collection("tests").add({
          score: wordsPerMinute.value,
          errors: errors.value,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
    };
    const currentWord = ref(0);
    const currentLetter = ref(0);
    const focused = ref(true);
    const completed = ref(false);
    onMounted(() => {
      window.addEventListener("focus", function () {
        focused.value = true;
      });
      window.addEventListener("blur", function () {
        focused.value = false;
      });
      window.addEventListener("keypress", async function (ev) {
        if (ev.key === " " && !completed.value) {
          ev.preventDefault();
          if (currentLetter.value > 0) {
            const length = targetText.value[currentWord.value].length;
            if (currentLetter.value < length) {
              const difference = length - currentLetter.value;
              for (let k = 0; k < difference; k++) {
                userText.value[currentWord.value].push("_");
              }
            } else {
            }
            userText.value.push([]);
            currentWord.value++;
            currentLetter.value = 0;
          }
        } else if (ev.key === "Enter" && completed.value === true) {
          emit("testComplete");
        } else if (
          ev.key === "Backspace" &&
          (currentWord.value > 0 || currentLetter.value > 0) &&
          !completed.value
        ) {
          if (currentLetter.value > 0) {
            userText.value[currentWord.value].pop();
            currentLetter.value--;
          } else {
            userText.value.pop();
            currentWord.value--;
            currentLetter.value = userText.value[currentWord.value].length;
          }
        } else if (
          ev.key !== "Backspace" &&
          ev.key !== "Enter" &&
          !completed.value
        ) {
          currentLetter.value++;
          userText.value[currentWord.value].push(ev.key);
        }
        if (
          (currentWord.value === targetText.value.length - 1 &&
            currentLetter.value >=
              targetText.value[targetText.value.length - 1].length) ||
          currentWord.value > targetText.value.length - 1
        ) {
          if (completed.value === false) {
            console.log(currentWord.value);
            console.log(currentLetter.value);
            console.log("STOP");
            timer.value.end();
            completed.value = true;
            await addScoreToDB();
          }
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
    const setup = () => {
      const words = props.text.split(" ");
      for (let word of words) {
        const letters = word.split("");
        targetText.value.push(letters);
      }
    };
    setup();
    const color = computed(() => {
      if (completed.value) {
        return "#bb86fc";
      } else if (started.value) {
        return "#d7b7fd";
      } else {
        return "#f2e7fe";
      }
    });

    const errors = computed(() => {
      let errorCount = 0;
      if (started.value) {
        for (let i = 0; i < userText.value.length; i++) {
          for (let j = 0; j < userText.value[i].length; j++) {
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
      focused,
      reset,
      color,
      completed,
    };
  },
});
</script>

<style lang="scss">
@import "../scss/shared.scss";
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

.left {
  float: left;
}
#continue {
  text-align: center;
  margin-top: 20px;
}
.right {
  float: right;
}
#testWrap {
  background-color: $surface;
  padding: 40px;
}
#author {
  padding: 20px;
  color: #ffffff;
  padding-top: 35px;
}
#test-wrapper {
  overflow-wrap: anywhere;
  word-wrap: break-word;
  padding: 12px;
  font-size: 16px;
  line-height: 2;
  font-family: monospace;
  background-color: $surface;
  color: #bb86fc;
  border: 1px solid #575757;
  border-radius: 5px;
}
.topInfo {
  margin-top: 100px;
  margin-bottom: 20px;
}
#wpm {
  padding: 20px;
}
#score {
  margin-right: 6px;
  font-size: 28px;
  font-weight: 500;
}
#unit {
  text-transform: lowercase;
  font-weight: lighter;
  font-size: 24px;
}
.focused {
  background-color: #251f2c !important;
  border-color: #bb86fc !important;
}

// .unfocused {
//   border: 1px solid black;
// }
word {
  margin-right: 10px;
  display: inline-block;
}
letter {
  display: inline;
  margin-right: 2px;
}

.correct {
  color: #ffffff;
}

.incorrect {
  color: $error;
}

#cursor {
  font-weight: 100;
  color: #ffffff;
  animation: 1s blink step-end infinite;
  font-size: 20px;
}

@keyframes blink {
  from,
  to {
    color: #ffffff;
  }
  50% {
    color: transparent;
  }
}
</style>
