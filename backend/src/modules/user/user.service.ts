import { Injectable } from '@nestjs/common';
import { Student, Instructor } from './interfaces/user.interface';
import { SendbirdService } from './sendbird.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private students: Map<string, Student> = new Map();
  private instructors: Map<string, Instructor> = new Map();

  constructor(private readonly sendbirdService: SendbirdService) {}

  async createStudent(data: Omit<Student, 'id' | 'nickname'>): Promise<Student> {
    const id = uuidv4();
    const nickname = `Student_${data.studentId}_${data.firstName}`;

    const student: Student = {
      id,
      nickname,
      ...data,
    };

    // Create SendBird user account
    await this.sendbirdService.createSendbirdUser(
      id,
      nickname,
      data.profileUrl,
    );

    this.students.set(id, student);
    return student;
  }

  async createInstructor(data: Omit<Instructor, 'id' | 'nickname'>): Promise<Instructor> {
    const id = uuidv4();
    const nickname = `Instructor_${data.instructorId}_${data.firstName}`;

    const instructor: Instructor = {
      id,
      nickname,
      ...data,
    };

    // Create SendBird user account
    await this.sendbirdService.createSendbirdUser(
      id,
      nickname,
      data.profileUrl,
    );

    this.instructors.set(id, instructor);
    return instructor;
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getInstructorById(id: string): Promise<Instructor | undefined> {
    return this.instructors.get(id);
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getAllInstructors(): Promise<Instructor[]> {
    return Array.from(this.instructors.values());
  }

  async updateStudentProfile(id: string, profileUrl: string): Promise<Student> {
    const student = await this.getStudentById(id);
    if (!student) {
      throw new Error('Student not found');
    }

    // Update SendBird user profile
    await this.sendbirdService.updateSendbirdUser(id, {
      profileUrl,
    });

    student.profileUrl = profileUrl;
    this.students.set(id, student);
    return student;
  }

  async updateInstructorProfile(id: string, profileUrl: string): Promise<Instructor> {
    const instructor = await this.getInstructorById(id);
    if (!instructor) {
      throw new Error('Instructor not found');
    }

    // Update SendBird user profile
    await this.sendbirdService.updateSendbirdUser(id, {
      profileUrl,
    });

    instructor.profileUrl = profileUrl;
    this.instructors.set(id, instructor);
    return instructor;
  }
}
