FROM python:3.11-slim

WORKDIR /app

# Copy all files
COPY . .

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Run server
CMD ["python3", "server.py"]
