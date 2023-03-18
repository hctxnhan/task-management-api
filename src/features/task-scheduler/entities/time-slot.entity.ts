export class TimeSlot {
  start: Date;
  end: Date;
  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }

  get isValid() {
    return this.end.getTime() - this.start.getTime() > 0;
  }

  get duration() {
    return this.end.getTime() - this.start.getTime();
  }
}
