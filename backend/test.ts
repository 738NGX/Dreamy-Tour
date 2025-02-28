import { Exclude, Expose, plainToInstance, Type } from "class-transformer";
import "reflect-metadata";

class Student {
  @Expose()
  @Type(() => String)
  name: string

  @Expose()
  @Type(() => Number)
  age: number

  @Expose()
  @Type(() => Number)
  no: number

  @Expose()
  @Type(() => Date)
  birthday: Date
}

const plainObj = {
  name: 11,
  age: '11',
  no: 2022111901,
  isAdult: true,
  birthday: Date.now(),
  bug: 1
}

const student = plainToInstance(Student, plainObj, {
  excludeExtraneousValues: true
});
console.log(student.birthday)