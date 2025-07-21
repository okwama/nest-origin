"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const user_entity_1 = require("../users/entities/user.entity");
const staff_entity_1 = require("../users/entities/staff.entity");
const client_entity_1 = require("../clients/entities/client.entity");
const product_entity_1 = require("../products/entities/product.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const target_entity_1 = require("../targets/entities/target.entity");
const journey_plan_entity_1 = require("../journey-plans/entities/journey-plan.entity");
const notice_entity_1 = require("../notices/entities/notice.entity");
const attendance_entity_1 = require("../hr/entities/attendance.entity");
const leave_request_entity_1 = require("../hr/entities/leave-request.entity");
const leave_balance_entity_1 = require("../hr/entities/leave-balance.entity");
const leave_type_entity_1 = require("../hr/entities/leave-type.entity");
const task_entity_1 = require("../hr/entities/task.entity");
const allowed_ip_entity_1 = require("../hr/entities/allowed-ip.entity");
const user_device_entity_1 = require("../hr/entities/user-device.entity");
const out_of_office_entity_1 = require("../hr/entities/out-of-office.entity");
const getDatabaseConfig = (configService) => {
    console.log('🔧 Database configuration debug:');
    console.log('DB_HOST:', configService.get('DB_HOST'));
    console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
    console.log('DB_DATABASE:', configService.get('DB_DATABASE'));
    console.log('DATABASE_URL exists:', !!configService.get('DATABASE_URL'));
    const entities = [
        user_entity_1.User,
        staff_entity_1.Staff,
        client_entity_1.Client,
        product_entity_1.Product,
        order_entity_1.Order,
        order_item_entity_1.OrderItem,
        target_entity_1.Target,
        journey_plan_entity_1.JourneyPlan,
        notice_entity_1.Notice,
        attendance_entity_1.Attendance,
        leave_request_entity_1.LeaveRequest,
        leave_balance_entity_1.LeaveBalance,
        leave_type_entity_1.LeaveType,
        task_entity_1.Task,
        allowed_ip_entity_1.AllowedIp,
        user_device_entity_1.UserDevice,
        out_of_office_entity_1.OutOfOffice,
    ];
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
    console.log('🔧 Using individual database parameters');
    const config = {
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
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map