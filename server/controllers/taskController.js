import { prisma } from "../src/db.js";
import {inngest} from "../inngest/index.js";

//create task
export const createTask = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { title, description, status, priority, projectId, type, assigneeId, due_date } = req.body;

        if (!title || !projectId || !assigneeId || !due_date) {
            return res.status(400).json({
                message: "Title, project, assignee, and due date are required",
            });
        }

        const dueDate = new Date(due_date);
        if (Number.isNaN(dueDate.getTime())) {
            return res.status(400).json({ message: "Due date is invalid" });
        }

        //check if user has admin role in the project'
        const project = await prisma.project.findUnique({    
            where: {
                id: projectId
            },
            include: {
                members: true,
            }
        });
        
        if(!project) {
            return res.status(404).json({ message: "Project not found" });
        } else if(project.team_lead !== userId) {
            return res.status(403).json({ message: "You are not authorized to create a task in this project" });
        } else if (!project.members.some((member) => member.userId === assigneeId)) {
            return res.status(403).json({ message: "Assignee is not a member of the project" });
        }
        const task = await prisma.task.create({
            data: {
                title,
                projectId,
                description,
                status,
                priority,
                type,
                assigneeId,
                due_date: dueDate,
            },
        });

        const taskWithAssignee = await prisma.task.findUnique({
            where: {
                id: task.id     
        },
        include: {
            assignee: true
        }
    });

    try {
      await inngest.send({
        name: "app/task.assigned",
        data: {
          taskId: task.id,
        },
      });
    } catch (error) {
      console.error("Failed to send task assignment event:", error);
    }

    res.json({task: taskWithAssignee, message: "Task created successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message })
    }
};


//update task
export const updateTask = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: req.params.id
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { userId } = await req.auth();

    //check if user has admin role in the project
    const project = await prisma.project.findUnique({
      where: {
        id: task.projectId,
      },
      include: {
        members: {include: { user: true }},
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    } else if (project.team_lead !== userId) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to update this task",
        });
    } 

    const updatedTask = await prisma.task.update({  
        where: {
            id: req.params.id
        },
        data: req.body,
        include: {
          assignee: true,
        },
    });

    res.json({ task: updatedTask, message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};


//delete task
export const deleteTask = async (req, res) => {
  try {
    const {userId} = await req.auth();
    const {tasksIds} = req.body;
    const tasks = await prisma.task.findMany({
      where: {
        id: { in: tasksIds }
      },
    });

    if(tasks.length === 0) {
      return res.status(404).json({ message: "Tasks not found" });
    }

    //check if user has admin role in the project
    const project = await prisma.project.findUnique({
      where: {
        id: tasks[0].projectId,
      },
      include: {
        members: {include: { user: true }},
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    } else if (project.team_lead !== userId) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to delete this task",
        });
    }

    await prisma.task.deleteMany({
      where: {
        id: { in: tasksIds }
      }
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
