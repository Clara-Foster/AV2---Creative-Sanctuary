# Deploy (Cloud Run + Cloud SQL)

Variáveis de ambiente necessárias:
- `APP_URL` — URL pública do serviço (ex: https://meu-app.a.run.app)
- `JWT_SECRET` — segredo para assinar JWTs
- `CLOUD_SQL_CONNECTION_NAME` — `project:region:instance`
- `DB_USER`, `DB_PASS`, `DB_NAME` — credenciais do Postgres
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — OAuth credentials

Build & deploy (exemplo):

```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/APP_NAME

# Deploy to Cloud Run (add Cloud SQL instance name)
gcloud run deploy APP_NAME \
  --image gcr.io/PROJECT_ID/APP_NAME \
  --region REGION \
  --platform managed \
  --add-cloudsql-instances=$CLOUD_SQL_CONNECTION_NAME \
  --set-env-vars=APP_URL=$APP_URL,JWT_SECRET=$JWT_SECRET,CLOUD_SQL_CONNECTION_NAME=$CLOUD_SQL_CONNECTION_NAME,DB_USER=$DB_USER,DB_PASS=$DB_PASS,DB_NAME=$DB_NAME,GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
```

Para desenvolvimento local usando Cloud SQL Auth Proxy, consulte a documentação do Cloud SQL.
