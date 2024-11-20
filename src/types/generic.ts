export interface ServiceFormData {
   name: string;
   description: string;
   price: string;
   category: string;
   time: number;
   barbershopId: string
}

export interface UserType {
   id: string;
   email: string;
   name: string;
   type: string;
   phone: string | null;
   emailVerified: boolean;
   password?: string | null;
};