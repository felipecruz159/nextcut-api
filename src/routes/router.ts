import serviceRoute from '../controller/application/service/services.routes';
import barbershopRoute from '../controller/application/barbershop/barbershop.routes';
import BarberDetailsRoute from '../controller/application/barberDetails/barberDetails.routes'
import loginRoute from '../controller/client/login/login.routes';
import registerRoute from '../controller/client/register/register.routes';

export default [
    serviceRoute,
    barbershopRoute,
    BarberDetailsRoute,
    loginRoute,
    registerRoute,
];

