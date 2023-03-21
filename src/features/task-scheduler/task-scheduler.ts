import { TASK_SCHEDULER_STRATEGY } from '@/common/tokens/tokens';
import { Task } from '@/entities/task.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TaskSchedulerStrategy } from './interfaces/task-scheduler-strategy.enum';
import { getTaskScore } from './utils/task-score.util';

interface TimeBlock {
  start: Date;
  end: Date;
}

interface Gene {
  task: Task;
  timeBlock: TimeBlock;
}

export interface Chromosome {
  genes: Gene[];
  fitnessScore: number;
}

type Population = Chromosome[];

function randomElement(array: any[]): any {
  return array[Math.floor(Math.random() * array.length)];
}

function getTimeBlockDuration(timeBlock: TimeBlock): number {
  return timeBlock.end.getTime() - timeBlock.start.getTime();
}

const freeTimeBlocks: TimeBlock[] = [
  {
    start: new Date('2023-03-23T08:00:00.000Z'),
    end: new Date('2023-03-23T12:00:00.000Z'),
  },
  {
    start: new Date('2023-03-25T13:00:00.000Z'),
    end: new Date('2023-03-25T16:00:00.000Z'),
  },
  {
    start: new Date('2023-03-27T18:00:00.000Z'),
    end: new Date('2023-03-27T22:00:00.000Z'),
  },
  {
    start: new Date('2023-03-28T10:00:00.000Z'),
    end: new Date('2023-03-28T14:00:00.000Z'),
  },
  {
    start: new Date('2023-03-29T16:00:00.000Z'),
    end: new Date('2023-03-29T18:00:00.000Z'),
  },
  {
    start: new Date('2023-03-30T11:00:00.000Z'),
    end: new Date('2023-03-30T14:00:00.000Z'),
  },
  {
    start: new Date('2023-03-31T09:00:00.000Z'),
    end: new Date('2023-03-31T12:00:00.000Z'),
  },
  {
    start: new Date('2023-04-01T14:00:00.000Z'),
    end: new Date('2023-04-01T16:00:00.000Z'),
  },
  {
    start: new Date('2023-04-02T17:00:00.000Z'),
    end: new Date('2023-04-02T20:00:00.000Z'),
  },
  {
    start: new Date('2023-04-03T08:00:00.000Z'),
    end: new Date('2023-04-03T11:00:00.000Z'),
  },
];

@Injectable()
export class TaskScheduler {
  strategy: TaskSchedulerStrategy;

  constructor(
    @Inject(TASK_SCHEDULER_STRATEGY)
    private readonly taskSchedulerStrategy: TaskSchedulerStrategy,
  ) {
    this.strategy = taskSchedulerStrategy;
  }

  private randomGene(tasks: Task[], freeTimeBlocks: TimeBlock[]): Gene {
    return {
      task: randomElement(tasks),
      timeBlock: randomElement(freeTimeBlocks),
    };
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

  fitnessFunction(genes: Gene[]): number {
    let score = 0;

    for (let i = 0; i < genes.length; i++) {
      const gene = genes[i];
      if (genes[i].task.duration > getTimeBlockDuration(genes[i].timeBlock)) {
        continue;
      }

      for (let i = 0; i < genes.length; i++) {
        if (
          gene.task.id !== genes[i].task.id &&
          gene.timeBlock.start.getTime() < genes[i].timeBlock.end.getTime() &&
          gene.timeBlock.end.getTime() > genes[i].timeBlock.start.getTime()
        ) {
          continue;
        }
      }

      if (gene.task.dueDate.getTime() < gene.timeBlock.end.getTime()) {
        score -= 20;
      }

      score += getTaskScore(gene.task);
    }

    return score;
  }

  randomSchedule(tasks: Task[], freeTimeBlocks: TimeBlock[]): Chromosome {
    const genes = freeTimeBlocks.map(() =>
      this.randomGene(tasks, freeTimeBlocks),
    );

    const chromosome: Chromosome = {
      genes,
      fitnessScore: this.fitnessFunction(genes),
    };

    return chromosome;
  }

  schedule(tasks: Task[], hours: number): Chromosome | null {
    const POPULATION_SIZE = 100;
    const MAX_GENERATIONS = 50;
    const MUTATION_RATE = 0.1;

    let population: Population = [];

    for (let i = 0; i < POPULATION_SIZE; i++) {
      population.push(this.randomSchedule(tasks, freeTimeBlocks));
    }

    for (let i = 0; i < MAX_GENERATIONS; i++) {
      const averageFitnessScore =
        population.reduce((acc, chromosome) => {
          return acc + chromosome.fitnessScore;
        }, 0) / POPULATION_SIZE;

      const filteredPopulation = [...population]
        .sort((a, b) => b.fitnessScore - a.fitnessScore)
        .filter((_) => _.fitnessScore > 0.1 * averageFitnessScore);

      if (filteredPopulation.length === 0) {
        return null;
      }

      if (filteredPopulation.length === 1) {
        break;
      }

      const newPopulation = [...filteredPopulation].slice(0, 2);

      for (let j = 0; j < POPULATION_SIZE / 2 - 2; j++) {
        const { parent1, parent2 } = this.chooseParent(filteredPopulation);
        const { child1, child2 } = this.crossover(parent1, parent2);
        Math.random() < MUTATION_RATE && this.mutate(child1);
        Math.random() < MUTATION_RATE && this.mutate(child2);
        newPopulation.push(child1);
        newPopulation.push(child2);
      }
      population = newPopulation;
    }

    const bestSchedule = population.sort(
      (a, b) => b.fitnessScore - a.fitnessScore,
    )[0];

    return bestSchedule;
  }

  crossover(
    schedule1: Chromosome,
    schedule2: Chromosome,
  ): {
    child1: Chromosome;
    child2: Chromosome;
  } {
    const crossoverPoint = Math.floor(Math.random() * schedule1.genes.length);
    const schedule1TaskIds = schedule1.genes.map((_) => _.task.id);
    const schedule2TaskIds = schedule2.genes.map((_) => _.task.id);

    const child1 = schedule1.genes.slice(0, crossoverPoint);
    const child2 = schedule2.genes.slice(0, crossoverPoint);

    for (let i = crossoverPoint; i < schedule2.genes.length; i++) {
      if (schedule1TaskIds.includes(schedule2.genes[i].task.id)) {
        continue;
      }
      child1.push(schedule2.genes[i]);
    }

    for (let i = crossoverPoint; i < schedule1.genes.length; i++) {
      if (schedule2TaskIds.includes(schedule1.genes[i].task.id)) {
        continue;
      }
      child2.push(schedule1.genes[i]);
    }

    return {
      child1: {
        genes: child1,
        fitnessScore: this.fitnessFunction(child1),
      },
      child2: {
        genes: child2,
        fitnessScore: this.fitnessFunction(child2),
      },
    };
  }

  mutate(schedule: Chromosome) {
    const genes = schedule.genes;
    const mutationPoint = randomElement(schedule.genes);
    schedule.genes[mutationPoint] = this.randomGene(
      genes.map((_) => _.task),
      freeTimeBlocks,
    );
  }

  chooseParent(population: Population): {
    parent1: Chromosome;
    parent2: Chromosome;
  } {
    const populationArray = [...population];
    const parent1 =
      populationArray[Math.floor(Math.random() * population.length)];
    let parent2 =
      populationArray[Math.floor(Math.random() * population.length)];

    while (parent2 === parent1) {
      parent2 = populationArray[Math.floor(Math.random() * population.length)];
    }

    return {
      parent1,
      parent2,
    };
  }
}
