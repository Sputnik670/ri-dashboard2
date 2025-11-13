#!/bin/bash

echo "🚀 Iniciando RI Dashboard en Replit..."

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
pip install -r requirements.txt
cd ..

# Instalar dependencias del frontend
echo "🎨 Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

# Configurar el puerto del backend para Replit
export PORT=8000

echo "🔧 Configurando puertos para Replit..."

# Iniciar backend en background
echo "🟢 Iniciando backend FastAPI..."
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Esperar a que el backend esté listo
sleep 5

# Iniciar frontend
echo "🔵 Iniciando frontend React..."
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

echo "✅ Dashboard iniciado!"
echo "🌐 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:5173"

# Esperar a que los procesos terminen
wait $BACKEND_PID $FRONTEND_PID