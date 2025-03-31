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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createStudent(data) {
        try {
            if (!data.studentId || !data.firstName || !data.lastName || !data.email) {
                throw new common_1.HttpException('Missing required fields', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!/^[A-Z0-9]+$/i.test(data.studentId)) {
                throw new common_1.HttpException('Invalid student ID format', common_1.HttpStatus.BAD_REQUEST);
            }
            const student = await this.userService.createStudent(data);
            return student;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to create student account', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createInstructor(data) {
        try {
            if (!data.instructorId || !data.firstName || !data.lastName || !data.email || !data.department) {
                throw new common_1.HttpException('Missing required fields', common_1.HttpStatus.BAD_REQUEST);
            }
            if (!/^[A-Z0-9]+$/i.test(data.instructorId)) {
                throw new common_1.HttpException('Invalid instructor ID format', common_1.HttpStatus.BAD_REQUEST);
            }
            const instructor = await this.userService.createInstructor(data);
            return instructor;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to create instructor account', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllStudents() {
        try {
            return await this.userService.getAllStudents();
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch students', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllInstructors() {
        try {
            return await this.userService.getAllInstructors();
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch instructors', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getStudentById(id) {
        const student = await this.userService.getStudentById(id);
        if (!student) {
            throw new common_1.HttpException('Student not found', common_1.HttpStatus.NOT_FOUND);
        }
        return student;
    }
    async getInstructorById(id) {
        const instructor = await this.userService.getInstructorById(id);
        if (!instructor) {
            throw new common_1.HttpException('Instructor not found', common_1.HttpStatus.NOT_FOUND);
        }
        return instructor;
    }
    async updateStudentProfile(id, profileUrl) {
        try {
            if (!profileUrl) {
                throw new common_1.HttpException('Profile URL is required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.userService.updateStudentProfile(id, profileUrl);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to update student profile', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateInstructorProfile(id, profileUrl) {
        try {
            if (!profileUrl) {
                throw new common_1.HttpException('Profile URL is required', common_1.HttpStatus.BAD_REQUEST);
            }
            return await this.userService.updateInstructorProfile(id, profileUrl);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to update instructor profile', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('students'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createStudent", null);
__decorate([
    (0, common_1.Post)('instructors'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createInstructor", null);
__decorate([
    (0, common_1.Get)('students'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllStudents", null);
__decorate([
    (0, common_1.Get)('instructors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllInstructors", null);
__decorate([
    (0, common_1.Get)('students/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getStudentById", null);
__decorate([
    (0, common_1.Get)('instructors/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getInstructorById", null);
__decorate([
    (0, common_1.Put)('students/:id/profile'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('profileUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateStudentProfile", null);
__decorate([
    (0, common_1.Put)('instructors/:id/profile'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('profileUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateInstructorProfile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map