import {Router} from "express";
import {usersController} from "../controllers/users.controller";
import {userQueryValidation} from "../validation/userQuery.validation";
import {basicAdminGuardMiddleware} from "../../../auth/middlewares/super-admin.guard-middleware";
import {inputResultValidation} from "../../../core/middlewares/validation/input-reult.validation";
import {userInputValidation} from "../validation/userInput.validation";


export const usersRoutes = Router({});

usersRoutes.get('/',
    basicAdminGuardMiddleware,
    ...userQueryValidation,
    inputResultValidation,
    usersController.getAllUsers);

usersRoutes.post('/',
    basicAdminGuardMiddleware,
    ...userInputValidation,
    inputResultValidation,
    usersController.postUser
)

usersRoutes.delete('/:id',
    basicAdminGuardMiddleware,
    usersController.deleteUser
)
