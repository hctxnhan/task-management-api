import { Category } from '@/entities/category.entity';
import { Label } from '@/entities/label.entity';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
@Injectable()
export class MockDatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    private readonly dataSource: DataSource,
  ) {}

  private userList: User[];
  private labelList: Label[];
  private categoryList: Category[];

  async onModuleInit() {
    this.mockDatabase();
    this.dataSource.createEntityManager().query(`TRUNCATE TABLE "user" CASCADE;
    TRUNCATE TABLE "task" CASCADE;
    TRUNCATE TABLE "category" CASCADE;
    TRUNCATE TABLE "label" CASCADE;
    TRUNCATE TABLE "task_labels_label" CASCADE;`);
  }

  private async mockDatabase() {
    await this.mockUsers();
    await Promise.all([this.mockLabels(), this.mockCategories()]);
    this.mockTasks();
  }

  private randomIndex(max: number) {
    return Math.ceil(Math.random() * max - 1);
  }

  private async mockUsers() {
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = new User();
      user.name = faker.name.fullName();
      user.email = faker.internet.email();
      user.password = faker.internet.password();
      user.dateOfBirth = faker.date.past();
      user.username = faker.internet.userName();
      users.push(user);
    }

    this.userList = await this.userRepository.save(users);
  }
  private async mockTasks() {
    const tasks = [];
    for (let i = 0; i < 20; i++) {
      const task = new Task();
      task.title = faker.lorem.sentence();
      task.description = faker.lorem.paragraph();
      task.dueDate = faker.date.future();

      task.user = this.userList[this.randomIndex(this.userList.length)];
      task.labels = [this.labelList[this.randomIndex(2)]];

      task.category =
        this.categoryList[this.randomIndex(this.categoryList.length)];

      tasks.push(task);
    }

    await this.taskRepository.save(tasks);
  }

  private async mockCategories() {
    const mockCategoriesName = [
      'Marketing',
      'Sales',
      'Design',
      'Development',
      'Support',
      'Admin',
      'Finance',
      'Operations',
      'Research',
      'Writing',
    ];

    const mockCategories = mockCategoriesName.map((name) => {
      const category = new Category();
      category.name = name;
      category.user = this.userList[this.randomIndex(this.userList.length)];
      category.priority = this.randomIndex(10);
      return category;
    });
    this.categoryList = await this.categoryRepository.save(mockCategories);
  }
  private async mockLabels() {
    const mockLabelsName = [
      'Urgent',
      'High priority',
      'Low priority',
      'Personal',
      'Work',
      'Important',
      'Meetings',
      'Deadlines',
      'Projects',
      'Pending',
    ];

    const mockLabels = mockLabelsName.map((name) => {
      const label = new Label();
      label.name = name;
      label.color = faker.internet.color();
      label.user = this.userList[this.randomIndex(this.userList.length)];
      return label;
    });

    this.labelList = await this.labelRepository.save(mockLabels);
  }
}
