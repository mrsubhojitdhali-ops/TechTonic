# TechTonic - Legal Metrology MVP (Fixed)

Architecture:
- Trader Web Portal
- Inspector Internal Web Dashboard
- Express REST API
- MongoDB via Mongoose
- Certificate + QR generation after inspector approval
- Public certificate verification

## Run backend
1. `cd Backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your MongoDB URI and secrets.
4. `npm start`

The backend automatically creates the demo inspector in MongoDB on first startup:
- Email: inspector@wb.gov.in
- Password: Inspector@123

## Run frontend
1. `cd Frontend`
2. `npm install`
3. Copy `.env.example` to `.env` if the API is not on localhost:5000.
4. `npm start`

Frontend default: http://localhost:3000
Backend default: http://localhost:5000

## Important
Do not commit `.env` files or MongoDB credentials. If credentials from an old `.env` were exposed, rotate them in MongoDB Atlas and replace the local `.env`.
