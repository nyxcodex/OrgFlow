import { prisma } from "../src/db.js";

//create project
export const createProject = async (req, res) => {
    try {
        const {userId} = await req.auth();
        const {workspaceId, name, description, status, start_date, end_date, team_members, team_lead, progress, priority} = req.body;

        //check if user has admin role for workspace
        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId
            },
            include: {
                user: true
            }
        });

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        if(!workspace.user.some((member) => member.userId === userId && member.role === "ADMIN")) {
            return res.status(403).json({ message: "Access denied" });
        }

        //Get Team Lead using email
        const teamLead = await prisma.user.findUnique({
            where: {
                email: team_lead
            },
            select: {
                id: true
            }
        });

        const project = await prisma.project.create({
            data: {
                workspaceId,
                name,
                description,
                status,
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null,
                team_lead: teamLead?.id,
                progress,
                priority
            }
        });

        //Add members to the project if they are in the workspace
        if (team_members && team_members?.length > 0) {
            const membersToAdd = []
            workspace.members.forEach((member) => {
                if (team_members.includes(member.user.email)) {
                    membersToAdd.push(member.user.id)
                }
            });
            await prisma.projectMember.createMany({
                data: membersToAdd.map((memberId) => ({
                    projectId: project.id,
                    userId: memberId
                }))
            });
        }

        const projectWithMembers = await prisma.project.findUnique({
            where: {
                id: project.id
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                },
                tasks: {include: {
                    assignee: true, comments: {include: {user: true}}
                }},
                owner: true
            }
        });

        res.json({project: projectWithMembers, message: "Project created successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message })
    }
}

//Update project
export const updateProject = async (req, res) => {
    try {           
        const {userId} = await req.auth();
        const {id, workspaceId, name, description, status, start_date, end_date, progress, priority, team_lead} = req.body;

        //check if user has admin role for workspace
        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId 
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                },
            }
        });

        if(!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        if(!workspace.members.some((member) => member.userId === userId && member.role === "ADMIN")) {
            const project = await prisma.project.findUnique({
                where: {
                    id: id
                }
            });
            
            if(!project) {
                return res.status(404).json({ message: "Project not found" });
            } else if(project.team_lead !== userId) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        const project = await prisma.project.update({
            where: {
                id: id
            },
            data: {
                workspaceId,
                name,
                description,
                status,
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null,
                progress,
                priority,
                team_lead
            }
        });
        res.json({project, message: "Project updated successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message })
    }
}

//Add Member to project
export const addMember = async (req, res) => {
    try {       
        const {userId} = await req.auth();
        const {email} = req.body;
        const {projectId} = req.params;

        //check if user is project lead
        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            },
            include: { members: { include: { user: true } } }   
        });

        if(!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if(project.team_lead !== userId) {
            return res.status(403).json({ message: "Only Project lead can add members" });
        }

        //check if user is already a member of the project
        const existingMember = project.members.find((member) => member.email === email);
        if(existingMember) {
            return res.status(400).json({ message: "User is already a member of the project" });
        }

        const user = await prisma.user.findUnique({
            where: {email}
        });

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const member = await prisma.projectMember.create({
            data: {
                projectId,
                userId: user.id
            }
        });
        res.json({ member, message: "Member added to project successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message })
    }   
}