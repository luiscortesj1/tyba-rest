/**
 * Esta función middleware se utiliza para autenticar tokens JWT (JSON Web Tokens) en las solicitudes HTTP entrantes.
 * Extrae el token del encabezado "Authorization", lo verifica usando una clave secreta y adjunta
 * el ID de usuario decodificado al objeto de la solicitud si el token es válido. Si el token falta o es inválido,
 * responde con un mensaje de error apropiado.
 */

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
