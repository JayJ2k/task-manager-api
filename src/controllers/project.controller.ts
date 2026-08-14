import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "O título do projeto é obrigatório.",
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId,
      },
    });

    return res.status(201).json({
      message: "Projeto criado com sucesso.",
      project,
    });
  } catch (error) {
    console.error("CREATE_PROJECT_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao criar projeto.",
    });
  }
};

export const listProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      include: {
        tasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      projects,
    });
  } catch (error) {
    console.error("LIST_PROJECTS_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao listar projetos.",
    });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params as { id: string };

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        tasks: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Projeto não encontrado.",
      });
    }

    return res.json({
      project,
    });
  } catch (error) {
    console.error("GET_PROJECT_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao buscar projeto.",
    });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params as { id: string };
    const { title, description } = req.body;

    const projectExists = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!projectExists) {
      return res.status(404).json({
        message: "Projeto não encontrado.",
      });
    }

    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        title,
        description,
      },
    });

    return res.json({
      message: "Projeto atualizado com sucesso.",
      project,
    });
  } catch (error) {
    console.error("UPDATE_PROJECT_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao atualizar projeto.",
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params as { id: string };

    const projectExists = await prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!projectExists) {
      return res.status(404).json({
        message: "Projeto não encontrado.",
      });
    }

    await prisma.project.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Projeto deletado com sucesso.",
    });
  } catch (error) {
    console.error("DELETE_PROJECT_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao deletar projeto.",
    });
  }
};