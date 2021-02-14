export class Timer {
  timer: number;
  elapsedTime: number;
  startTime: number;

  constructor() {
    this.timer = 0;
    this.elapsedTime = 0;
    this.startTime = 0;
  }

  start() {
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      this.elapsedTime = (Date.now() - this.startTime) / 1000;
    }, 1000);
  }

  end() {
    clearInterval(this.timer);
  }
}
