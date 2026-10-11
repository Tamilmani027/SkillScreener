Backend
=======

Run the backend express server (requires Node.js):

Install dependencies:

```bash
cd backend
npm install
```

Run in development:

```bash
npm run dev
```

The server exposes `POST /api/compare` which accepts form-data fields `resume` and `jd` (files).
