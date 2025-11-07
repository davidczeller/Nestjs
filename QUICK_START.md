# 🚀 Quick Start - Vercel Database Connection

## ✅ What I've Done

1. ✅ **Updated database configuration** (`src/config/database.config.ts`)
   - Now supports both connection URL and individual parameters
   - Uses pooled connection for better performance
   - Configured SSL for Neon database

2. ✅ **Updated TypeORM migration config** (`src/typeorm.config.ts`)
   - Uses non-pooled connection for migrations (required by TypeORM)
   - Supports both Vercel/Neon URL formats

3. ✅ **Updated validation schema** (`src/config/config.types.ts`)
   - Accepts both POSTGRES_URL and individual DB parameters
   - Validates all Vercel/Neon environment variables

4. ✅ **Fixed Vercel configuration** (`vercel.json`)
   - Moved from `src/` to root directory
   - Configured to use built output (`dist/main.js`)

5. ✅ **Verified build** - Everything compiles successfully!

## 🎯 What You Need to Do Next

### Step 1: Add Environment Variables to Vercel (5 minutes)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these **6 variables** (for Production, Preview, and Development):

| Variable | Value |
|----------|-------|
| `POSTGRES_URL` | `postgresql://neondb_owner:npg_8HJGNPzdZsg5@ep-long-tree-abs7k8ub-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require` |
| `POSTGRES_URL_NON_POOLING` | `postgresql://neondb_owner:npg_8HJGNPzdZsg5@ep-long-tree-abs7k8ub.eu-west-2.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | `90a056dee6d0f36d0cc956a1bdd15b587411116e590b28d0708abeb8845255c7b63ef2dede8872a92c7841085ec5733134806a5656bcc307ff46b1c6f5942763` |
| `JWT_EXPIRES_IN` | `3600` |
| `NODE_ENV` | `production` *(Production only)* |
| `DB_SYNC` | `false` |

> 📋 See `VERCEL_ENV_VARS.txt` for copy-paste ready format

### Step 2: Deploy to Vercel

```bash
git add .
git commit -m "Configure Vercel Postgres database connection"
git push
```

Vercel will automatically deploy your changes.

### Step 3: Verify Deployment

1. Go to your Vercel deployment logs
2. Check for successful:
   - ✅ Build completion
   - ✅ Migration execution
   - ✅ Application startup

### Step 4: Test Your API

Visit your Vercel URL and test an endpoint:
```bash
curl https://your-project.vercel.app/tasks
```

## 💻 Local Development Setup

Create a `.env` file in the project root:

```bash
# Database
POSTGRES_URL=postgresql://neondb_owner:npg_8HJGNPzdZsg5@ep-long-tree-abs7k8ub-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_8HJGNPzdZsg5@ep-long-tree-abs7k8ub.eu-west-2.aws.neon.tech/neondb?sslmode=require

# Auth
JWT_SECRET=90a056dee6d0f36d0cc956a1bdd15b587411116e590b28d0708abeb8845255c7b63ef2dede8872a92c7841085ec5733134806a5656bcc307ff46b1c6f5942763
JWT_EXPIRES_IN=3600

# App
NODE_ENV=development
DB_SYNC=false
```

Then run:
```bash
npm run start:dev
```

## 🔄 Running Migrations

Your `start:prod` script automatically runs migrations on deployment.

To run manually:
```bash
npm run migration:run
```

To generate new migrations:
```bash
npm run migration:generate -- src/migrations/YourMigrationName
```

## 📚 Additional Resources

- `VERCEL_SETUP.md` - Detailed setup guide with troubleshooting
- `VERCEL_ENV_VARS.txt` - Copy-paste ready environment variables

## 🎉 That's It!

Your NestJS app is now configured to work with Vercel Postgres. Once you add the environment variables and deploy, everything should work automatically!

## ❓ Questions?

- Check the logs in Vercel dashboard
- Review `VERCEL_SETUP.md` for troubleshooting
- Verify all environment variables are set correctly

