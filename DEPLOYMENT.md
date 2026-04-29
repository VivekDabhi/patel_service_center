# 🚀 Deployment Guide — Free Stack

| Layer    | Service        | Free URL                          |
|----------|----------------|-----------------------------------|
| Database | neon.tech      | Managed PostgreSQL                |
| Backend  | render.com     | `patel-service-center-api.onrender.com` |
| Frontend | vercel.com     | `patel-service-center.vercel.app` |

---

## Step 1 — Database (Neon.tech)

1. Go to https://neon.tech → Sign up (free)
2. Create a new project → name it `patel-service-center`
3. Copy the **Connection String** — looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Save it — you'll need it in Step 2

---

## Step 2 — Backend (Render.com)

1. Go to https://render.com → Sign up with GitHub
2. Click **New → Web Service**
3. Connect your repo: `VivekDabhi/patel_service_center`
4. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add these **Environment Variables** in Render dashboard:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | *(paste Neon connection string)* |
   | `SECRET_KEY` | *(any long random string)* |
   | `ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
   | `FRONTEND_URL` | *(paste Vercel URL after Step 3)* |
   | `BUSINESS_NAME` | `New Ranip Two-Wheeler Service Station` |
   | `BUSINESS_PHONE` | `+918511100434` |
   | `BUSINESS_ADDRESS` | `New Ranip, Ahmedabad, Gujarat` |
   | `TWILIO_ACCOUNT_SID` | *(your Twilio SID)* |
   | `TWILIO_AUTH_TOKEN` | *(your Twilio token)* |
   | `TWILIO_WHATSAPP_NUMBER` | `whatsapp:+14155238886` |
   | `RAZORPAY_KEY_ID` | *(your Razorpay key)* |
   | `RAZORPAY_KEY_SECRET` | *(your Razorpay secret)* |

6. Click **Deploy**
7. Once deployed, run migrations via Render **Shell** tab:
   ```bash
   alembic upgrade head
   ```
8. Copy your Render URL: `https://patel-service-center-api.onrender.com`

---

## Step 3 — Frontend (Vercel.com)

1. Go to https://vercel.com → Sign up with GitHub
2. Click **Add New → Project**
3. Import repo: `VivekDabhi/patel_service_center`
4. Settings:
   - **Root Directory:** `web`
   - **Framework Preset:** Create React App
5. Add **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | `https://patel-service-center-api.onrender.com` |

6. Click **Deploy**
7. Copy your Vercel URL and paste it as `FRONTEND_URL` in Render (Step 2)

---

## Step 4 — Create First Admin

After both are deployed, open Render Shell:
```bash
python reset_admin.py
```
Or use Swagger UI at `https://patel-service-center-api.onrender.com/docs`:
1. `POST /api/auth/register` — create user
2. In Neon SQL editor:
   ```sql
   UPDATE users SET role = 'admin' WHERE phone = '+91XXXXXXXXXX';
   ```

---

## Notes

- Render free tier **spins down after 15 min** of inactivity — first request after idle takes ~30 sec to wake up
- Neon free tier: **0.5 GB** storage — enough for hundreds of customers
- Vercel free tier: **unlimited** deployments
- Every `git push` to `main` branch auto-deploys both frontend and backend
