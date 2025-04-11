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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcrypt = require("bcryptjs");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const classRecord = await this.prisma.class.findFirst({
            where: {
                majorId: createUserDto.majorId,
                gradeId: createUserDto.gradeId,
            },
        });
        return this.prisma.user.create({
            data: {
                fullName: createUserDto.fullName,
                nationalCode: createUserDto.nationalCode,
                phoneNumber: createUserDto.phoneNumber,
                password: hashedPassword,
                roleId: createUserDto.roleId,
                majorId: createUserDto.majorId,
                gradeId: createUserDto.gradeId,
                classId: classRecord ? classRecord.id : null,
            },
        });
    }
    async findAll() {
        return this.prisma.user.findMany({
            include: { role: true },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { role: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findByNationalCode(nationalCode) {
        const user = await this.prisma.user.findUnique({
            where: { nationalCode },
            include: { role: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, updateUserDto) {
        const userExists = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!userExists)
            throw new common_1.NotFoundException('User not found');
        const hashedPassword = updateUserDto.password ? await bcrypt.hash(updateUserDto.password, 10) : userExists.password;
        return await this.prisma.user.update({
            where: { id },
            data: {
                fullName: updateUserDto.fullName,
                nationalCode: updateUserDto.nationalCode,
                phoneNumber: updateUserDto.phoneNumber,
                password: hashedPassword,
                roleId: updateUserDto.roleId,
            },
        });
    }
    async remove(id) {
        const userExists = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!userExists)
            throw new common_1.NotFoundException('User not found');
        return await this.prisma.user.delete({
            where: { id },
        });
    }
    async updateRole(id, roleId) {
        const userExists = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!userExists)
            throw new common_1.NotFoundException('User not found');
        return await this.prisma.user.update({
            where: { id },
            data: { roleId },
        });
    }
    async getRoleIdByName(roleName) {
        const role = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        return role.id;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=users.service.js.map