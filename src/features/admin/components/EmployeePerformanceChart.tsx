import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import type { EmployeeSale } from '../../../api/salesReport.api';

const pesos = (value: number | null) => new Intl.NumberFormat('en-PH', {
  style: 'currency', currency: 'PHP', maximumFractionDigits: 2,
}).format(value || 0);

export default function EmployeePerformanceChart({ rows }: { rows: EmployeeSale[] }) {
  const names = rows.map(row => row.employeeName || 'Not recorded');
  return <div className="mb-5 rounded-2xl border border-pink-100 bg-gradient-to-br from-[#fffaf0] via-white to-[#faf5ff] p-3 sm:p-5">
    <div className="mb-3 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#6b5260]">
      <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#ffb316]" />Total sales</span>
      <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#f76a96]" />Average sale</span>
      <span className="flex items-center gap-2"><span className="h-1 w-5 rounded bg-[#8b5cf6]" />Transactions</span>
    </div>
    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Employee performance chart. Scroll horizontally to view all employees.">
      <div style={{ minWidth: Math.max(600, rows.length * 150) }}>
        <ChartsContainer
          height={390}
          margin={{ top: 24, bottom: 28, left: 12, right: 12 }}
          series={[
            { type: 'bar', id: 'sales', label: 'Total sales', data: rows.map(row => Number(row.sales || 0)), color: '#ffb316', yAxisId: 'pesos', valueFormatter: pesos },
            { type: 'bar', id: 'average', label: 'Average sale', data: rows.map(row => row.transactions > 0 ? row.sales / row.transactions : 0), color: '#f76a96', yAxisId: 'pesos', valueFormatter: pesos },
            { type: 'line', id: 'transactions', label: 'Transactions', data: rows.map(row => Number(row.transactions || 0)), color: '#8b5cf6', yAxisId: 'count', curve: 'monotoneX', showMark: true, valueFormatter: value => `${value ?? 0} transactions` },
          ]}
          xAxis={[{ id: 'employees', scaleType: 'band', data: rows.map((_, i) => i), valueFormatter: value => names[Number(value)], tickLabelStyle: { fontSize: 11 }, height: 68 }]}
          yAxis={[
            { id: 'pesos', scaleType: 'linear', min: 0, label: 'Sales (PHP)', width: 85, valueFormatter: value => new Intl.NumberFormat('en', { notation: 'compact' }).format(value) },
            { id: 'count', scaleType: 'linear', min: 0, position: 'right', label: 'Transactions', width: 70, tickMinStep: 1 },
          ]}
          title="Sales and transactions by employee"
          desc="Gold bars show total sales, pink bars show average sale in pesos, and the purple line shows transaction counts on the right axis. Exact values are available in the data table below."
          sx={{
            '.MuiChartsGrid-line': { stroke: '#eee5f0', strokeDasharray: '4 4' },
            '.MuiLineElement-root': { strokeWidth: 3 },
            '.MuiMarkElement-root': { fill: '#fff', stroke: '#8b5cf6', strokeWidth: 2.5 },
            '.MuiChartsAxis-tickLabel, .MuiChartsAxis-label': { fill: '#80656d' },
            '.MuiChartsAxis-line, .MuiChartsAxis-tick': { stroke: '#dfd2dc' },
          }}
        >
          <ChartsGrid horizontal />
          <BarPlot borderRadius={5} />
          <LinePlot />
          <MarkPlot />
          <ChartsXAxis axisId="employees" />
          <ChartsYAxis axisId="pesos" />
          <ChartsYAxis axisId="count" />
          <ChartsTooltip trigger="axis" />
        </ChartsContainer>
      </div>
    </div>
    <p className="mt-1 text-xs text-[#92737c]">Average sale = total sales ÷ transactions. Hover over an employee to see exact values.</p>
  </div>;
}
