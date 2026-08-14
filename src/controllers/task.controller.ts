import { Request, Response } from "express";
import { prisma } from "../config/prisma";

const validStatuses = ["PENDING", "IN_PROGRESS", "DONE"];
const validPriorities = ["LOW", "MEDIUM", "HIGH"];

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { projectId } = req.params as { projectId: string };
    const { title, description, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "O título da tarefa é obrigatório.",
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status inválido. Use PENDING, IN_PROGRESS ou DONE.",
      });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Prioridade inválida. Use LOW, MEDIUM ou HIGH.",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Projeto não encontrado.",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "PENDING",
        priority: priority || "MEDIUM",
        projectId,
      },
    });

    return res.status(201).json({
      message: "Tarefa criada com sucesso.",
      task,
    });
  } catch (error) {
    console.error("CREATE_TASK_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao criar tarefa.",
    });
  }
};

export const listTasksByProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { projectId } = req.params as { projectId: string };

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Projeto não encontrado.",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      tasks,
    });
  } catch (error) {
    console.error("LIST_TASKS_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao listar tarefas.",
    });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params as { id: string };

    const task = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
      include: {
        project: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Tarefa não encontrada.",
      });
    }

    return res.json({
      task,
    });
  } catch (error) {
    console.error("GET_TASK_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao buscar tarefa.",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params as { id: string };
    const { title, description, status, priority } = req.body;

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status inválido. Use PENDING, IN_PROGRESS ou DONE.",
      });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Prioridade inválida. Use LOW, MEDIUM ou HIGH.",
      });
    }

    const taskExists = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
    });

    if (!taskExists) {
      return res.status(404).json({
        message: "Tarefa não encontrada.",
      });
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        status,
        priority,
      },
    });

    return res.json({
      message: "Tarefa atualizada com sucesso.",
      task,
    });
  } catch (error) {
    console.error("UPDATE_TASK_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao atualizar tarefa.",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params as { id: string };

    const taskExists = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
    });

    if (!taskExists) {
      return res.status(404).json({
        message: "Tarefa não encontrada.",
      });
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Tarefa deletada com sucesso.",
    });
  } catch (error) {
    console.error("DELETE_TASK_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao deletar tarefa.",
    });
  }
};

export const markTaskAsDone = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params as { id: string };

    const taskExists = await prisma.task.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
    });

    if (!taskExists) {
      return res.status(404).json({
        message: "Tarefa não encontrada.",
      });
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        status: "DONE",
      },
    });

    return res.json({
      message: "Tarefa marcada como concluída.",
      task,
    });
  } catch (error) {
    console.error("MARK_TASK_DONE_ERROR:", error);

    return res.status(500).json({
      message: "Erro interno ao concluir tarefa.",
    });
  }
};