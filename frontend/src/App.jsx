import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Charts from './Charts'

export default function App(){
  const [kpis, setKpis] = useState(null)
  const [agreements, setAgreements] = useState([])
  const [country, setCountry] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [formData, setFormData] = useState({country: '', date: '', amount_usd: '', project_active: false, contact: ''})

  const fetchData = () => {
    let kpiUrl = '/api/kpis'
    let agrUrl = '/api/agreements'
    const params = new URLSearchParams()
    if(country) params.append('country', country)
    if(startDate) params.append('start', startDate)
    if(endDate) params.append('end', endDate)
    if(params.toString()){
      kpiUrl += '?' + params.toString()
      agrUrl += '?' + params.toString()
    }
    
    axios.get(kpiUrl).then(res => setKpis(res.data)).catch(err => console.error('KPI error:', err))
    axios.get(agrUrl).then(res => setAgreements(res.data)).catch(err => console.error('Agreement error:', err))
  }

  useEffect(() => {
    fetchData()
  }, [country, startDate, endDate])

  const handleCreateAgreement = (e) => {
    e.preventDefault()
    axios.post('/api/agreements', formData)
      .then(res => {
        setFormData({country: '', date: '', amount_usd: '', project_active: false, contact: ''})
        fetchData()
      })
      .catch(err => console.error('Create error:', err))
  }

  if(!kpis) return <div className="container">Cargando KPIs...</div>

  return (
    <div className="container">
      <h1>Dashboard - Relaciones Internacionales</h1>
      
      <div className="cards">
        <div className="card">
          <h3>Acuerdos por país</h3>
          <p>{Object.keys(kpis.agreements_per_country).length}</p>
        </div>
        <div className="card">
          <h3>Proyectos activos</h3>
          <p>{kpis.active_projects}</p>
        </div>
        <div className="card">
          <h3>Financiamiento (M USD)</h3>
          <p>{kpis.international_funding_millions_usd}</p>
        </div>
        <div className="card">
          <h3>Contactos</h3>
          <p>{kpis.contacts_count}</p>
        </div>
      </div>

      <Charts data={agreements} kpis={kpis} />

      <h2>Filtros</h2>
      <div className="filters">
        <input type="text" placeholder="País" value={country} onChange={e => setCountry(e.target.value)} />
        <input type="date" placeholder="Desde" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" placeholder="Hasta" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      <h2>Acuerdos Internacionales ({agreements.length})</h2>
      <table className="table">
        <thead>
          <tr><th>ID</th><th>País</th><th>Fecha</th><th>Monto (USD)</th><th>Activo</th><th>Contacto</th></tr>
        </thead>
        <tbody>
          {agreements.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.country}</td>
              <td>{a.date}</td>
              <td>${a.amount_usd.toLocaleString()}</td>
              <td>{a.project_active ? 'Sí' : 'No'}</td>
              <td>{a.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Crear Acuerdo de Prueba</h2>
      <form onSubmit={handleCreateAgreement} className="form">
        <input type="text" placeholder="País" required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
        <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        <input type="number" placeholder="Monto USD" required value={formData.amount_usd} onChange={e => setFormData({...formData, amount_usd: parseFloat(e.target.value)})} />
        <label><input type="checkbox" checked={formData.project_active} onChange={e => setFormData({...formData, project_active: e.target.checked})} /> Proyecto activo</label>
        <input type="text" placeholder="Contacto" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
        <button type="submit">Crear</button>
      </form>
    </div>
  )
}
