import { Inngest } from "inngest";
import { prisma } from "../src/db.js";
import { sendEmail } from "../configs/nodemailer.js";

export const inngest = new Inngest({ id: "OrgFlow" });

// Inngest function to save user data to the database
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses?.[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  },
);

// Inngest function to delete user data from the database
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  },
);

// Inngest function to update user data in the database
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data?.email_addresses?.[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  },
);

// Inngest function to save workspace data to the database
const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.created" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url,
      },
    });

    // Add creator as ADMIN member
    await prisma.workspaceMember.create({
      data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      },
    });
  },
);

// Inngest function to update workspace data in the database
const syncWorkspaceUpdation = inngest.createFunction(
  {
    id: "update-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.updated" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        slug: data.slug,
        image_url: data.image_url,
      },
    });
  },
);

// Inngest function to delete workspace data from the database
const syncWorkspaceDeletion = inngest.createFunction(
  {
    id: "delete-workspace-with-clerk",
    triggers: [{ event: "clerk/organization.deleted" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.delete({
      where: {
        id: data.id,
      },
    });
  },
);

// Inngest function to save workspace member data to the database
const syncWorkspaceMemberCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
    triggers: [{ event: "clerk/organizationInvitation.accepted" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspaceMember.create({
      data: {
        userId: data.user_id,
        workspaceId: data.organization_id,
        role: String(data.role_name).toUpperCase(),
      },
    });
  },
);

// Inngest Function to Send Email on Task Creation
const sendTaskAssignmentEmail = inngest.createFunction(
  {
    id: "send-task-assignment-mail",
    triggers: [{ event: "app/task.assigned" }],
  },
  async ({ event, step }) => {
    const { taskId } = event.data;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: true,
        project: true,
      },
    });

    if (!task) {
      return { success: false, message: "Task not found for assignment email" };
    }

    const formattedDueDate = task.due_date
      ? new Date(task.due_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Not specified";

    const emailBody = `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f7fb; padding: 32px 0;">
        <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 28px 32px; color: #ffffff;">
            <h2 style="margin: 0; font-size: 26px; font-weight: 700;">New Task Assignment</h2>
          </div>

          <div style="padding: 32px; color: #1f2937; line-height: 1.7;">
            <p style="margin: 0 0 16px; font-size: 16px;">Hi ${task.assignee.name},</p>

            <p style="margin: 0 0 16px; font-size: 16px;">
              You have been assigned a new task in <strong>${task.project.name}</strong>.
            </p>

            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px; font-size: 15px;"><strong>Task:</strong> ${task.title}</p>
              <p style="margin: 0 0 8px; font-size: 15px;"><strong>Project:</strong> ${task.project.name}</p>
              <p style="margin: 0; font-size: 15px;"><strong>Due Date:</strong> ${formattedDueDate}</p>
            </div>

            <p style="margin: 0 0 18px; font-size: 16px;">
              Please log in to OrgFlow to review the task details and get started on the work.
            </p>

            <p style="margin: 0; font-size: 16px;">
              Best regards,<br>
              <strong>OrgFlow Team</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: task.assignee.email,
      subject: `New Task Assignment: ${task.title}`,
      body: emailBody,
    });

    if(new Date(task.due_date).toLocaleDateString() === new Date().toLocaleDateString()) {
      await step.sleepUntil('wait-for-the-due-date', new Date(task.due_date));
      await step.run('check-if-task-is-completed', async () => {
        const task = await prisma.task.findUnique({
          where: { id: taskId },
          include: {
            assignee: true,
            project: true,
          },
        });
      });
    }

    if (task.status !== "DONE") {
      await step.run("send-task-reminder-mail", async () => {
        const reminderEmailBody = `
          <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f7fb; padding: 32px 0;">
            <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 28px 32px; color: #ffffff;">
                <h2 style="margin: 0; font-size: 26px; font-weight: 700;">Task Reminder</h2>
              </div>

              <div style="padding: 32px; color: #1f2937; line-height: 1.7;">
                <p style="margin: 0 0 16px; font-size: 16px;">Hi ${task.assignee.name},</p>

                <p style="margin: 0 0 16px; font-size: 16px;">
                  This is a friendly reminder that your task <strong>${task.title}</strong> in <strong>${task.project.name}</strong> is due today.
                </p>

                <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
                  <p style="margin: 0 0 8px; font-size: 15px;"><strong>Task:</strong> ${task.title}</p>
                  <p style="margin: 0 0 8px; font-size: 15px;"><strong>Project:</strong> ${task.project.name}</p>
                  <p style="margin: 0; font-size: 15px;"><strong>Due Date:</strong> ${formattedDueDate}</p>
                </div>

                <p style="margin: 0 0 18px; font-size: 16px;">
                  Please review the task and take the necessary action before the deadline to keep project progress on track.
                </p>

                <p style="margin: 0; font-size: 16px;">
                  Best regards,<br>
                  <strong>OrgFlow Team</strong>
                </p>
              </div>
            </div>
          </div>
        `;

        await sendEmail({
          to: task.assignee.email,
          subject: `Reminder: Task "${task.title}" is due today`,
          body: reminderEmailBody,
        });
      });
    }

    return { success: true, taskId: task.id };
  },
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,
  syncWorkspaceMemberCreation,
  sendTaskAssignmentEmail
];
