# SafeRoad TN — Backend

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:
   - `MONGO_URI` — free cluster at https://www.mongodb.com/atlas (Database Access > create user, Network Access > allow 0.0.0.0/0 for dev)
   - `JWT_SECRET` — any random long string
   - `GEMINI_API_KEY` — from https://aistudio.google.com/apikey
   - `CLOUDINARY_*` — from your Cloudinary dashboard

3. Run in dev mode:
   ```
   npm run dev
   ```
   Server starts on http://localhost:5000

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | - | Register new user |
| POST | /api/auth/login | - | Login, returns JWT |
| POST | /api/complaints | citizen | Create report (multipart form: image, description, lat, lng, address, district) |
| GET | /api/complaints | - | List all complaints (filter by ?district=&severity=&status=) |
| GET | /api/complaints/mine | citizen | Logged-in user's complaints |
| PATCH | /api/complaints/:id/status | admin | Update complaint status |

## Making a user an admin

There's no signup flow for admins yet (by design — keeps it simple for MVP).
After signing up normally, manually edit that user's `role` field to `"admin"`
in MongoDB Atlas (Collections > users > edit document). We can add a proper
admin-invite flow later if you have time.

## Testing the AI endpoint

Use Postman or Thunder Client:
- POST http://localhost:5000/api/complaints
- Headers: Authorization: Bearer <token from login>
- Body: form-data with fields: image (file), description (text), lat, lng, address, district
