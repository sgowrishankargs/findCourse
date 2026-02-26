import { Router } from 'express';
import { Signup, Login, verifyToken, authorizeRole } from '../middleware/authmiddleware';
import { registerCourse, deactivateCourse, getAllCourses , enrollInCourse} from "../middleware/addCourseMiddleware";


const router = Router();


router.post("/register", Signup);
router.post("/login", Login);


router.get("/courses", verifyToken, getAllCourses);


router.post(   "/course-register", verifyToken,authorizeRole('admin'), registerCourse );

router.patch( "/deactivate-course/:id",  verifyToken, authorizeRole('admin'),deactivateCourse );

router.post("/enroll", verifyToken, enrollInCourse);
     
   
     
    

export default router;