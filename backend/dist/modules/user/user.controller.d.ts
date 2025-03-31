import { UserService } from './user.service';
import { Student, Instructor } from './interfaces/user.interface';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createStudent(data: Omit<Student, 'id' | 'nickname'>): Promise<Student>;
    createInstructor(data: Omit<Instructor, 'id' | 'nickname'>): Promise<Instructor>;
    getAllStudents(): Promise<Student[]>;
    getAllInstructors(): Promise<Instructor[]>;
    getStudentById(id: string): Promise<Student>;
    getInstructorById(id: string): Promise<Instructor>;
    updateStudentProfile(id: string, profileUrl: string): Promise<Student>;
    updateInstructorProfile(id: string, profileUrl: string): Promise<Instructor>;
}
