#!/bin/bash

echo "Stopping all services..."
docker-compose down

echo "Removing any orphaned containers..."
docker-compose down --remove-orphans

echo "Building services..."
docker-compose build

echo "Starting all services..."
docker-compose up -d

echo "Service status:"
docker-compose ps

echo "If you still have issues, check the logs with: docker-compose logs -f [service_name]" 