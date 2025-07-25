"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:8080',
            'http://localhost:54355',
            'http://localhost:54356',
            'http://localhost:52531',
            'http://192.168.100.2:52531',
            'capacitor://localhost'
        ],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Woosh NestJS Server running on port ${port}`);
    console.log(`📱 API available at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map