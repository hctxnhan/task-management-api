import { Category } from '@/entities/category.entity';
import { Label } from '@/entities/label.entity';
import { Task } from '@/entities/task.entity';
import { User } from '@/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist';

export const DatabaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '20110687',
  database: 'postgres',
  synchronize: true,
  logging: true,
  subscribers: [],
  schema: 'public',
  entities: [User, Label, Task, Category],
};
