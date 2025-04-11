import { Controller, Get } from '@nestjs/common';
import { PersonService } from './person.service';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get()
  findAll() {
    return this.personService.findAll();
  }
}
