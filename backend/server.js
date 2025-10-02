const express = require('express');
const process = require('process');
const dotenv = require('dotenv');
const {PrismaClient} = require('./src/generated/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
app.get('/', (req, res) => {
    res.status(200).send("Server is Running Perfectly");
});


app.post('/users', async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All Fields are required" });
    }

    try {
        const checkEmail = await prisma.users.findFirst({
            where: { email }
        });

        if (checkEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
            }
        });

        const token = jwt.sign({ userId: result.id }, process.env.JWT_SECRET);
        
        res.status(201).json({
            id: result.id,
            name: result.name,
            email: result.email,
            phone: result.phone,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});


app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});


app.get('/auth/profile', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});


app.post('/queues', authenticateToken, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const queue = await prisma.queues.create({
            data: {
                name,
                businessId: req.user.userId
            }
        });
        res.status(201).json(queue);
    } catch (error) {
        console.error('Create queue error:', error);
        res.status(500).json({ error: 'Failed to create queue' });
    }
});

app.get('/queues', async (req, res) => {
    try {
        const queues = await prisma.queues.findMany({
            include: {
                _count: {
                    select: { members: true }
                }
            }
        });
        res.json(queues);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch queues' });
    }
});

app.get('/queues/:id', async (req, res) => {
    try {
        const queue = await prisma.queues.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                members: {
                    select: {
                        id: true,
                        joinedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: { joinedAt: 'asc' }
                }
            }
        });
        
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found' });
        }
        
        res.json(queue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch queue details' });
    }
});

app.post('/queues/:id/join', authenticateToken, async (req, res) => {
    const queueId = parseInt(req.params.id);
    
    try {
        const queue = await prisma.queues.findUnique({
            where: { id: queueId },
            include: { _count: { select: { members: true } } }
        });

        if (!queue) {
            return res.status(404).json({ error: 'Queue not found' });
        }

        const nextPosition = (queue._count?.members || 0) + 1;

        const member = await prisma.queueMembers.create({
            data: {
                queueId,
                userId: req.user.userId,
                position: nextPosition
            }
        });

        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ error: 'Failed to join queue' });
    }
});

app.delete('/queues/:id/leave', authenticateToken, async (req, res) => {
    try {
        await prisma.queueMembers.deleteMany({
            where: {
                queueId: parseInt(req.params.id),
                userId: req.user.userId
            }
        });
        res.status(200).json({ message: 'Successfully left the queue' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to leave queue' });
    }
});
app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

