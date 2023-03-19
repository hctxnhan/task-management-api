export class Time {
  private hours: number;
  private minutes: number;

  constructor(hours: number, minutes: number) {
    this.hours = hours;
    this.minutes = minutes;
  }

  public getHours(): number {
    return this.hours;
  }

  public getMinutes(): number {
    return this.minutes;
  }

  public toString(): string {
    const hours = this.hours.toString().padStart(2, '0');
    const minutes = this.minutes.toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  get duration(): number {
    return this.hours * 60 + this.minutes;
  }

  public static fromString(time: string): Time {
    const [hours, minutes] = time.split(':');
    return new Time(+hours, +minutes);
  }

  public static fromDate(date: Date): Time {
    return new Time(date.getHours(), date.getMinutes());
  }

  public static compare(time1: Time, time2: Time): number {
    if (time1.hours === time2.hours) {
      return time1.minutes - time2.minutes;
    }
    return time1.hours - time2.hours;
  }
}
