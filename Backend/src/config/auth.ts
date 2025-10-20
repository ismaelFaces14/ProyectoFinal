export const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME ?? "admin",
    passwordHash: "$2b$10$w.OcRi9PENNl7o6Ay6eLq.2VlUK9iBwjdWjMWuSAcJm4cRlwMV75W"
};

export const JWT_SECRET = process.env.JWT_SECRET ?? "clave_por_defecto";