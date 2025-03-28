# Camber Scouting

[![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-00C7B7?style=flat-square)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Style-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-000000?style=flat-square&logo=shadcnui)](https://ui.shadcn.com/)

A modern web application for FRC teams to collect and analyze match scouting data during competitions. This system helps teams track performance metrics and make data-driven strategic decisions.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Core Features](#core-features)
  - [Authentication](#authentication)
  - [Team Management](#team-management)
  - [Match Scouting](#match-scouting)
  - [Data Analysis](#data-analysis)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Team registration and management
- Match scouting data collection
- Real-time data updates
- Performance analytics
- Responsive design for mobile scouting
- Multi-team support

## Technology Stack

- **Frontend**: Next.js with React
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom auth implementation
- **UI Components**: Shadcn UI
- **State Management**: SWR for data fetching

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/camber-scouting.git
cd camber-scouting
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Run database migrations

```bash
npm run db:migrate
```

5. Start the development server

```bash
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/camber_scouting
BETTER_AUTH_URL=your-auth-service-url
# Add any additional environment variables
```

## Core Features

### Authentication

- Email/password authentication
- Session management
- Protected routes and API endpoints

### Team Management

- Add and manage FRC teams
- Track team performance history
- Search and filter teams

### Match Scouting

- Comprehensive match data collection
- Real-time data validation
- Support for multiple alliance positions
- Tracking of autonomous and teleop performance

### Data Analysis

- Match statistics
- Performance trends
- Alliance selection assistance

## API Reference

### Authentication Endpoints

- `POST /api/sign-in` - User sign in
- `POST /api/sign-up` - User registration

### Team Endpoints

- `GET /api/team` - List teams
- `POST /api/team` - Create team
- `GET /api/team/[id]` - Get team details
- `GET /api/team/[id]/matches` - Get team matches

### Match Endpoints

- `POST /api/match/create` - Create match
- `GET /api/match/[id]` - Get match details
- `PUT /api/match/[id]` - Update match data

## Database Schema

```sql
-- Key tables in the database
Table user {
  id text [pk]
  email text
  name text
  emailVerified boolean
  createdAt timestamp
  updatedAt timestamp
}

Table team {
  id integer [pk]
  name text
  matches text[]
}

Table match {
  matchNumber integer
  teamId integer
  alliance text
  position integer
  // Additional match data fields
}
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the FIRST Robotics Competition community.
