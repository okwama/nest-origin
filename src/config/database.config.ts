import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Import all entities
import { User } from '../users/entities/user.entity';
import { Staff } from '../users/entities/staff.entity';
import { Client } from '../clients/entities/client.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Target } from '../targets/entities/target.entity';
import { JourneyPlan } from '../journey-plans/entities/journey-plan.entity';
import { Notice } from '../notices/entities/notice.entity';
import { Attendance } from '../hr/entities/attendance.entity';
import { LeaveRequest } from '../hr/entities/leave-request.entity';
import { LeaveBalance } from '../hr/entities/leave-balance.entity';
import { LeaveType } from '../hr/entities/leave-type.entity';
import { Task } from '../hr/entities/task.entity';
import { AllowedIp } from '../hr/entities/allowed-ip.entity';
import { UserDevice } from '../hr/entities/user-device.entity';
import { OutOfOffice } from '../hr/entities/out-of-office.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  console.log('🔧 Database configuration debug:');
  console.log('DB_HOST:', configService.get('DB_HOST'));
  console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
  console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
  console.log('DATABASE_URL exists:', !!configService.get('DATABASE_URL'));

  // All entities array
  const entities = [
    User,
    Staff,
    Client,
    Product,
    Order,
    OrderItem,
    Target,
    JourneyPlan,
    Notice,
    Attendance,
    LeaveRequest,
    LeaveBalance,
    LeaveType,
    Task,
    AllowedIp,
    UserDevice,
    OutOfOffice,
  ];

  // MySQL configuration via DATABASE_URL (Recommended for Vercel)
  const databaseUrl = configService.get('DATABASE_URL');
  if (databaseUrl) {
    console.log('🔧 Using DATABASE_URL for database connection');
    const url = new URL(databaseUrl);
    return {
      type: 'mysql',
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      username: url.username,
      password: url.password,
      database: url.pathname.substring(1),
      entities,
      synchronize: configService.get('DB_SYNC') === 'true',
      logging: configService.get('DB_LOGGING') === 'true',
      charset: 'utf8mb4',
      extra: {
        connectionLimit: 20,
        charset: 'utf8mb4_unicode_ci'
      },
      retryAttempts: 10,
      retryDelay: 3000,
      keepConnectionAlive: true,
    };
  }

  // MySQL configuration via individual parameters (Fallback)
  console.log('🔧 Using individual database parameters');
  const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: configService.get('DB_HOST', '102.130.125.52'),
    port: parseInt(configService.get('DB_PORT', '3306')),
    username: configService.get('DB_USERNAME', 'impulsep_root'),
    password: configService.get('DB_PASSWORD', '@bo9511221.qwerty'),
    database: configService.get('DB_DATABASE', 'impulsep_woosh'),
    entities,
    synchronize: configService.get('DB_SYNC') === 'true',
    logging: configService.get('DB_LOGGING') === 'true',
    charset: 'utf8mb4',
    extra: {
      connectionLimit: 20,
      charset: 'utf8mb4_unicode_ci'
    },
    retryAttempts: 10,
    retryDelay: 3000,
    keepConnectionAlive: true,
  };

  return config;
}; 