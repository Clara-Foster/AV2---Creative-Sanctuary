<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/44d03ac2-b730-488d-b608-6d4ba2dac859

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
3. Configure Supabase Auth:
   - In Supabase, enable Email auth and Google provider.
   - Add `http://localhost:3000` as a site URL.
   - Add your Google OAuth client ID/secret in Supabase Auth > Providers > Google.
4. Run the app:
   `npm run dev`

## Supabase Notes

- This app now uses Supabase Auth directly from the client.
- No custom backend is required for login, registration, or Google OAuth.
- Keep the anon key in the client env only; do not expose the service role key.
