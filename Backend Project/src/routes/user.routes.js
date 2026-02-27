import {Router} from "express"
import { registerUser,loginUser,logoutUser,refreshAccessToken,
changePassword,currentUser,updateAccountDetails,
 avatarUpdate,coverImageUpdate,channelProfileDetails,
userWatchHistory} from "../controllers/user.controler.js";

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
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

//similar for login as well
router.route("/login").post(loginUser)


/*             secured routes           */
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/current-user").get(verifyJWT,currentUser)
router.route("/update-Account-details").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),avatarUpdate)
router.route("/coverImage").patch(verifyJWT,upload.single("/coverImage"),coverImageUpdate)
//data come from params
router.route("/c/:username").get(verifyJWT,channelProfileDetails)
router.route("/hstory").get(verifyJWT,userWatchHistory)




export default router