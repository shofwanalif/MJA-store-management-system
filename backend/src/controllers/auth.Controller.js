const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '5m',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashPassword,
        role: 'admin', // Default role, can be changed later
      },
    });

    res.status(201).json({
      message: 'Registered successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid username',
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(400).json({
        message: 'Invalid password',
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
      },
    });

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

const refreshAccessToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({
      message: 'Refresh token is required',
    });
  }

  try {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) {
      return res.status(401).json({
        message: 'invalid refresh token',
      });
    }

    jwt.verify(token, JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'token expired or invalid',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      await prisma.refreshToken.delete({
        where: { token },
      });
      await prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 hari
        },
      });

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to refresh access token',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({
      message: 'Refresh token is required',
    });
  }

  try {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });

    res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to logout',
      error: error.message,
    });
  }
};

const me = async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user.userId,
      role: req.user.role,
    },
  });
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  me,
};
