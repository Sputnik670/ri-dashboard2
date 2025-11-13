import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export default function Charts({data, kpis}) {
  const barChartRef = useRef(null)
  const lineChartRef = useRef(null)

  useEffect(() => {
    if (!kpis || !data) return

    // Bar chart: Agreements by country
    if (barChartRef.current) {
      const barChart = echarts.init(barChartRef.current)
      const countries = Object.keys(kpis.agreements_per_country)
      const counts = Object.values(kpis.agreements_per_country)
      barChart.setOption({
        title: { text: 'Acuerdos por País' },
        tooltip: {},
        xAxis: { type: 'category', data: countries },
        yAxis: { type: 'value' },
        series: [{ data: counts, type: 'bar', itemStyle: { color: '#3498db' } }]
      })
    }

    // Line chart: Funding by month (simplified)
    if (lineChartRef.current) {
      const lineChart = echarts.init(lineChartRef.current)
      // Group agreements by month
      const monthMap = {}
      data.forEach(a => {
        const month = a.date.slice(0, 7) // YYYY-MM
        monthMap[month] = (monthMap[month] || 0) + a.amount_usd
      })
      const months = Object.keys(monthMap).sort()
      const funding = months.map(m => (monthMap[m] / 1000000).toFixed(2)) // convert to M
      lineChart.setOption({
        title: { text: 'Financiamiento por Mes (M USD)' },
        tooltip: {},
        xAxis: { type: 'category', data: months },
        yAxis: { type: 'value' },
        series: [{ data: funding, type: 'line', smooth: true, itemStyle: { color: '#2ecc71' } }]
      })
    }
  }, [kpis, data])

  return (
    <div className="charts">
      <div ref={barChartRef} style={{ width: '100%', height: '300px', marginBottom: '20px' }}></div>
      <div ref={lineChartRef} style={{ width: '100%', height: '300px' }}></div>
    </div>
  )
}
