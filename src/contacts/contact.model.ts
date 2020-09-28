export class Contact {
    constructor(
        public id: number,
        public name: {
            first: string,
            middle: string,
            last: string
        },
        public address: {
            street: string,
            city: string,
            state: string,
            zip: string
        },
        public phone: {
            number: string,
            type: string
        }[],
        public email: string
    ) {}
}