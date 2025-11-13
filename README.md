# Dashboard - Ministerio de Ciencia (Relaciones Internacionales)

Proyecto inicial (esqueleto) para un dashboard del área de Relaciones Internacionales.

Estructura
- `backend/` - API mínima con FastAPI que expone KPIs de ejemplo.
- `frontend/` - Aplicación React + Vite que consume la API y muestra visualizaciones básicas.

Quick start (PowerShell)

1) Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

2) Frontend

```powershell
cd frontend
npm install
npm run dev
```

Notas
- Esto es un MVP / scaffold: reemplazar datos de ejemplo por fuentes reales y añadir autenticación, ETL y tests.
