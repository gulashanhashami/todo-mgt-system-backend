import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { for knowing id, role, email }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

export function authorize(roles = []) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient rights" });
        }
        next();
    };
}
