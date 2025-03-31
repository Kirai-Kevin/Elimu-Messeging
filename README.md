# Elimu Chat Application

A real-time chat application designed for educational institutions, enabling seamless communication between students and instructors.

## Features

- Real-time messaging using SendBird and Socket.IO
- User authentication and authorization
- Group channels and direct messaging
- Message notifications
- Modern, responsive UI with Material-UI
- TypeScript support for better type safety

## Tech Stack

### Frontend
- React + TypeScript (Vite)
- Material-UI
- SendBird UI Kit
- Socket.IO Client

### Backend
- NestJS
- SendBird SDK
- Socket.IO
- JWT Authentication

## Project Structure

```
elimu-messaging/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API and chat services
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   └── .env              # Frontend environment variables
│
└── backend/              # NestJS backend
    ├── src/
    │   ├── modules/      # Feature modules
    │   ├── gateways/     # WebSocket gateways
    │   └── services/     # Business logic services
    └── .env              # Backend environment variables
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SendBird account and API credentials

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/elimu-messaging.git
cd elimu-messaging
```

2. Set up frontend:
```bash
cd frontend
npm install
cp .env.example .env # Configure your environment variables
npm run dev
```

3. Set up backend:
```bash
cd backend
npm install
cp .env.example .env # Configure your environment variables
npm run start:dev
```

## Environment Variables

### Frontend (.env)
```
VITE_SENDBIRD_APP_ID=your_sendbird_app_id
VITE_BACKEND_URL=your_backend_url
```

### Backend (.env)
```
SENDBIRD_APP_ID=your_sendbird_app_id
SENDBIRD_API_TOKEN=your_api_token
JWT_SECRET=your_jwt_secret
```

## Development

- Frontend development server runs on `http://localhost:5173`
- Backend development server runs on `http://localhost:3000`

## Deployment

The application is deployed on Render:
- Frontend: https://elimu-chat-frontend.onrender.com
- Backend: https://elimu-chat-backend.onrender.com

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.