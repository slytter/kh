# kh source code
Add .env with following keys:

```
SUPABASE_URL
SUPABASE_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY
BREVO_API_KEY
```

kh uses below services:
- Supabase as db
- BunnyCDN as storage
- imgix as image compression
- Brevo as email service
- cron-job.org as scheduler
- Soon stripe as payment

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
