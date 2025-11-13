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
echo "🌍 Variables de entorno:"
echo "  REPL_SLUG: $REPL_SLUG"
echo "  REPL_OWNER: $REPL_OWNER"
echo "  PORT: $PORT"

# Iniciar backend en background
echo "🟢 Iniciando backend FastAPI..."
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "📡 Backend PID: $BACKEND_PID"
cd ..

# Esperar a que el backend esté listo
echo "⏳ Esperando a que el backend inicie..."
sleep 10

# Verificar que el backend esté corriendo
echo "🔍 Verificando backend..."
curl -s http://localhost:8000/health || echo "⚠️ Backend no responde aún"

# Iniciar frontend
echo "🔵 Iniciando frontend React..."
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
echo "🎨 Frontend PID: $FRONTEND_PID"

echo "✅ Dashboard iniciado!"
echo "🌐 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:5173"

# Esperar a que los procesos terminen
wait $BACKEND_PID $FRONTEND_PID