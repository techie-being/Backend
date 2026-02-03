import {Router} from "express"
import { registerUser } from "../controllers/user.controler";
//initialized user routes router here
const router = Router();

router.route("/register").post(registerUser)



export {router}