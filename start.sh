#!/bin/bash

echo "🚀 Iniciando RI Dashboard en Replit..."

# Verificar que pip y npm están disponibles
echo "🔍 Verificando herramientas..."
which python3 || { echo "❌ Python3 no encontrado"; exit 1; }
which pip3 || which pip || { echo "❌ pip no encontrado"; exit 1; }
which npm || { echo "❌ npm no encontrado"; exit 1; }

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
python3 -m pip install --user -r requirements.txt || { echo "❌ Error instalando dependencias Python"; exit 1; }
cd ..

# Instalar dependencias del frontend
echo "🎨 Instalando dependencias del frontend..."
cd frontend
npm ci || npm install || { echo "❌ Error instalando dependencias npm"; exit 1; }
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