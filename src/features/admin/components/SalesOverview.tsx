import { useMemo, useState, type ReactNode } from 'react';
import { Box, Card, CardContent, Chip, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LineChart, lineClasses } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { Banknote, CalendarDays, ChartNoAxesCombined, ShoppingBag, Users } from 'lucide-react';
import type { SalesReport } from '../../../api/salesReport.api';

const colors = { rose: '#bd657e', purple: '#8870bb', green: '#528a76', gold: '#c79c49', blue: '#628bad' };
const theme = createTheme({
  palette: { primary: { main: colors.rose }, text: { primary: '#513d46', secondary: '#88727c' }, divider: '#f0e5e9' },
  typography: { fontFamily: 'inherit', h6: { fontSize: '1rem', fontWeight: 700 }, button: { textTransform: 'none', fontWeight: 600 } },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: { styleOverrides: { root: { border: '1px solid #f0e5e9', boxShadow: '0 4px 24px #603e4b05' } } },
    MuiToggleButton: { styleOverrides: { root: { borderColor: '#eadde3', padding: '5px 12px', fontSize: 12 } } },
  },
});
const pesos = (value: number | null) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(value ?? 0);
const compact = (value: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
const chartStyle = {
  '.MuiChartsGrid-line': { stroke: '#eee6ea', strokeDasharray: '4 5' },
  '.MuiChartsAxis-line, .MuiChartsAxis-tick': { stroke: '#e6dce1' },
  '.MuiChartsAxis-tickLabel': { fill: '#88727c', fontSize: 11 },
};

function Panel({ title, subtitle, action, children }: { title: string; subtitle: string; action?: ReactNode; children: ReactNode }) {
  return <Card className="print-card" sx={{ height: '100%', minWidth: 0 }}>
    <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Box><Typography component="h2" variant="h6">{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 12 }}>{subtitle}</Typography></Box>
        {action}
      </Stack>
      {children}
    </CardContent>
  </Card>;
}

function EmptyChart({ text }: { text: string }) {
  return <Stack spacing={1.5} sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 250, color: 'text.secondary', textAlign: 'center' }}>
    <ChartNoAxesCombined size={32} strokeWidth={1.3} />
    <Typography variant="body2">{text}</Typography>
    <Typography variant="caption">Try another period or adjust the filters.</Typography>
  </Stack>;
}

function DonutLabel({ value }: { value: string }) {
  const { width, height, left, top } = useDrawingArea();
  return <text x={left + width / 2} y={top + height / 2} textAnchor="middle" dominantBaseline="central" fill="#513d46">
    <tspan x={left + width / 2} dy="-6" fontSize="23" fontWeight="700">{value}</tspan>
    <tspan x={left + width / 2} dy="24" fontSize="11" fill="#88727c">TOTAL SALES · PHP</tspan>
  </text>;
}

