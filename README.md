# MessageManagement
A complete Telegram Bot management system that allows administrators to monitor all Telegram Bot conversations and respond to Telegram Users through a web dashboard

## Telegram Bot Features:
- Listen to all incoming messages from Telegram users
- Record all incoming and outgoing messages to database
- Support text messages, images files
- Auto-reply with configurable welcome message

## Admin Dashboard Features:
- Authentication: Admin login/logout
- Conversation List: View all conversations with users
- Conversation Detail: View full message history with a specific user
- Real-time Updates: New messages appear without page refresh (WebSocket/Polling)
- Reply as Bot: Admin can type and send messages to users as the bot
- Search & Filter: Search conversations by username, filter by date/status
- Message Status: Mark conversations as read/unread, resolved/pending
- Welcome message: Admin can config the welcome message
- Send broadcast message: Admin can send messages to all users

## Project overview
![alt text]({5432DAB9-B8CD-4902-ACD8-F23FE22D6FCA}.png)

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```
For example:

```sh
npx nx build myproject
```

To run all project with Nx use:
```sh
npx nx run-many -t serve -p api,web --no-tui
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:
```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Generate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Tech Stack
- BackEnd: NestJS, Express, Telegraf, Multer, BullMQ, SocketIO (Websocket)
- FrontEnd: ReactJS, React Router, Zod, Tiptap Editor, RadixUI, Tailwind css
- Database & ORM: MongoDB, Redis, Prisma
- Containerization: Docker
- Monorepo & Build Tool: Nx
