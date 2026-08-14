import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, email e senha são obrigatórios.",
      });
    }

    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      return res.status(400).json({
        message: "Este email já está cadastrado.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      user,
    });
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao cadastrar usuário.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email ou senha inválidos.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Email ou senha inválidos.",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login realizado com sucesso.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao realizar login.",
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    console.error("GET_ME_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao buscar usuário.",
    });
  }
};