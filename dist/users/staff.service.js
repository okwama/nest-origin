"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_entity_1 = require("./entities/staff.entity");
let StaffService = class StaffService {
    constructor(staffRepository) {
        this.staffRepository = staffRepository;
    }
    async create(createStaffDto, createdBy) {
        if (createStaffDto.businessEmail) {
            const existingEmail = await this.staffRepository.findOne({
                where: { businessEmail: createStaffDto.businessEmail }
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Business email already exists');
            }
        }
        const existingPhone = await this.staffRepository.findOne({
            where: { phoneNumber: createStaffDto.phoneNumber }
        });
        if (existingPhone) {
            throw new common_1.ConflictException('Phone number already exists');
        }
        const staff = this.staffRepository.create({
            ...createStaffDto,
            photoUrl: createStaffDto.photoUrl || '',
            isActiveField: 1,
        });
        return this.staffRepository.save(staff);
    }
    async findAll() {
        return this.staffRepository.find({
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const staff = await this.staffRepository.findOne({
            where: { id }
        });
        if (!staff) {
            throw new common_1.NotFoundException(`Staff with ID ${id} not found`);
        }
        return staff;
    }
    async findStaffById(id) {
        return this.staffRepository.findOne({
            where: { id }
        });
    }
    async findByEmail(email) {
        return this.staffRepository.findOne({
            where: { businessEmail: email }
        });
    }
    async findByPhone(phone) {
        const staff = await this.staffRepository.findOne({
            where: { phoneNumber: phone }
        });
        if (staff) {
            return this.staffRepository.create(staff);
        }
        return null;
    }
    async update(id, updateStaffDto, updatedBy) {
        console.log('Update request received:', { id, updateStaffDto });
        const staff = await this.findOne(id);
        if (updateStaffDto.businessEmail && updateStaffDto.businessEmail !== staff.businessEmail) {
            const existingEmail = await this.staffRepository.findOne({
                where: { businessEmail: updateStaffDto.businessEmail }
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Business email already exists');
            }
        }
        if (updateStaffDto.phoneNumber && updateStaffDto.phoneNumber !== staff.phoneNumber) {
            const existingPhone = await this.staffRepository.findOne({
                where: { phoneNumber: updateStaffDto.phoneNumber }
            });
            if (existingPhone) {
                throw new common_1.ConflictException('Phone number already exists');
            }
        }
        const updateData = Object.fromEntries(Object.entries(updateStaffDto).filter(([_, value]) => {
            if (value === undefined)
                return false;
            if (typeof value === 'string' && value.trim() === '')
                return false;
            return true;
        }));
        console.log('Filtered update data:', updateData);
        if (Object.keys(updateData).length === 0) {
            throw new common_1.BadRequestException('No valid data provided for update');
        }
        for (const [key, value] of Object.entries(updateData)) {
            if (typeof value === 'string' && value.trim() === '') {
                delete updateData[key];
            }
        }
        if (Object.keys(updateData).length === 0) {
            throw new common_1.BadRequestException('No valid data provided for update');
        }
        await this.staffRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id) {
        const staff = await this.findOne(id);
        await this.staffRepository.update(id, { isActiveField: 0 });
    }
    async search(query) {
        const queryBuilder = this.staffRepository.createQueryBuilder('staff');
        if (query) {
            queryBuilder.andWhere('(staff.name LIKE :query OR staff.business_email LIKE :query OR staff.phone_number LIKE :query OR staff.department LIKE :query)', { query: `%${query}%` });
        }
        return queryBuilder
            .orderBy('staff.name', 'ASC')
            .getMany();
    }
    async findByRole(role) {
        return this.staffRepository.find({
            where: { role, isActiveField: 1 },
            order: { name: 'ASC' },
        });
    }
    async findByDepartment(department) {
        return this.staffRepository.find({
            where: { department, isActiveField: 1 },
            order: { name: 'ASC' },
        });
    }
    async getStaffStats() {
        const total = await this.staffRepository.count();
        const active = await this.staffRepository.count({ where: { isActiveField: 1 } });
        const inactive = await this.staffRepository.count({ where: { isActiveField: 0 } });
        return {
            total,
            active,
            inactive,
            activePercentage: total > 0 ? (active / total) * 100 : 0,
        };
    }
    async getManagers() {
        return this.staffRepository.find({
            where: {
                role: 'manager',
                isActiveField: 1
            },
            order: { name: 'ASC' },
        });
    }
    async updatePassword(id, newPassword) {
        const staff = await this.findOne(id);
        const updatedStaff = this.staffRepository.create({
            ...staff,
            password: newPassword,
        });
        await this.staffRepository.save(updatedStaff);
    }
    async changePassword(id, currentPassword, newPassword) {
        const staff = await this.findOne(id);
        const isValidPassword = await staff.validatePassword(currentPassword);
        if (!isValidPassword) {
            throw new Error('Current password is incorrect');
        }
        await this.updatePassword(id, newPassword);
        return { message: 'Password changed successfully' };
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StaffService);
//# sourceMappingURL=staff.service.js.map