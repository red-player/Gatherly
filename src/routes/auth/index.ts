import { Router } from 'express';
import controllers from '../../controllers';
import middleware from '../../middleware';


const routes = Router()


routes.post('/login',[],controllers.auth.login)

routes.post('/register',[],controllers.auth.register)
routes.post('/log-out',[middleware.auth.baseAuth],controllers.auth.logOut)


export { routes as authRoutes }