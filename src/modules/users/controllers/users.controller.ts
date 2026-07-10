import { Request, Response } from "express";
import {HttpStatus} from "../../../core/types/http-statuses";
import {usersService} from "../service/users.service";
import {getUsersQueryParams} from "../helpers/get-users-query-params";


type UserIdParams = {
    id: string;
};

export const usersController = {
    async getAllUsers(req: Request, res: Response) {
        const query = getUsersQueryParams(req);
        const users = await usersService.findAll(query);

        res.status(HttpStatus.OK).send(users)
    },

    async postUser(req: Request, res: Response) {
      const user = await usersService.create(req.body);

      res.status(HttpStatus.Created).send(user)
    },

    async deleteUser (req: Request<UserIdParams>, res: Response) {
        const isDeleted = await usersService.delete(req.params.id);

        if(!isDeleted) {
            res.sendStatus(HttpStatus.NotFound)
            return
        }

        res.sendStatus(HttpStatus.NoContent)
    }
}
