import {Router} from "express"
import { registerUser } from "../controllers/user.controler.js";
import {upload} from "../middlewares/multer.middleware.js"
//initialized user routes router here
const router = Router();

//upload is multer middleware this saves a files temporarily in storage before uploading to cloudinary

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),
    registerUser
)



export {router}