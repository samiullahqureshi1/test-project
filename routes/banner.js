import { createBanner,getBanner,updateBanner,deleteBanners } from "../controller/banner.js";
import express from 'express'
import upload from "../middleware/multer.js";
import authenticate from "../middleware/authenticate.js";
const bannerRouter=express.Router()
bannerRouter.post('/uploads',authenticate,upload.single('image'),createBanner)
bannerRouter.get('/',getBanner)
bannerRouter.patch('/:id',upload.single('image'),updateBanner)
bannerRouter.delete('/:id',deleteBanners)

export default bannerRouter;