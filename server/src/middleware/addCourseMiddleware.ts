import { Request, Response } from 'express';
import dbs from '../config/db';
import { ResultSetHeader } from 'mysql2';
import { CustomRequest } from './authmiddleware';


export const registerCourse = async (req: Request, res: Response) => {
    
    const { 
        course_title, 
        course_instructor, 
        course_description, 
        course_duration, 
        course_modules, 
        course_price 
    } = req.body;

   
    if (!course_title || !course_instructor || !course_description) {
        return res.status(400).json({ 
            error: "Missing required fields: Title, Instructor, and Description are mandatory." 
        });
    }

    try {
        
        const query = `
            INSERT INTO courses 
            (course_title, course_instructor, course_description, course_duration, course_modules, course_price) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            course_title, 
            course_instructor, 
            course_description, 
            course_duration, 
            course_modules, 
            course_price
        ];

        
        await dbs.execute<ResultSetHeader>(query, values);

        
        return res.status(201).json({ 
            message: "Data Saved Successfully!" 
        });

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ 
            error: "Internal Server Error: Could not save course data." 
        });
    }
};

export const deactivateCourse = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const query = `UPDATE courses SET status = 0 WHERE id = ?`;
        
        const [result] = await dbs.execute<ResultSetHeader>(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Course not found" });
        }

        return res.status(200).json({ 
            message: "Course deactivated successfully" 
        });

    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ 
            error: "Internal Server Error: Could not update status." 
        });
    }
};

export const getAllCourses = async (req: CustomRequest, res: Response) => {
    try {
        const student_id = req.user?.id;
        const query = `
            SELECT c.*, COUNT(e.id) AS enrolled_count,
            CASE WHEN EXISTS(SELECT 1 FROM enrollments WHERE course_id = c.id AND student_id = ?) THEN 1 ELSE 0 END AS is_enrolled
            FROM courses c 
            LEFT JOIN enrollments e ON c.id = e.course_id 
            WHERE c.status = 1 
            GROUP BY c.id
        `;
        const [rows] = await dbs.execute(query, [student_id]);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ error: "Failed to fetch courses" });
    }
};

export const enrollInCourse = async (req: CustomRequest, res: Response) => {
    const { course_id } = req.body;
    const student_id = req.user?.id; 

    if (!course_id) {
        return res.status(400).json({ error: "Course ID is required" });
    }

    try {
        
        const query = "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)";
        await dbs.execute<ResultSetHeader>(query, [student_id, course_id]);

        return res.status(201).json({ message: "Enrolled Successfully!" });
    } catch (error: any) {
        console.error("Enrollment Error:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "You are already enrolled in this course." });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
};