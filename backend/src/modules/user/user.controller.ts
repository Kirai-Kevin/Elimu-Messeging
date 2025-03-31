import { Controller, Post, Body, Get, Param, HttpException, HttpStatus, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Student, Instructor } from './interfaces/user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('students')
  async createStudent(
    @Body() data: Omit<Student, 'id' | 'nickname'>,
  ): Promise<Student> {
    try {
      // Validate required fields
      if (!data.studentId || !data.firstName || !data.lastName || !data.email) {
        throw new HttpException(
          'Missing required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate student ID format
      if (!/^[A-Z0-9]+$/i.test(data.studentId)) {
        throw new HttpException(
          'Invalid student ID format',
          HttpStatus.BAD_REQUEST,
        );
      }

      const student = await this.userService.createStudent(data);
      return student;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create student account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('instructors')
  async createInstructor(
    @Body() data: Omit<Instructor, 'id' | 'nickname'>,
  ): Promise<Instructor> {
    try {
      // Validate required fields
      if (!data.instructorId || !data.firstName || !data.lastName || !data.email || !data.department) {
        throw new HttpException(
          'Missing required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate instructor ID format
      if (!/^[A-Z0-9]+$/i.test(data.instructorId)) {
        throw new HttpException(
          'Invalid instructor ID format',
          HttpStatus.BAD_REQUEST,
        );
      }

      const instructor = await this.userService.createInstructor(data);
      return instructor;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create instructor account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('students')
  async getAllStudents(): Promise<Student[]> {
    try {
      return await this.userService.getAllStudents();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch students',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('instructors')
  async getAllInstructors(): Promise<Instructor[]> {
    try {
      return await this.userService.getAllInstructors();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch instructors',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('students/:id')
  async getStudentById(@Param('id') id: string): Promise<Student> {
    const student = await this.userService.getStudentById(id);
    if (!student) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
    return student;
  }

  @Get('instructors/:id')
  async getInstructorById(@Param('id') id: string): Promise<Instructor> {
    const instructor = await this.userService.getInstructorById(id);
    if (!instructor) {
      throw new HttpException('Instructor not found', HttpStatus.NOT_FOUND);
    }
    return instructor;
  }

  @Put('students/:id/profile')
  async updateStudentProfile(
    @Param('id') id: string,
    @Body('profileUrl') profileUrl: string,
  ): Promise<Student> {
    try {
      if (!profileUrl) {
        throw new HttpException(
          'Profile URL is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.userService.updateStudentProfile(id, profileUrl);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update student profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('instructors/:id/profile')
  async updateInstructorProfile(
    @Param('id') id: string,
    @Body('profileUrl') profileUrl: string,
  ): Promise<Instructor> {
    try {
      if (!profileUrl) {
        throw new HttpException(
          'Profile URL is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.userService.updateInstructorProfile(id, profileUrl);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update instructor profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
