import { Router } from 'express';
import { prisma } from '../db.js';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';






const router = Router();

const SECRET_KEY = 'tecsup2024';





router.get('/users', async (req, res) => {
    const users = await  prisma.user.findMany();
    res.json(users);
});

router.post('/users', async (req, res) => {
    const newUser = await prisma.user.create({
        data: req.body,
    });
    res.json(newUser);
})


router.post('/users/register', async (req, res) => {
    try {
      // Validar entrada
      const { name, email, password } = req.body;
   
      // Hash de la contraseña
      const hashedPassword = await argon2.hash(password);
  
      // Crear el usuario en la base de datos
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        
      });

      console.log(newUser);
  
      // Generar token de autenticación (opcional)
      //const token = await generateAuthToken(newUser.id);
  
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'El correo electrónico ya existe' });
      }
  
      console.error('Error en el registro:', error);
      res.status(500).json({ message: 'Error en el registro de usuario' });
    }
  });




  router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por correo electrónico
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        // Verificar si el usuario existe y si la contraseña es correcta
        if (!user || !(await argon2.verify(user.password, password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Crear token de autenticación
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '20s' });


        // Almacenar el token en las cookies
        res.cookie('authToken', token, { httpOnly: true }); // 'httpOnly: true' previene el acceso al token desde el lado del cliente
        
        res.json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});


export default router;