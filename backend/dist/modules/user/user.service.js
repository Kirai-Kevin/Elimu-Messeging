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
const sendbird_service_1 = require("./sendbird.service");
const uuid_1 = require("uuid");
let UserService = class UserService {
    constructor(sendbirdService) {
        this.sendbirdService = sendbirdService;
        this.students = new Map();
        this.instructors = new Map();
    }
    async createStudent(data) {
        const id = (0, uuid_1.v4)();
        const nickname = `Student_${data.studentId}_${data.firstName}`;
        const student = {
            id,
            nickname,
            ...data,
        };
        await this.sendbirdService.createSendbirdUser(id, nickname, data.profileUrl);
        this.students.set(id, student);
        return student;
    }
    async createInstructor(data) {
        const id = (0, uuid_1.v4)();
        const nickname = `Instructor_${data.instructorId}_${data.firstName}`;
        const instructor = {
            id,
            nickname,
            ...data,
        };
        await this.sendbirdService.createSendbirdUser(id, nickname, data.profileUrl);
        this.instructors.set(id, instructor);
        return instructor;
    }
    async getStudentById(id) {
        return this.students.get(id);
    }
    async getInstructorById(id) {
        return this.instructors.get(id);
    }
    async getAllStudents() {
        return Array.from(this.students.values());
    }
    async getAllInstructors() {
        return Array.from(this.instructors.values());
    }
    async updateStudentProfile(id, profileUrl) {
        const student = await this.getStudentById(id);
        if (!student) {
            throw new Error('Student not found');
        }
        await this.sendbirdService.updateSendbirdUser(id, {
            profileUrl,
        });
        student.profileUrl = profileUrl;
        this.students.set(id, student);
        return student;
    }
    async updateInstructorProfile(id, profileUrl) {
        const instructor = await this.getInstructorById(id);
        if (!instructor) {
            throw new Error('Instructor not found');
        }
        await this.sendbirdService.updateSendbirdUser(id, {
            profileUrl,
        });
        instructor.profileUrl = profileUrl;
        this.instructors.set(id, instructor);
        return instructor;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sendbird_service_1.SendbirdService])
], UserService);
//# sourceMappingURL=user.service.js.map