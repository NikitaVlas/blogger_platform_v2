import {Request, Response} from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {UsersService, usersService} from "../service/users.service";
import {getUsersQueryParams} from "../helpers/get-users-query-params";


type UserIdParams = {
    id: string;
};

export class UsersController {
    constructor(private readonly service: UsersService) {}
    async getAllUsers(req: Request, res: Response) {
        const query = getUsersQueryParams(req);
        const users = await this.service.findAll(query);

        res.status(HttpStatus.OK).send(users)
    }

    async postUser(req: Request, res: Response) {
        const result = await this.service.create(req.body);

        if (result.status === "login-not-unique") {
            return res.status(HttpStatus.BadRequest).send({
                errorsMessages: [
                    {
                        field: "login",
                        message: "Login must be unique"
                    }
                ]
            })
        }

        if (result.status === "email-not-unique") {
            return res.status(HttpStatus.BadRequest).send({
                errorsMessages: [
                    {
                        field: "email",
                        message: "email must be unique"
                    }
                ]
            })
        }

        return res.status(HttpStatus.Created).send(result.user)
    }

    async deleteUser(req: Request<UserIdParams>, res: Response) {
        const isDeleted = await this.service.delete(req.params.id);

        if (!isDeleted) {
            res.sendStatus(HttpStatus.NotFound)
            return
        }

        res.sendStatus(HttpStatus.NoContent)
    }
}

export const usersController = new UsersController(usersService);
