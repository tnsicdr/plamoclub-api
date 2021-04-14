import { Router } from "express";
import { UserService } from "../services/user.service";

export class UserController {
    public router: Router;
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.router = Router();
        this.routes();
    }

    /**
     * Configure routes
     */
    public routes() {
        //this.router('/api/', getUsersFn);
    }
}