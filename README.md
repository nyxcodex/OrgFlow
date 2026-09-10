# 📊 OrgFlow - Collaborative Project Management

OrgFlow is a full-stack project management application for organizing workspaces, projects, tasks, and teams in one place. It gives teams a shared space to plan projects, assign work, track progress, and collaborate through task comments and notifications.

OrgFlow is built with the **PERN stack**: PostgreSQL, Express.js, React.js, and Node.js.

## 🌐 Live Demo

🚀 [View OrgFlow Live Demo](https://org-flow-seven.vercel.app/)

## 🚀 Features

- Clerk-powered authentication and organization/workspace management
- Workspace member invitations and team management
- Project creation, status, priority, progress, and member assignment
- Task creation, assignment, due dates, priorities, types, and status tracking
- Task comments and task detail views
- Dashboard summaries, project analytics, calendar, and recent activity
- Email notifications for task assignments and reminders
- Light and dark theme support

## 🛠️ Tech Stack

### Frontend

- React 19 and Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Axios
- Recharts
- Clerk React

### Backend

- Node.js and Express 5
- Prisma ORM
- PostgreSQL with Neon
- Clerk Express
- Inngest background functions
- Nodemailer with Brevo SMTP

## 🧰 Libraries and Tools

| Library or service | Purpose |
| --- | --- |
| **Clerk** | Authentication, organizations, and workspace membership |
| **Prisma** | Type-safe PostgreSQL database access |
| **Neon** | Hosted PostgreSQL database |
| **Inngest** | Event-driven synchronization and background jobs |
| **Nodemailer** | Task assignment and reminder emails |
| **Redux Toolkit** | Client-side workspace and theme state |
| **Recharts** | Project analytics and dashboard visualizations |
| **React Hot Toast** | In-app success and error notifications |

## 📸 Screenshots

Add your screenshots to a `screenshots/` folder in the project root using these filenames:

```text
screenshots/
├── dashboard.png
├── projects.png
├── project-details.png
├── tasks.png
├── task-details.png
├── team.png
├── workspace-invitation-email.png
├── task-assignment-email.png
└── task-due-reminder-email.png
```

The screenshots are displayed in a compact 3-column by 3-row grid:

<table>
	<tr>
		<td width="33%"><img src="./screenshots/dashboard.png" alt="Dashboard"><br><strong>Dashboard</strong></td>
		<td width="33%"><img src="./screenshots/projects.png" alt="Projects"><br><strong>Projects</strong></td>
		<td width="33%"><img src="./screenshots/project-details.png" alt="Project Details"><br><strong>Project Details</strong></td>
	</tr>
	<tr>
		<td width="33%"><img src="./screenshots/tasks.png" alt="Tasks"><br><strong>Tasks</strong></td>
		<td width="33%"><img src="./screenshots/task-details.png" alt="Task Details"><br><strong>Task Details</strong></td>
		<td width="33%"><img src="./screenshots/team.png" alt="Team"><br><strong>Team</strong></td>
	</tr>
	<tr>
		<td width="33%"><img src="./screenshots/workspace-invitation-email.png" alt="Workspace Invitation Email"><br><strong>Workspace Invitation Email</strong></td>
		<td width="33%"><img src="./screenshots/task-assignment-email.png" alt="Task Assignment Email"><br><strong>Task Assignment Email</strong></td>
		<td width="33%"><img src="./screenshots/task-due-reminder-email.png" alt="Task Due Reminder Email"><br><strong>Task Due Reminder Email</strong></td>
	</tr>
</table>

## 📂 Project Structure

```text
OrgFlow/
├── client/       # React/Vite frontend
│   └── src/
├── server/       # Express API, Prisma schema, and background functions
│   ├── controllers/
│   ├── inngest/
│   ├── prisma/
│   ├── routes/
│   └── src/
├── screenshots/   # README screenshots
└── README.md
```

## ✅ Prerequisites

- Node.js 18 or newer
- npm
- A Clerk application
- A PostgreSQL database, such as Neon
- An Inngest account for background functions
- SMTP credentials if email notifications are enabled

## ⚙️ Installation

### 1. Clone the Repository

Clone the repository and install dependencies in both applications:

```bash
git clone https://github.com/<your-username>/orgflow.git
cd orgflow

cd client
npm install

cd ../server
npm install
```

### 2. Configure the Client

Create `client/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_BASEURL=http://localhost:5000
```

### 3. Configure the Server

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development

CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

DATABASE_URL=postgresql://user:password@host/database?sslmode=require
DIRECT_URL=postgresql://user:password@host/database?sslmode=require

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

SENDER_EMAIL=notifications@example.com
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

`DATABASE_URL` is used by the application database client. `DIRECT_URL` is used by Prisma configuration. Depending on your PostgreSQL provider, these may point to the same database connection or use separate pooled and direct connections.

Never commit `.env` files or real credentials. Rotate any credentials that have been exposed publicly.

### 4. Set Up the Database

From the server directory, generate the Prisma client and apply the schema to your database:

```bash
cd server
npx prisma generate
npx prisma db push
```

For a migration-based workflow, use Prisma migrations instead of `db push`:

```bash
npx prisma migrate dev --name init
```

### 5. Run Locally

Start the API server in one terminal:

```bash
cd server
npm run server
```

Start the Vite client in another terminal:

```bash
cd client
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## 📜 Available Scripts

### Client

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Server

| Command | Description |
| --- | --- |
| `npm run server` | Start the API with Nodemon |
| `npm start` | Generate Prisma client and start the server |
| `npm run postinstall` | Generate the Prisma client after installation |

## 🔗 API Overview

All application API routes require Clerk authentication and are served by the Express server:

- `GET /` - Health check
- `/api/workspaces` - Workspace and membership operations
- `/api/projects` - Project creation, updates, and membership operations
- `/api/tasks` - Task creation, updates, and deletion
- `/api/comments` - Task comments
- `/api/inngest` - Inngest function endpoint

The frontend sends authenticated requests using Clerk bearer tokens.

## ☁️ Deployment

The client and server each include a `vercel.json` file and can be deployed as separate Vercel projects.

1. Deploy `client/` as the frontend project.
2. Set the client environment variables in Vercel and point `VITE_BASEURL` to the deployed API URL.
3. Deploy `server/` as the backend project.
4. Set all server environment variables in the backend project.
5. Configure Clerk webhooks to reach the deployed Inngest/Clerk integration as required by your Clerk and Inngest setup.
6. Update CORS configuration before production if the API should accept requests only from the deployed client domain.

## 🎯 Future Enhancements

- Granular project and workspace permissions
- More configurable dashboard widgets
- Advanced task filtering and search
- Richer project activity history
- Expanded notification preferences
- Automated test coverage for client and server workflows

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and run the relevant lint or build commands.
4. Commit and push your branch.
5. Open a pull request with a clear description of the change.

## 📄 License

This project is currently private and does not include a declared open-source license. Add a license before accepting external contributions or redistributing the project.
