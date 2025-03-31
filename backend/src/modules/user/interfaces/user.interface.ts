export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  profileUrl?: string;
}

export interface Student extends BaseUser {
  studentId: string;
  course: string;
  year: number;
}

export interface Instructor extends BaseUser {
  instructorId: string;
  department: string;
  subjects: string[];
}