export default function SalesOverview({ report }: { report: SalesReport }) {
  const [metric, setMetric] = useState<'sales' | 'transactions'>('sales');
  const { summary, bookings } = report;
  // The API returns only days with sales. Fill calendar gaps with zero to show the actual trend.
  const daily = useMemo(() => {
    const byDate = new Map(report.dailySales.map(row => [row.date, row]));
    const result = [];
    const cursor = new Date(`${report.startDate}T00:00:00Z`);
    const end = new Date(`${report.endDate}T00:00:00Z`);
    while (cursor <= end) {
      const date = cursor.toISOString().slice(0, 10);
      result.push(byDate.get(date) ?? { date, sales: 0, transactions: 0 });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return result;
  }, [report]);
  const rankedServices = [...report.salesByService].sort((a, b) => b.sales - a.sales).slice(0, 6);
  const revenue = [
    { id: 'appointments', label: 'Appointments', value: summary.appointmentSales, color: colors.purple },
    { id: 'walkins', label: 'Walk-ins', value: summary.walkinSales, color: colors.green },
  ];
  const statuses = [
    { label: 'Pending', value: bookings.pending, color: colors.gold },
    { label: 'Confirmed', value: bookings.confirmed, color: colors.rose },
    { label: 'Completed', value: bookings.completed, color: colors.green },
    { label: 'Cancelled', value: bookings.cancelled, color: '#c97570' },
    { label: 'No-show', value: bookings.noShow, color: colors.purple },
  ];
  const cards = [
    { label: 'Total sales', value: summary.totalSales, note: `${summary.totalTransactions} confirmed / completed transactions`, color: colors.rose, icon: <Banknote size={21} /> },
    { label: 'Appointment sales', value: summary.appointmentSales, note: `${summary.totalAppointments} confirmed / completed appointments`, color: colors.purple, icon: <CalendarDays size={21} /> },
    { label: 'Walk-in sales', value: summary.walkinSales, note: `${summary.totalWalkins} confirmed / completed walk-ins`, color: colors.green, icon: <Users size={21} /> },
    { label: 'Average sale', value: summary.averageSale, note: 'Per confirmed / completed transaction', color: colors.blue, icon: <ShoppingBag size={21} /> },
  ];
  const bestDay = daily.reduce<(typeof daily)[number] | undefined>((best, row) => !best || row.sales > best.sales ? row : best, undefined);

  return <ThemeProvider theme={theme}>
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {cards.map((card, index) => <Card key={card.label} className="print-card" sx={{ minWidth: 0, background: index === 0 ? 'linear-gradient(120deg, #fff0f4, #fffafb)' : '#fff' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.secondary">{card.label}</Typography>
              <Box sx={{ display: 'flex', p: 1.2, borderRadius: 3, bgcolor: `${card.color}15`, color: card.color }}>{card.icon}</Box>
            </Stack>
            <Typography sx={{ fontSize: { xs: 26, lg: 29 }, fontWeight: 750, letterSpacing: '-1px', overflowWrap: 'anywhere' }}>{pesos(card.value)}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>{card.note}</Typography>
          </CardContent>
        </Card>)}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.7fr) minmax(0, 1fr)' }, gap: 3, mb: 3 }}>
        <Panel title="Performance over time" subtitle="Daily activity across the selected period" action={
          <ToggleButtonGroup exclusive size="small" value={metric} onChange={(_, value: 'sales' | 'transactions' | null) => { if (value) setMetric(value); }} aria-label="Trend metric">
            <ToggleButton value="sales">Sales</ToggleButton><ToggleButton value="transactions">Transactions</ToggleButton>
          </ToggleButtonGroup>
        }>
          {report.dailySales.length ? <>
            <LineChart height={300} hideLegend skipAnimation grid={{ horizontal: true }}
              xAxis={[{ scaleType: 'point', data: daily.map(row => row.date), tickLabelMinGap: 35, valueFormatter: (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) }]}
              yAxis={[{ min: 0, width: 65, valueFormatter: compact, ...(metric === 'transactions' ? { tickMinStep: 1 } : {}) }]}
              series={[{ data: daily.map(row => row[metric]), label: metric === 'sales' ? 'Sales (PHP)' : 'Transactions', area: true, curve: 'linear', showMark: daily.length < 15, color: metric === 'sales' ? colors.rose : colors.blue, valueFormatter: metric === 'sales' ? pesos : value => `${value ?? 0} transactions` }]}
              title={metric === 'sales' ? 'Daily sales in Philippine pesos' : 'Daily transaction count'}
              sx={{ ...chartStyle, [`& .${lineClasses.area}`]: { fillOpacity: 0.1 }, [`& .${lineClasses.line}`]: { strokeWidth: 2.5 } }} />
            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <Chip size="small" variant="outlined" label={`${summary.totalTransactions} transactions`} />
              {bestDay && bestDay.sales > 0 && <Chip size="small" sx={{ bgcolor: '#faf0f3', color: colors.rose }} label={`Best day: ${new Date(`${bestDay.date}T00:00:00`).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} · ${pesos(bestDay.sales)}`} />}
            </Stack>
            <Box component="details" sx={{ mt: 2, fontSize: 12, color: 'text.secondary' }}>
              <summary style={{ cursor: 'pointer' }}>View daily values</summary>
              <Box sx={{ maxHeight: 220, overflow: 'auto', mt: 1 }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: 12, whiteSpace: 'nowrap' }}>
                  <thead><tr><th>Date</th><th>Sales (PHP)</th><th>Transactions</th></tr></thead>
                  <tbody>{daily.map(row => <tr key={row.date}><td style={{ padding: '6px 12px 6px 0' }}>{row.date}</td><td style={{ paddingRight: 12 }}>{pesos(row.sales)}</td><td>{row.transactions}</td></tr>)}</tbody>
                </table>
              </Box>
            </Box>
          </> : <EmptyChart text="No sales recorded for this period." />}
        </Panel>

        <Panel title="Revenue mix" subtitle="Where your sales come from">
          {summary.totalSales > 0 ? <PieChart height={270} hideLegend skipAnimation
            series={[{ data: revenue.filter(item => item.value > 0), innerRadius: 78, outerRadius: 108, paddingAngle: 4, cornerRadius: 6, highlightScope: { highlight: 'item', fade: 'global' }, valueFormatter: item => pesos(item.value) }]}
            title="Appointment and walk-in revenue in Philippine pesos">
            <DonutLabel value={compact(summary.totalSales)} />
          </PieChart> : <EmptyChart text="No revenue to break down yet." />}
          <Stack spacing={1.5} sx={{ mt: 1 }}>{revenue.map(item => <Stack key={item.id} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: item.color }} />
            <Typography variant="body2" sx={{ flex: 1 }}>{item.label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{pesos(item.value)}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 37, textAlign: 'right' }}>{summary.totalSales ? Math.round(item.value / summary.totalSales * 100) : 0}%</Typography>
          </Stack>)}</Stack>
        </Panel>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, gap: 3 }}>
        <Panel title="Top services" subtitle="The six highest-earning services · sales in PHP" action={<Chip size="small" variant="outlined" label={`${report.salesByService.length} services`} />}>
          {rankedServices.length ? <BarChart layout="horizontal" height={310} hideLegend skipAnimation borderRadius={5} grid={{ vertical: true }}
            yAxis={[{ scaleType: 'band', data: rankedServices.map((_, index) => index), width: 125, valueFormatter: (value: number, context) => { const name = rankedServices[value]?.serviceName || 'Unnamed service'; return context.location === 'tick' && name.length > 18 ? `${name.slice(0, 17)}…` : name; } }]}
            xAxis={[{ min: 0, valueFormatter: compact }]}
            series={[{ label: 'Sales', data: rankedServices.map(row => row.sales), color: colors.purple, valueFormatter: pesos }]}
            title="Top six services ranked by sales" desc="Full service names and exact values are available in the service table below." sx={chartStyle} />
            : <EmptyChart text="No service sales for this period." />}
        </Panel>
        <Panel title="Booking status" subtitle="Appointment counts across all statuses" action={<Chip size="small" sx={{ bgcolor: '#edf5f1', color: colors.green }} label={`${bookings.totalBookings} bookings`} />}>
          {bookings.totalBookings > 0 ? <>
            <BarChart height={260} hideLegend skipAnimation borderRadius={5} grid={{ horizontal: true }}
              xAxis={[{ scaleType: 'band', data: statuses.map(item => item.label), colorMap: { type: 'ordinal', colors: statuses.map(item => item.color) }, tickLabelStyle: { fontSize: 10 }, height: 42 }]}
              yAxis={[{ min: 0, tickMinStep: 1, width: 35 }]}
              series={[{ label: 'Bookings', data: statuses.map(item => item.value), valueFormatter: value => `${value ?? 0} bookings` }]}
              title="Appointment counts by booking status" sx={chartStyle} />
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>{statuses.map(item => <Chip key={item.label} size="small" variant="outlined" label={`${item.label}: ${item.value}`} />)}</Stack>
          </> : <EmptyChart text="No appointments for this period." />}
        </Panel>
      </Box>
    </Box>
  </ThemeProvider>;
}
