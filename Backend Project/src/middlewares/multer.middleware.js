import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    //it may be confusing with original name multiple same name file so we can add functionality later
    cb(null, file.originalname)
  }
})
export const upload = multer({
         storage,
})