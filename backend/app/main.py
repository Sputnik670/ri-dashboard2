from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel

class AgreementIn(BaseModel):
    country: str
    date: str
    amount_usd: float
    project_active: Optional[bool] = False
    contact: Optional[str] = None

app = FastAPI(title="Ministerio Ciencia - Relaciones Internacionales API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AGREEMENTS = [
    {"id": 1, "country": "Argentina", "date": "2023-03-15", "amount_usd": 500000, "project_active": True, "contact": "Dr. A"},
    {"id": 2, "country": "Brasil", "date": "2022-11-01", "amount_usd": 250000, "project_active": False, "contact": "Dr. B"},
    {"id": 3, "country": "Chile", "date": "2024-06-20", "amount_usd": 1200000, "project_active": True, "contact": "Dr. C"},
    {"id": 4, "country": "Argentina", "date": "2021-09-10", "amount_usd": 75000, "project_active": False, "contact": "Dr. D"},
    {"id": 5, "country": "Brasil", "date": "2025-01-08", "amount_usd": 300000, "project_active": True, "contact": "Dr. E"},
]

def parse_date(s: Optional[str]) -> Optional[date]:
    if not s:
        return None
    try:
        return datetime.fromisoformat(s).date()
    except Exception:
        return None

def filter_agreements(country: Optional[str], start: Optional[str], end: Optional[str]):
    s = parse_date(start)
    e = parse_date(end)
    results = []
    for a in AGREEMENTS:
        a_date = datetime.fromisoformat(a["date"]).date()
        if country and a["country"].lower() != country.lower():
            continue
        if s and a_date < s:
            continue
        if e and a_date > e:
            continue
        results.append(a)
    return results

@app.get("/health")
def health_check():
    """Health check endpoint para verificar que la API está funcionando"""
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "message": "RI Dashboard API está funcionando correctamente"
    }

@app.get("/")
def root():
    """Endpoint raíz con información básica de la API"""
    return {
        "message": "RI Dashboard API - Ministerio de Ciencia",
        "version": "1.0.0",
        "endpoints": {
            "agreements": "/api/agreements",
            "kpis": "/api/kpis",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/api/agreements")
def get_agreements(country: Optional[str] = Query(None), start: Optional[str] = Query(None), end: Optional[str] = Query(None)):
    """Return list of agreements, optionally filtered by country and date range (ISO format)."""
    return filter_agreements(country, start, end)

@app.get("/api/kpis")
def get_kpis(country: Optional[str] = Query(None), start: Optional[str] = Query(None), end: Optional[str] = Query(None)):
    """Return KPIs computed from the (filtered) agreements dataset."""
    items = filter_agreements(country, start, end)
    agreements_per_country = {}
    active_projects = 0
    total_funding = 0.0
    contacts = set()

    for a in items:
        agreements_per_country[a["country"]] = agreements_per_country.get(a["country"], 0) + 1
        if a.get("project_active"):
            active_projects += 1
        total_funding += float(a.get("amount_usd", 0))
        if a.get("contact"):
            contacts.add(a.get("contact"))

    return {
        "agreements_per_country": agreements_per_country,
        "active_projects": active_projects,
        "international_funding_millions_usd": round(total_funding / 1_000_000, 3),
        "contacts_count": len(contacts),
    }

@app.post("/api/agreements")
def create_agreement(item: AgreementIn):
    """Create a new agreement (for testing/demo). Appends to in-memory dataset."""
    try:
        # validate date
        _d = datetime.fromisoformat(item.date)
    except Exception:
        return {"error": "invalid date format, use YYYY-MM-DD"}
    new_id = max((a["id"] for a in AGREEMENTS), default=0) + 1
    obj = {
        "id": new_id,
        "country": item.country,
        "date": item.date,
        "amount_usd": item.amount_usd,
        "project_active": bool(item.project_active),
        "contact": item.contact,
    }
    AGREEMENTS.append(obj)
    return obj
