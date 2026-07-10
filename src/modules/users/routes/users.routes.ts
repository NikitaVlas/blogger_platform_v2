import {Router} from "express";
import {usersController} from "../controllers/users.controller";
import {userQueryValidation} from "../validation/userQuery.validation";
import {basicAdminGuardMiddleware} from "../../../auth/middlewares/super-admin.guard-middleware";
import {inputResultValidation} from "../../../core/middlewares/validation/input-reult.validation";


export const usersRoutes = Router({});

usersRoutes.get('/',
    basicAdminGuardMiddleware,
    ...userQueryValidation,
    inputResultValidation,
    usersController.getAllUsers);

usersRoutes.post('/',
    basicAdminGuardMiddleware,
    usersController.postUser
)

usersRoutes.delete('/:id',
    basicAdminGuardMiddleware,
    usersController.deleteUser
)
