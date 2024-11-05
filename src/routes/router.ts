import serviceRoute from '../controller/application/service/services.routes';
import barbershopRoute from '../controller/application/barbershop/barbershop.routes';
import BarberDetailsRoute from '../controller/application/barberDetails/barberDetails.routes'
import loginRoute from '../controller/client/login/login.routes';
import registerRoute from '../controller/client/register/register.routes';
import registerProfessionalRoute from '../controller/professional/register/register.routes'
import verifyEmailRoute from '../controller/client/verifyEmail/verifyEmail.routes';
import userByEmailRoute from '../controller/client/user/userById.routes'
import resetPasswordRoute from '../controller/client/resetPassword/resetPassword.routes';
import saveFavoriteRoute from '../controller/professional/favorite/favorite.routes';
import updateAccountRoute from '../controller/client/account-info/account.routes';
import bookingsRoute from '../controller/client/bookings/bookings.routes';

export default [
    serviceRoute,
    barbershopRoute,
    BarberDetailsRoute,
    loginRoute,
    registerRoute,
    registerProfessionalRoute,
    verifyEmailRoute,
    resetPasswordRoute,
    verifyEmailRoute,
    userByEmailRoute,
    saveFavoriteRoute,
    updateAccountRoute,
    bookingsRoute,
];

