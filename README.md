# Weather Explorer

A full-stack weather data explorer that fetches historical daily weather from the [Open-Meteo API](https://open-meteo.com/), stores the raw JSON in **AWS S3**, and provides a glassmorphism dashboard to visualize temperature trends.

Built for the InRisk Labs Full Stack Engineer case study.

---

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Next.js 16    │ ──── │  FastAPI (Python) │ ──── │   AWS S3     │
│   Dashboard     │ HTTP │  REST API         │ SDK  │   (Storage)  │
│   (Vercel)      │      │  (Lambda + APIGW) │      │   Free Tier  │
└─────────────────┘      └──────────────────┘      └─────────────┘
                                │
                                │ HTTP
                                ▼
                         ┌──────────────┐
                         │  Open-Meteo   │
                         │  Archive API  │
                         └──────────────┘
```

## Tech Stack

### Backend
- **Python 3.13** + **FastAPI** — REST API framework
- **boto3** — AWS S3 SDK for object storage
- **httpx** — Async HTTP client for Open-Meteo API calls
- **Pydantic v2** — Request validation
- **Mangum** — AWS Lambda adapter for ASGI apps
- **pytest** + **moto** — Testing with mocked AWS services

### Frontend
- **Next.js 16** — React framework (App Router)
- **Tailwind CSS v4** — Utility-first CSS
- **Chakra UI v3** — Component library
- **TanStack Query v5** — Server state management & error handling
- **Recharts v3** — Temperature line charts
- **Sonner** — Toast notifications
- **Material Symbols** — Icon set (outlined, filled)
- **Vitest** + **React Testing Library** — Component testing

### Cloud & Deployment
- **AWS S3** — Object storage (free tier: 5GB, 20K GET, 2K PUT/month)
- **AWS Lambda + API Gateway** — Serverless backend (free tier: 1M requests/month)
- **Vercel** — Frontend hosting (free tier)

---

## Features

1. **Fetch & Store** — Enter coordinates and date range, fetch historical weather from Open-Meteo, store raw JSON in S3
2. **Browse Files** — List all stored weather data files with metadata (size, creation date)
3. **Visualize** — Interactive line chart showing daily max/min temperatures and apparent temperatures
4. **Paginated Table** — Tabular view with 10/20/50 rows per page
5. **Glassmorphism UI** — Modern dark theme with glass-effect cards, backdrop blur, and gradient accents

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/store-weather-data` | Fetch weather from Open-Meteo and store in S3 |
| GET | `/list-weather-files` | List all stored JSON files in S3 |
| GET | `/weather-file-content/{file}` | Retrieve a specific file's content |
| GET | `/health` | Health check |

### POST /store-weather-data

```json
{
  "latitude": 52.52,
  "longitude": 13.41,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

**Validation rules:**
- Latitude: -90 to 90
- Longitude: -180 to 180
- Date range: max 31 days
- End date: must be historical (before today)

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- AWS account (free tier)
- AWS CLI

---

## AWS Setup (Free Tier)

### 1. Create an AWS Account
Go to [aws.amazon.com](https://aws.amazon.com/) and sign up. The free tier includes S3, Lambda, and API Gateway at no cost for 12 months.

### 2. Install AWS CLI
```bash
pip install awscli
```

### 3. Create an IAM User
1. Go to AWS Console → IAM → Users → Create User
2. Name: `weather-explorer-user`
3. Attach policy: `AmazonS3FullAccess` (or create a scoped policy for your bucket)
4. Create access key (CLI type)
5. Save the Access Key ID and Secret Access Key

### 4. Configure AWS CLI
```bash
aws configure
```
Enter your Access Key ID, Secret Access Key, region (`us-east-1`), and output format (`json`).

### 5. Create S3 Bucket
```bash
aws s3 mb s3://weather-explorer-YOUR-UNIQUE-ID --region us-east-1
```
Bucket names must be globally unique. Replace `YOUR-UNIQUE-ID` with something unique.

---

## Local Development

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your AWS credentials and bucket name

# Run server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
# Edit with your backend URL (default: http://localhost:8000)

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing

### Backend Tests
```bash
cd backend
source venv/Scripts/activate  # or source venv/bin/activate
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npx vitest run
```

---

## Deployment

### Backend → AWS Lambda

Using AWS SAM CLI:

```bash
cd backend

# Install SAM CLI
pip install aws-sam-cli

# Build
sam build

# Deploy (first time — interactive)
sam deploy --guided
```

During guided deploy:
- Stack name: `weather-explorer-api`
- Region: `us-east-1`
- S3BucketName: your bucket name
- Allow SAM CLI to create IAM roles

The output will show your API Gateway URL.

### Frontend → Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-api-gateway-url.amazonaws.com
```

Or connect your GitHub repo to Vercel for automatic deployments.

---

## Project Structure

```
weather-explorer/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app + CORS + Lambda handler
│   │   ├── config.py               # Environment configuration
│   │   ├── routes/
│   │   │   └── weatherRoutes.py    # API endpoints
│   │   ├── services/
│   │   │   ├── weatherService.py   # Open-Meteo API client
│   │   │   └── storageService.py   # S3 operations
│   │   └── validators/
│   │       └── weatherValidator.py # Pydantic request validation
│   ├── tests/
│   │   ├── testValidators.py       # Validation unit tests
│   │   └── testRoutes.py           # API integration tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── template.yaml              # AWS SAM deployment template
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout with providers
│   │   │   ├── page.tsx            # Dashboard page
│   │   │   └── providers.tsx       # Chakra UI + TanStack Query
│   │   ├── components/
│   │   │   ├── glassCard.tsx       # Glassmorphism card wrapper
│   │   │   ├── inputPanel.tsx      # Weather data fetch form
│   │   │   ├── storedFiles.tsx     # S3 file browser
│   │   │   ├── dataVisualization.tsx
│   │   │   ├── temperatureChart.tsx # Recharts line chart
│   │   │   └── temperatureTable.tsx # Paginated data table
│   │   ├── hooks/
│   │   │   └── useWeatherApi.ts    # TanStack Query hooks
│   │   ├── lib/
│   │   │   └── apiClient.ts        # API fetch wrapper
│   │   └── types/
│   │       └── weather.ts          # TypeScript interfaces
│   ├── package.json
│   └── next.config.ts
│
└── README.md
```

---

## Design Decisions

### Why FastAPI?
FastAPI provides automatic request validation via Pydantic, async support for external API calls, auto-generated OpenAPI docs, and seamless Lambda deployment via Mangum.

### Why AWS S3 over GCS?
Chosen for the generous free tier (5GB storage, 2K PUT, 20K GET/month) and broad ecosystem support. The `template.yaml` SAM template automates the entire infrastructure setup.

### Why TanStack Query?
Handles server state management with built-in caching, automatic refetching, loading/error states, and query invalidation — eliminating boilerplate for the 3 API endpoints.

### Why Glassmorphism?
Creates a modern, visually distinctive dashboard that stands out. The dark gradient background with translucent glass-effect cards provides excellent readability for data visualization.

### File Naming Convention
CamelCase is used for all source files (e.g., `weatherRoutes.py`, `inputPanel.tsx`) to maintain consistency across the full stack.

---

## Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `AWS_REGION` | AWS region | `us-east-1` |
| `S3_BUCKET_NAME` | S3 bucket name | `weather-explorer-bucket` |
| `AWS_ACCESS_KEY_ID` | IAM access key | — |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key | — |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | `http://localhost:3000` |

### Frontend (.env.local)
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

---

## License

MIT
