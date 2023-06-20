# dotenv

> **Warning**
> This application is a project in progress and has been made with the main objective of learning the use of new technologies while solving a common problem in the world of programming.

Welcome to dotenv, an open-source web application designed to solve the problem of securely sharing Environment Variables within a team. dotenv utilizes the power of Next.js 13, Supabase authentication, cache management, server components, API routes, Next.js 13 server actions, tailwindcss, some modified [shadcn ui](https://ui.shadcn.com/) components which are based on RadixUI, and Supabase as a backend.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

dotenv is built with the goal of simplifying and securing the sharing of environment variables among team members, ensuring that sensitive information remains protected through the use of pgsodium encryption.

## Features

- **Secure Encryption:** It use PostgreSQL pgsodium encryption to ensure the protection of your projects environment variables.
- **Next.js Integration:** Built on Next.js 13.
- **Authentication:** User authentication to ensure that only authorized users can access and share environment variables.
- **Cache Management:** Something that can cause a lot of headaches is cache engineering. In this project we also want to learn how to make better use of it.
- **Server Actions:** The implementation of the new features server actions from Nextjs 13 (currently in beta), is also interesting in some situations.
- **Supabase Integration:** You can create a project on supabase and set up your own database.

## Installation

To install and run dotenv locally, follow these steps:

1. Clone the dotenv repository: `git clone https://github.com/JepriCreations/dotenv.git`
2. Navigate to the project directory: `cd dotenv`
3. Install dependencies: `pnpm install`
4. Set the Supabase credentials in `.env.local` file. following the `.env.example` file.
5. Start the development server: `pnpm dev`

## Contributing (Pending)

Contributions to dotenv are welcome! If you'd like to contribute, please follow the guidelines outlined in [CONTRIBUTING.md](CONTRIBUTING.md). We appreciate your help in making dotenv even better.

## License

Licensed under the [MIT license](LICENSE.md). Feel free to use, modify, and distribute this project according to the terms of the license.
