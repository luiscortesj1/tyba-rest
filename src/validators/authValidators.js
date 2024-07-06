// Este módulo proporciona esquemas de validación para el registro y el inicio de sesión de usuarios utilizando Joi.
// Define `registerSchema` para validar los detalles del registro, asegurando la presencia y el formato de nombre de usuario,
// correo electrónico y contraseña con restricciones específicas.
// El `loginSchema` valida las credenciales de inicio de sesión, requiriendo un correo electrónico y una contraseña.

const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .message("Password must be at least 8 characters long")
    .pattern(/[A-Z]/)
    .message("Password must contain at least one uppercase letter")
    .pattern(/[a-z]/)
    .message("Password must contain at least one lowercase letter")
    .pattern(/[0-9]/)
    .message("Password must contain at least one number")
    .pattern(/[\W_]/)
    .message("Password must contain at least one special character")
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerSchema, loginSchema };
