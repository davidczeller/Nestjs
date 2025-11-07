# Vercel Database Setup Guide

## ✅ Configuration Complete

Your NestJS project is now configured to work with Vercel Postgres (Neon).

## 🔧 Local Development Setup

Add these variables to your `.env` file (create if it doesn't exist):

```bash
# Vercel Postgres Connection (Pooled - for app runtime)
POSTGRES_URL=postgresql://neondb_owner:npg_8HJGNPzdZsg5@ep-long-tree-abs7k8ub-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require

# Non-Pooled Connection (for migrations)
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_8HJGNPzdZsg5@ep-long-tree-abs7k8ub.eu-west-2.aws.neon.tech/neondb?sslmode=require

# Auth Configuration
JWT_SECRET=your-local-dev-secret-key
JWT_EXPIRES_IN=3600

# App Configuration
PORT=3000
NODE_ENV=development
DB_SYNC=false
```

## 🚀 Vercel Deployment Setup

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `POSTGRES_URL` | `postgresql://neondb_owner:npg_8HJGNPzdZsg5@ep-long-tree-abs7k8ub-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require` | Production, Preview, Development |
| `POSTGRES_URL_NON_POOLING` | `postgresql://neondb_owner:npg_8HJGNPzdZsg5@ep-long-tree-abs7k8ub.eu-west-2.aws.neon.tech/neondb?sslmode=require` | Production, Preview, Development |
| `JWT_SECRET` | Your secure JWT secret | Production, Preview, Development |
| `JWT_EXPIRES_IN` | `3600` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production only |
| `DB_SYNC` | `false` | All environments |

### Step 2: Link Your Database (if not already done)

If you created the database through Vercel Storage:
- Vercel automatically injects these variables
- You can verify in **Storage** → Your Database → **.env.local** tab

### Step 3: Run Migrations

After deployment, you need to run migrations. You have two options:

#### Option A: Run migrations locally against production database
```bash
npm run migration:run:prod
```

#### Option B: Let migrations run automatically on deployment
Your `start:prod` script already includes migrations:
```json
"start:prod": "npm run migration:run:prod && node dist/main"
```

This will run migrations automatically when the app starts on Vercel.

## 🔄 Database Migrations

### Generate a new migration
```bash
npm run migration:generate -- src/migrations/YourMigrationName
```

### Run migrations
```bash
npm run migration:run
```

## 📝 Important Notes

### Connection Types Explained

1. **Pooled Connection (`POSTGRES_URL`)**
   - Uses pgbouncer for connection pooling
   - Better performance and resource usage
   - Used by the main application

2. **Non-Pooled Connection (`POSTGRES_URL_NON_POOLING`)**
   - Direct connection to database
   - Required for TypeORM migrations
   - Supports all database features

### Why Two Connections?

TypeORM migrations require certain database features that aren't available through connection poolers like pgbouncer. The app uses:
- **Pooled** for runtime queries (faster, more efficient)
- **Non-pooled** for migrations (full feature support)

## 🧪 Testing the Connection

### Locally
```bash
npm run start:dev
```

Check the logs - you should see successful database connection messages.

### On Vercel
After deployment, check the deployment logs to ensure:
1. Build completed successfully
2. Migrations ran successfully
3. Application started without database connection errors

## 🐛 Troubleshooting

### "Connection timeout" errors
- Verify your database is active on Vercel
- Check that SSL is enabled (Neon requires SSL)
- Confirm environment variables are set correctly

### "SSL SYSCALL error"
- Make sure `sslmode=require` is in your connection string
- The SSL configuration in the code has `rejectUnauthorized: false`

### Migrations failing
- Ensure you're using `POSTGRES_URL_NON_POOLING` for migrations
- Check that the migration files are in `dist/migrations/` after build

## 📚 Next Steps

1. ✅ Configure environment variables in Vercel
2. ✅ Deploy your application
3. ✅ Verify migrations run successfully
4. ✅ Test your API endpoints

## 🔐 Security Reminder

⚠️ **Never commit your `.env` file to git!**

Your `.gitignore` should already include `.env`, but double-check:
```bash
cat .gitignore | grep .env
```

If you need to rotate credentials:
1. Generate new database credentials in Vercel
2. Update environment variables in Vercel dashboard
3. Redeploy your application

