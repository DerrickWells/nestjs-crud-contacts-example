import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from './contact.model';

@Injectable()
export class ContactsService {
    private contacts: Contact[] = [];

    getContacts() {
        return [...this.contacts];
    }

    insertContact(
        contactName: { first: string, middle: string, last: string },
        contactAddress: { street:string, city:string, state:string, zip:string },
        contactPhone: { number:string, type:string }[],
        contactEmail: string
    ){
        const contactID = Math.random();
        const newContact = new Contact(contactID, contactName, contactAddress, contactPhone, contactEmail);
        this.contacts.push(newContact);
        return contactID;
    }

    updateContact(
        contactID: number,
        contactName: { first: string, middle: string, last: string },
        contactAddress: { street: string, city: string, state: string, zip: string },
        contactPhone: { number: string, type: string }[],
        contactEmail: string
    ){
        const [contact, index] = this.findContact(contactID);
        const updatedContact = { ...contact };
        if (contactName) {
            updatedContact.name = contactName;
        }
        if (contactAddress) {
            updatedContact.address = contactAddress;
        }
        if (contactPhone) {
            updatedContact.phone = contactPhone;
        }
        if (contactEmail) {
            updatedContact.email = contactEmail;
        }
        this.contacts[index] = updatedContact; 
    }

    getSingleContact(contactID: number) {
        const contact = this.findContact(contactID)[0];
        return { ...contact };
    }

    deleteContact(contactID: number) {
        const index = this.findContact(contactID)[1];
        this.contacts.splice(index, 1);
    }

    private findContact(id: number): [Contact, number] {
        const contactIndex = this.contacts.findIndex(con => con.id == id);
        const contact = this.contacts[contactIndex];
        if (!contact) {
          throw new NotFoundException('Could not find contact.');
        }
        return [contact, contactIndex];
    }

}