import { Task } from '@/entities/task.entity';

export function getTaskScore(task: Task) {
  const categoryPriorityWeight = 4;
  const priorityWeight = 3;

  const dueDateWeight = [
    {
      weight: 7,
      limit: 1 / 24, // 1 hour
    },
    {
      weight: 5,
      limit: 12 / 24,
    },
    {
      weight: 4,
      limit: 24 / 24,
    },
    {
      weight: 3,
      limit: 7,
    },
    {
      weight: 2,
      limit: 14,
    },
    {
      weight: 1,
      limit: 30,
    },
    {
      weight: 0.5,
      limit: Infinity,
    },
  ];

  const durationWeight = [
    {
      weight: 7,
      min: 30,
    },
    {
      weight: 4,
      min: 14,
    },
    {
      weight: 3,
      min: 7,
    },
    {
      weight: 2,
      min: 1,
    },
  ];

  const dueDateDiff = task.dueDate.getTime() - new Date().getTime();
  const dueDateDiffInHour = dueDateDiff / (1000 * 60 * 60);
  const dueDateScore = dueDateWeight.find((weight) => {
    return dueDateDiffInHour <= weight.limit;
  });

  const durationScore = durationWeight.find((weight) => {
    return task.duration >= weight.min;
  });

  const score =
    (dueDateScore?.weight ?? 0) +
    (durationScore?.weight ?? 0) +
    task.priority * priorityWeight +
    task.category.priority * categoryPriorityWeight;

  return score;
}
