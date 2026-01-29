FROM python:3.11-slim

WORKDIR /app

# System deps needed by some Python packages and model runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git libsndfile1 ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Copy app sources
COPY . .

# Add a small startup script that will download / warm the SBERT model at container start
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8000
CMD ["/app/start.sh"]

