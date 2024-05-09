import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import productsRoutes from './routes/products.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import usersRoutes from './routes/users.routes.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'tecsup2024';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cookieParser());

// Middleware para verificar la autenticación del usuario
function authenticateUser(req, res, next) {
  const authToken = req.cookies.authToken;
  if (!authToken) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
      // Verificar el token
      const decodedToken = jwt.verify(authToken, SECRET_KEY);
      req.userId = decodedToken.userId; // Agregar el ID de usuario decodificado a la solicitud
      next(); // Continuar con la siguiente función de middleware
  } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Unauthorized' });
  }
}

// Middleware para analizar solicitudes con formato JSON
app.use(express.json());

// Habilitar CORS
app.use(cors());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir el archivo home.html
app.get('/home', authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/cart', authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// Rutas para productos, categorías y usuarios
app.use("/api", productsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", usersRoutes);

// Puerto en el que el servidor escucha
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
