# Envox

> **Warning**
> This application is a project in progress and has been made with the main objective of learning the use of new technologies while solving a common problem in the world of programming.

Welcome to Envox, an open-source web application designed to solve the problem of securely sharing .env files within a team. Envox utilizes the power of Next.js 13, Supabase authentication, cache management, server components, API routes, Next.js 13 server actions, tailwindcss, some modified [shadcn ui](https://ui.shadcn.com/) components which are based on RadixUI, and Supabase as a backend.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Envox is built with the goal of simplifying and securing the sharing of .env files among team members in web projects, ensuring that sensitive information in the .env files remains protected through the use of pgsodium encryption. In summary, an easy solution for managing your projects .env files.

## Features

- **Secure Encryption:** Supabase pgsodium encryption to ensure the protection of your .env files, keeping your api keys safe.
- **Next.js Integration:** Built on Next.js 13, Utilizing its powerful features like server-side rendering, server components, and API routes for a seamless web application experience.
- **Authentication:** User authentication to ensure that only authorized users can access and share .env files.
- **Cache Management:** Something that can cause a lot of headaches is cache engineering. In this project we also want to learn how to make better use of it.
- **Server Actions:** The implementation of the new features server actions from Nextjs 13, is also interesting in some situations.
- **Supabase Integration:** You can create a project on supabase and have your own data tables.

## Installation

To install and run Envox locally, follow these steps:

1. Clone the Envox repository: `https://github.com/JepriCreations/envox.git`
2. Navigate to the project directory: `cd envox`
3. Install dependencies: `npm install`
4. Configure Supabase credentials in `.env.local` file. following the `.env.example` file.
5. Start the development server: `npm run dev`

## Usage

Once you have Envox up and running, follow these steps to securely share .env documents:

1. Sign up for an account or log in with your existing credentials.
2. Create a new project and invite team members to join.
3. Upload your .env file content.
4. Share the encrypted .env file securely with your team.
5. Team members can access the shared .env files and perform actions depending on their role.

## Contributing (Pending)

Contributions to Envox are welcome! If you'd like to contribute, please follow the guidelines outlined in [CONTRIBUTING.md](CONTRIBUTING.md). We appreciate your help in making Envox even better.

## License

Envox is released under the [MIT License](LICENSE). Feel free to use, modify, and distribute this project according to the terms of the license.
