export interface IEmailCheck {
   body: {
      email: string;
   }
}

export interface ServiceFormData {
   name: string;
   description: string;
   price: string;
   category: string;
   time: number;
   barbershopId: string
}