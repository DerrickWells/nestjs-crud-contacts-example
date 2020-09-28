import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Put,
    Delete
  } from '@nestjs/common';

  import { ContactsService } from './contacts.service';

  @Controller('contacts')
  export class ContactsController {
      constructor(private readonly contactsService: ContactsService) {}

      @Get()
      getAllContacts() {
          return this.contactsService.getContacts();
      }

      @Post()
      insertContact(
          @Body('name') contactName: { first: string, middle: string, last: string },
          @Body('address') contactAddress: { street:string, city:string, state:string, zip:string },
          @Body('phone') contactPhone: { number:string, type:string }[],
          @Body('email') contactEmail: string
      ){
          const generatedID = this.contactsService.insertContact(
            contactName, contactAddress, contactPhone, contactEmail
          );
          return { id: generatedID };
      }

      @Put(':id')
      updateContact(
          @Param('id') contactID: number,
          @Body('name') contactName: { first: string, middle: string, last: string },
          @Body('address') contactAddress: { street:string, city:string, state:string, zip:string },
          @Body('phone') contactPhone: { number:string, type:string }[],
          @Body('email') contactEmail: string
      ){
          this.contactsService.updateContact(contactID, contactName, contactAddress, contactPhone, contactEmail);
          return null;
      }

      @Get(':id')
      getContact(@Param('id') contactID: number) {
          return this.contactsService.getSingleContact(contactID);
      }

      @Delete(':id')
      deleteContact(@Param('id') contactID: number){
          this.contactsService.deleteContact(contactID);
          return null;
      }




  }