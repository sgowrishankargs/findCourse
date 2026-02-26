import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import dbs from "../config/db";
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const JWT_SECRET = "12345_gfdsa";

interface UserPayload {
    id: number;
    email: string;
    role: string;
}

export interface CustomRequest extends Request {
    user?: UserPayload;
}


export const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied, no token" });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET) as UserPayload;
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};


export const authorizeRole = (requiredRole: string) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: `Access denied: ${requiredRole} role required` });
        }

        next();
    };
};

export const Signup = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO login (name, email, password, role) VALUES (?, ?, ?, ?)";
        await dbs.execute<ResultSetHeader>(query, [name, email, hashedPassword, role || 'student']);
        
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Email already exists or database error" });
    }
};

export const Login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const query = "SELECT * FROM login WHERE email = ?";
        const [rows] = await dbs.execute<RowDataPacket[]>(query, [email]);
        const user = rows[0];

        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role }, 
                JWT_SECRET, 
                { expiresIn: "1h" }
            );

            res.status(200).json({
                message: "User Login Successfully",
                token: token,
                user: { id: user.id, email: user.email, name: user.name, role: user.role }
            });
        } else {
            res.status(400).json({ error: "Password Mismatch" });
        }
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};