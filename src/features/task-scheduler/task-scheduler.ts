import { TASK_SCHEDULER_STRATEGY } from '@/common/tokens/tokens';
import { Task } from '@/entities/task.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TaskSchedulerStrategy } from './interfaces/task-scheduler-strategy.enum';
import { getTaskScore } from './utils/task-score.util';

@Injectable()
export class TaskScheduler {
  strategy: TaskSchedulerStrategy;

  constructor(
    @Inject(TASK_SCHEDULER_STRATEGY)
    private readonly taskSchedulerStrategy: TaskSchedulerStrategy,
  ) {
    this.strategy = taskSchedulerStrategy;
  }

  private randomBit(): number {
    return Math.round(Math.random());
  }

  decodeSchedule(schedule: string, tasks: Task[]): Task[] {
    const decodedSchedule: Task[] = [];
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i] === '1') {
        decodedSchedule.push(tasks[i]);
      }
    }
    return decodedSchedule;
  }

  fitnessFunction(schedule: Task[], limit: number): number {
    const totalDuration = schedule.reduce((acc, task) => {
      return acc + task.duration;
    }, 0);
    if (totalDuration > limit) {
      return 0;
    }

    return schedule.reduce((acc, task) => {
      return acc + getTaskScore(task);
    }, 0);
  }

  randomSchedule(tasks: Task[]): string {
    let schedule = '';
    tasks.forEach(() => {
      schedule += this.randomBit();
    });
    return schedule;
  }

  schedule(tasks: Task[], hours: number): Task[] {
    const POPULATION_SIZE = 10;
    const MAX_GENERATIONS = 10;
    const MUTATION_RATE = 0.1;

    let population = new Set<string>();

    for (let i = 0; i < POPULATION_SIZE; i++) {
      population.add(this.randomSchedule(tasks));
    }

    for (let i = 0; i < MAX_GENERATIONS; i++) {
      if (population.size === 0) {
        return [];
      }

      if (population.size === 1) {
        break;
      }

      const fitnessScores: number[] = [];
      population.forEach((schedule) => {
        const decodedSchedule = this.decodeSchedule(schedule, tasks);
        const fitnessScore = this.fitnessFunction(decodedSchedule, hours);
        fitnessScores.push(fitnessScore);
      });

      const totalFitnessScore = fitnessScores.reduce((acc, score) => {
        return acc + score;
      }, 0);

      const filteredPopulation = new Set(
        [...population]
          .sort(
            (a, b) =>
              this.fitnessFunction(this.decodeSchedule(b, tasks), hours) -
              this.fitnessFunction(this.decodeSchedule(a, tasks), hours),
          )
          .filter(
            (_) =>
              this.fitnessFunction(this.decodeSchedule(_, tasks), hours) >
              0.1 * totalFitnessScore,
          ),
      );

      const newPopulation = new Set<string>(
        [...filteredPopulation].slice(0, 2),
      );

      for (let j = 0; j < POPULATION_SIZE / 2 - 2; j++) {
        const { parent1, parent2 } = this.chooseParent(filteredPopulation);

        let { child1, child2 } = this.crossover(parent1, parent2);

        child1 = Math.random() < MUTATION_RATE ? this.mutate(child1) : child1;
        child2 = Math.random() < MUTATION_RATE ? this.mutate(child2) : child2;
        newPopulation.add(child1);
        newPopulation.add(child2);
      }
      population = newPopulation;
    }

    let bestSchedule = Array.from(population)[0];

    let bestFitnessScore = this.fitnessFunction(
      this.decodeSchedule(bestSchedule, tasks),
      hours,
    );

    population.forEach((schedule) => {
      const fitnessScore = this.fitnessFunction(
        this.decodeSchedule(schedule, tasks),
        hours,
      );
      if (fitnessScore > bestFitnessScore) {
        bestSchedule = schedule;
        bestFitnessScore = fitnessScore;
      }
    });

    const decodedSchedule = this.decodeSchedule(bestSchedule, tasks);
    return decodedSchedule.sort((a, b) => getTaskScore(b) - getTaskScore(a));
  }

  crossover(
    schedule1: string,
    schedule2: string,
  ): {
    child1: string;
    child2: string;
  } {
    const crossoverPoint = Math.floor(Math.random() * schedule1.length);
    const newSchedule1 =
      schedule1.slice(0, crossoverPoint) + schedule2.slice(crossoverPoint);
    const newSchedule2 =
      schedule2.slice(0, crossoverPoint) + schedule1.slice(crossoverPoint);
    return {
      child1: newSchedule1,
      child2: newSchedule2,
    };
  }

  mutate(schedule: string): string {
    const mutationPoint = Math.floor(Math.random() * schedule.length);
    const newSchedule =
      schedule.slice(0, mutationPoint) +
      (1 - Number(schedule[mutationPoint])) +
      schedule.slice(mutationPoint + 1);
    return newSchedule;
  }

  chooseParent(population: Set<string>): {
    parent1: string;
    parent2: string;
  } {
    const populationArray = [...population];
    const parent1 =
      populationArray[Math.floor(Math.random() * population.size)];
    let parent2 = populationArray[Math.floor(Math.random() * population.size)];

    while (parent2 === parent1) {
      parent2 = populationArray[Math.floor(Math.random() * population.size)];
    }

    return {
      parent1,
      parent2,
    };
  }
}
