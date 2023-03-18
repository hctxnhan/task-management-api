import { TimeSlot } from '../entities/time-slot.entity';

export function checkIfTwoTimeRangeOverlap(
  timeRange1: TimeSlot,
  timeRange2: TimeSlot,
) {
  const earlierTimeSlot =
    timeRange1.start.getTime() < timeRange2.start.getTime()
      ? timeRange1
      : timeRange2;
  const laterTimeSlot =
    timeRange1.start.getTime() < timeRange2.start.getTime()
      ? timeRange2
      : timeRange1;

  return earlierTimeSlot.end.getTime() - laterTimeSlot.start.getTime() > 0;
}
