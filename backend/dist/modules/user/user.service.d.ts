import { Student, Instructor } from './interfaces/user.interface';
import { SendbirdService } from './sendbird.service';
export declare class UserService {
    private readonly sendbirdService;
    private students;
    private instructors;
    constructor(sendbirdService: SendbirdService);
    createStudent(data: Omit<Student, 'id' | 'nickname'>): Promise<Student>;
    createInstructor(data: Omit<Instructor, 'id' | 'nickname'>): Promise<Instructor>;
    getStudentById(id: string): Promise<Student | undefined>;
    getInstructorById(id: string): Promise<Instructor | undefined>;
    getAllStudents(): Promise<Student[]>;
    getAllInstructors(): Promise<Instructor[]>;
    updateStudentProfile(id: string, profileUrl: string): Promise<Student>;
    updateInstructorProfile(id: string, profileUrl: string): Promise<Instructor>;
}
