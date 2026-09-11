import { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { ChevronDown } from 'lucide-react';

const theme = createTheme({
  palette: { primary: { main: '#bd657e' }, text: { primary: '#513d46', secondary: '#88727c' }, divider: '#f0e5e9' },
  typography: { fontFamily: 'inherit', button: { textTransform: 'none' } },
  shape: { borderRadius: 16 },
});
const pesos = (value: number | null) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value ?? 0);
const compact = (value: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

type Row = { name: string; sales: number; transactions: number };

export default function SalesBreakdown({ kind, rows, period }: { kind: 'service' | 'employee'; rows: Row[]; period: string }) {
  const [metric, setMetric] = useState<'sales' | 'transactions'>('sales');
  const label = kind === 'service' ? 'Service' : 'Employee';
  const ranked = rows.map((row, index) => ({ ...row, id: index, sales: Number(row.sales || 0), transactions: Number(row.transactions || 0) })).sort((a, b) => b[metric] - a[metric]);
  const totalSales = ranked.reduce((sum, row) => sum + row.sales, 0);
  const totalTransactions = ranked.reduce((sum, row) => sum + row.transactions, 0);

  return <ThemeProvider theme={theme}>
    <Card className="print-card" sx={{ mb: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 24px #603e4b05', minWidth: 0 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Box>
            <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>Sales by {label}</Typography>
            <Typography variant="body2" color="text.secondary">{period} · Ranked by {metric}</Typography>
          </Box>
          <ToggleButtonGroup exclusive size="small" value={metric} aria-label={`${label} chart metric`} onChange={(_, value: typeof metric | null) => { if (value) setMetric(value); }}>
            <ToggleButton value="sales">Sales</ToggleButton>
            <ToggleButton value="transactions">Transactions</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        {ranked.length === 0 ? <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">No {kind} sales recorded.</Typography>
          <Typography variant="caption" color="text.secondary">Try another period or adjust the filters.</Typography>
        </Box> : <>
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip variant="outlined" size="small" label={`${ranked.length} ${kind === 'service' ? 'services' : 'employees'}`} />
            <Chip size="small" sx={{ bgcolor: '#faf0f3', color: 'primary.main' }} label={`${pesos(totalSales)} total sales`} />
            <Chip variant="outlined" size="small" label={`${totalTransactions.toLocaleString()} transactions`} />
          </Stack>
          <Box tabIndex={0} role="region" aria-label={`${label} chart. Scroll to view all entries.`} sx={{ maxHeight: 500, overflow: 'auto' }}>
            <Box sx={{ minWidth: 320 }}>
              <BarChart layout="horizontal" height={Math.max(260, ranked.length * 48 + 70)} hideLegend skipAnimation borderRadius={5} grid={{ vertical: true }}
                yAxis={[{ scaleType: 'band', data: ranked.map((_, index) => index), width: 130, valueFormatter: (value: number, context) => { const name = ranked[value]?.name ?? ''; return context.location === 'tick' && name.length > 18 ? `${name.slice(0, 17)}…` : name; } }]}
                xAxis={[{ min: 0, label: metric === 'sales' ? 'Sales (PHP)' : 'Transactions', valueFormatter: compact, ...(metric === 'transactions' ? { tickMinStep: 1 } : {}) }]}
                series={[{ label: metric === 'sales' ? 'Sales' : 'Transactions', data: ranked.map(row => row[metric]), color: kind === 'service' ? '#8870bb' : '#bd657e', valueFormatter: metric === 'sales' ? pesos : value => `${value ?? 0} transactions` }]}
                title={`${metric === 'sales' ? 'Sales in Philippine pesos' : 'Transactions'} by ${kind}`}
                desc="All entries are ranked highest first. Full names and exact values are available in the expandable data table below."
                sx={{ '.MuiChartsGrid-line': { stroke: '#eee6ea', strokeDasharray: '4 5' }, '.MuiChartsAxis-tickLabel': { fill: '#88727c', fontSize: 11 } }} />
            </Box>
          </Box>
          <Accordion disableGutters elevation={0} sx={{ mt: 2, border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ChevronDown size={18} />} id={`${kind}-data-heading`} aria-controls={`${kind}-data-content`}>
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>View {kind} data table</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 1, sm: 2 } }}>
              <TableContainer sx={{ maxHeight: 400 }} tabIndex={0} role="region" aria-label={`${label} sales data`}>
                <Table size="small" stickyHeader aria-label={`Sales by ${kind}`}>
                  <TableHead><TableRow><TableCell>{label}</TableCell><TableCell align="right">Transactions</TableCell><TableCell align="right">Sales</TableCell></TableRow></TableHead>
                  <TableBody>{ranked.map(row => <TableRow key={row.id} hover>
                    <TableCell component="th" scope="row" sx={{ minWidth: 150 }}>{row.name}</TableCell>
                    <TableCell align="right">{row.transactions.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{pesos(row.sales)}</TableCell>
                  </TableRow>)}</TableBody>
                  <TableFooter><TableRow sx={{ '& td': { fontWeight: 700, color: 'text.primary' } }}><TableCell>Total</TableCell><TableCell align="right">{totalTransactions.toLocaleString()}</TableCell><TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{pesos(totalSales)}</TableCell></TableRow></TableFooter>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </>}
      </CardContent>
    </Card>
  </ThemeProvider>;
}
