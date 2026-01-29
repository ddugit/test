#!/bin/sh
set -e

echo "Ensuring SBERT model is downloaded (this may take a while the first time)..."
python - <<'PY'
from sentence_transformers import SentenceTransformer
SentenceTransformer('all-MiniLM-L6-v2')
print("Model download/warmup complete.")
PY

echo "Starting uvicorn..."
exec uvicorn app:app --host 0.0.0.0 --port 8000

