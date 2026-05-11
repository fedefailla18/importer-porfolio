import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ChipProps,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import Button from '@mui/material/Button';
import React, { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchIolAccountStatement,
  fetchIolOperationDetails,
  fetchIolOperations,
  fetchIolPortfolio,
  fetchIolProfile,
  clearSelectedOperation,
} from '../../redux/slices/iolSlice';
import { RootState } from '../../redux/store';
import { IolActivo, IolOperation } from '../../redux/types/types';
import Pagination from '../common/Pagination';

// ── Styled helpers ────────────────────────────────────────────────────────────

const StyledTableContainer = styled(TableContainer)({
  maxHeight: '60vh',
  overflow: 'auto',
  '& table': { borderCollapse: 'separate', borderSpacing: 0 },
});

const StickyHeaderCell = styled(TableCell)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  fontWeight: 600,
}));

const HoverRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.palette.action.hover },
}));

const PAGE_SIZE = 25;

// ── Formatters ────────────────────────────────────────────────────────────────

const fmtARS = (v?: number | null) =>
  v == null
    ? '—'
    : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);

const fmtUSD = (v?: number | null) =>
  v == null
    ? '—'
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

const fmtPct = (v?: number | null) => (v == null ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`);

const fmtNum = (v?: number | null, d = 4) =>
  v == null
    ? '—'
    : new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: d,
      }).format(v);

const fmtDate = (s?: string | null) => {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return s;
  }
};

// ── Chip color helpers ────────────────────────────────────────────────────────

const estadoColor = (estado: string): ChipProps['color'] => {
  switch (estado?.toLowerCase()) {
    case 'ejecutada':
      return 'success';
    case 'pendiente':
    case 'enviada':
      return 'warning';
    case 'cancelada':
    case 'rechazada':
    case 'vencida':
      return 'error';
    default:
      return 'default';
  }
};

const tipoColor = (tipo: string): ChipProps['color'] => {
  switch (tipo?.toLowerCase()) {
    case 'compra':
    case 'suscripcion':
      return 'success';
    case 'venta':
    case 'rescate':
      return 'error';
    default:
      return 'default';
  }
};

const perfilColor = (perfil: string): ChipProps['color'] => {
  switch (perfil?.toLowerCase()) {
    case 'agresivo':
      return 'error';
    case 'moderado':
      return 'warning';
    case 'conservador':
      return 'success';
    default:
      return 'default';
  }
};

const pnlSx = (v?: number | null) => ({
  color: !v ? 'text.primary' : v > 0 ? 'success.main' : 'error.main',
  fontWeight: 600,
});

// ── Overview tab ──────────────────────────────────────────────────────────────

const OverviewTab = () => {
  const { profile, profileStatus, accountStatement, accountStatementStatus, error } =
    useAppSelector((s: RootState) => s.iol);

  if (profileStatus === 'loading' || accountStatementStatus === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando datos de cuenta…</Typography>
      </Box>
    );
  }

  if (error && !profile && !accountStatement) {
    return (
      <Alert severity='error' sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Profile + Account summary row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Profile card */}
        {profile && (
          <Grid item xs={12} md={4}>
            <Card variant='outlined' sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 52, height: 52, fontSize: 20 }}>
                    {profile.nombre?.[0]}
                    {profile.apellido?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant='h6' fontWeight={700}>
                      {profile.nombre} {profile.apellido}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      @{profile.nombreUsuario}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' color='text.secondary'>
                      Estado
                    </Typography>
                    <Chip
                      label={profile.estado ?? '—'}
                      color={profile.estado?.toLowerCase() === 'activo' ? 'success' : 'warning'}
                      size='small'
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' color='text.secondary'>
                      Perfil inversor
                    </Typography>
                    <Chip
                      label={profile.perfilInversor ?? '—'}
                      color={perfilColor(profile.perfilInversor)}
                      size='small'
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' color='text.secondary'>
                      Email
                    </Typography>
                    <Typography variant='body2'>{profile.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' color='text.secondary'>
                      CUIT
                    </Typography>
                    <Typography variant='body2' fontFamily='monospace'>
                      {profile.cuit}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' color='text.secondary'>
                      Comitente
                    </Typography>
                    <Typography variant='body2' fontFamily='monospace'>
                      {profile.cuentaComitente}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Account Statement summary */}
        {accountStatement && (
          <Grid item xs={12} md={8}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {[
                {
                  label: 'Total ARS',
                  value: fmtARS(accountStatement.totalPesos),
                  tooltip: 'Suma total en pesos argentinos de todas las cuentas',
                },
                {
                  label: 'Total USD',
                  value: fmtUSD(accountStatement.totalDolares),
                  tooltip: 'Suma total en dólares de todas las cuentas',
                },
                ...(accountStatement.exchangeRate
                  ? [
                      {
                        label: 'Tipo de cambio',
                        value: `$${fmtNum(accountStatement.exchangeRate, 2)}`,
                        tooltip: 'Tipo de cambio utilizado para la conversión',
                      },
                    ]
                  : []),
                ...(accountStatement.totalConvertedUsd
                  ? [
                      {
                        label: 'Total convertido USD',
                        value: fmtUSD(accountStatement.totalConvertedUsd),
                        tooltip: 'Total ARS convertido a USD al tipo de cambio indicado',
                      },
                    ]
                  : []),
              ].map(card => (
                <Grid item xs={12} sm={6} key={card.label}>
                  <Tooltip title={card.tooltip} arrow>
                    <Card variant='outlined' sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant='overline' color='text.secondary'>
                          {card.label}
                        </Typography>
                        <Typography variant='h5' fontWeight={700}>
                          {card.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* Cuentas table */}
      {accountStatement?.cuentas && accountStatement.cuentas.length > 0 && (
        <Paper>
          <Box sx={{ p: 2, pb: 0 }}>
            <Typography variant='h6' fontWeight={600} gutterBottom>
              Detalle de cuentas
            </Typography>
          </Box>
          <StyledTableContainer>
            <Table stickyHeader size='small'>
              <TableHead>
                <TableRow>
                  <StickyHeaderCell>Número</StickyHeaderCell>
                  <StickyHeaderCell>Tipo</StickyHeaderCell>
                  <StickyHeaderCell>Moneda</StickyHeaderCell>
                  <StickyHeaderCell align='right'>Disponible</StickyHeaderCell>
                  <StickyHeaderCell align='right'>Comprometido</StickyHeaderCell>
                  <StickyHeaderCell align='right'>Saldo</StickyHeaderCell>
                  <StickyHeaderCell align='right'>Títulos valorizados</StickyHeaderCell>
                  <StickyHeaderCell align='right'>Total</StickyHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountStatement.cuentas.map(c => (
                  <TableRow key={c.numero}>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{c.numero}</TableCell>
                    <TableCell>{c.tipo}</TableCell>
                    <TableCell>
                      <Chip label={c.moneda} size='small' variant='outlined' />
                    </TableCell>
                    <TableCell align='right'>{fmtNum(c.disponible, 2)}</TableCell>
                    <TableCell align='right'>{fmtNum(c.comprometido, 2)}</TableCell>
                    <TableCell align='right'>{fmtNum(c.saldo, 2)}</TableCell>
                    <TableCell align='right'>{fmtNum(c.titulosValorizados, 2)}</TableCell>
                    <TableCell align='right' sx={{ fontWeight: 700 }}>
                      {fmtNum(c.total, 2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Paper>
      )}

      {!profile && !accountStatement && (
        <Alert severity='info'>
          No hay datos de cuenta disponibles. Asegurate de haber configurado tus credenciales de IOL
          en Configuración.
        </Alert>
      )}
    </Box>
  );
};

// ── Portfolio tab ─────────────────────────────────────────────────────────────

const PortfolioTab = ({ country }: { country: 'argentina' | 'estados_unidos' }) => {
  const { portfolioAr, portfolioArStatus, portfolioUs, portfolioUsStatus, error } = useAppSelector(
    (s: RootState) => s.iol
  );

  const portfolio = country === 'argentina' ? portfolioAr : portfolioUs;
  const status = country === 'argentina' ? portfolioArStatus : portfolioUsStatus;

  if (status === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando portafolio…</Typography>
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Alert severity='error' sx={{ mt: 2 }}>
        {error ?? 'No se pudo cargar el portafolio.'}
      </Alert>
    );
  }

  const activos: IolActivo[] = portfolio?.activos ?? [];
  const totalValorizado = activos.reduce((acc, a) => acc + (a.valorizado ?? 0), 0);
  const totalGanancia = activos.reduce((acc, a) => acc + (a.gananciaDinero ?? 0), 0);

  if (status === 'succeeded' && activos.length === 0) {
    return (
      <Alert severity='info' sx={{ mt: 2 }}>
        No hay activos en este portafolio.
      </Alert>
    );
  }

  if (status === 'idle') {
    return (
      <Alert severity='info' sx={{ mt: 2 }}>
        Hacé clic en "Cargar" para obtener los datos del portafolio.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Summary chips */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
        <Chip
          icon={<AccountBalanceIcon />}
          label={`${activos.length} activo${activos.length === 1 ? '' : 's'}`}
          variant='outlined'
        />
        <Chip label={`Total valorizado: ${fmtARS(totalValorizado)}`} variant='outlined' />
        <Chip
          label={`Ganancia total: ${fmtARS(totalGanancia)}`}
          color={totalGanancia > 0 ? 'success' : totalGanancia < 0 ? 'error' : 'default'}
          variant='outlined'
        />
      </Box>

      <Paper>
        <StyledTableContainer>
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                <StickyHeaderCell>Símbolo</StickyHeaderCell>
                <StickyHeaderCell>Descripción</StickyHeaderCell>
                <StickyHeaderCell>Tipo</StickyHeaderCell>
                <StickyHeaderCell align='right'>Cantidad</StickyHeaderCell>
                <StickyHeaderCell align='right'>Precio actual</StickyHeaderCell>
                <StickyHeaderCell align='right'>Variación</StickyHeaderCell>
                <StickyHeaderCell align='right'>PPC</StickyHeaderCell>
                <StickyHeaderCell align='right'>Ganancia $</StickyHeaderCell>
                <StickyHeaderCell align='right'>Ganancia %</StickyHeaderCell>
                <StickyHeaderCell align='right'>Valorizado</StickyHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activos.map(a => (
                <TableRow key={a.simbolo} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <TableCell sx={{ fontWeight: 700 }}>{a.simbolo}</TableCell>
                  <TableCell>
                    <Tooltip title={a.descripcion} arrow>
                      <Typography
                        variant='body2'
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {a.descripcion}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip label={a.tipo} size='small' variant='outlined' />
                  </TableCell>
                  <TableCell align='right'>{fmtNum(a.cantidad)}</TableCell>
                  <TableCell align='right'>{fmtARS(a.ultimoPrecio)}</TableCell>
                  <TableCell align='right'>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 0.5,
                      }}
                    >
                      {a.variacion > 0 ? (
                        <TrendingUpIcon fontSize='small' sx={{ color: 'success.main' }} />
                      ) : a.variacion < 0 ? (
                        <TrendingDownIcon fontSize='small' sx={{ color: 'error.main' }} />
                      ) : null}
                      <Typography variant='body2' sx={pnlSx(a.variacion)}>
                        {fmtPct(a.variacion)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align='right'>{fmtARS(a.ppc)}</TableCell>
                  <TableCell align='right'>
                    <Typography variant='body2' sx={pnlSx(a.gananciaDinero)}>
                      {fmtARS(a.gananciaDinero)}
                    </Typography>
                  </TableCell>
                  <TableCell align='right'>
                    <Typography variant='body2' sx={pnlSx(a.gananciaPorcentaje)}>
                      {fmtPct(a.gananciaPorcentaje)}
                    </Typography>
                  </TableCell>
                  <TableCell align='right' sx={{ fontWeight: 600 }}>
                    {fmtARS(a.valorizado)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </Box>
  );
};

// ── Operations tab ────────────────────────────────────────────────────────────

const OperationsTab = () => {
  const dispatch = useAppDispatch();
  const { operations, operationsStatus, selectedOperation, selectedOperationStatus, error } =
    useAppSelector((s: RootState) => s.iol);

  const [simboloFilter, setSimboloFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('ALL');
  const [estadoFilter, setEstadoFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const uniqueTipos = useMemo(
    () => ['ALL', ...Array.from(new Set(operations.map(o => o.tipo).filter(Boolean)))],
    [operations]
  );
  const uniqueEstados = useMemo(
    () => ['ALL', ...Array.from(new Set(operations.map(o => o.estado).filter(Boolean)))],
    [operations]
  );

  const filtered = useMemo(() => {
    return operations.filter(o => {
      const matchesSimbolo =
        !simboloFilter.trim() ||
        o.simbolo?.toLowerCase().includes(simboloFilter.trim().toLowerCase());
      const matchesTipo = tipoFilter === 'ALL' || o.tipo === tipoFilter;
      const matchesEstado = estadoFilter === 'ALL' || o.estado === estadoFilter;
      return matchesSimbolo && matchesTipo && matchesEstado;
    });
  }, [operations, simboloFilter, tipoFilter, estadoFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => setPage(1), [simboloFilter, tipoFilter, estadoFilter]);

  const handleRowClick = (op: IolOperation) => {
    dispatch(fetchIolOperationDetails(op.numero));
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    dispatch(clearSelectedOperation());
  };

  if (operationsStatus === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando operaciones…</Typography>
      </Box>
    );
  }

  if (operationsStatus === 'failed') {
    return (
      <Alert severity='error' sx={{ mt: 2 }}>
        {error ?? 'No se pudieron cargar las operaciones.'}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filter bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label='Filtrar símbolo'
            value={simboloFilter}
            onChange={e => setSimboloFilter(e.target.value)}
            size='small'
            sx={{ minWidth: 160 }}
          />
          <FormControl size='small' sx={{ minWidth: 160 }}>
            <InputLabel>Tipo</InputLabel>
            <Select value={tipoFilter} label='Tipo' onChange={e => setTipoFilter(e.target.value)}>
              {uniqueTipos.map(t => (
                <MenuItem key={t} value={t}>
                  {t === 'ALL' ? 'Todos' : t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size='small' sx={{ minWidth: 160 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={estadoFilter}
              label='Estado'
              onChange={e => setEstadoFilter(e.target.value)}
            >
              {uniqueEstados.map(e => (
                <MenuItem key={e} value={e}>
                  {e === 'ALL' ? 'Todos' : e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant='body2' color='text.secondary'>
            {filtered.length} operación{filtered.length === 1 ? '' : 'es'}
          </Typography>
        </Box>
      </Paper>

      <Paper>
        <StyledTableContainer>
          <Table stickyHeader size='small' aria-label='Operaciones IOL'>
            <TableHead>
              <TableRow>
                <StickyHeaderCell>#</StickyHeaderCell>
                <StickyHeaderCell>Fecha</StickyHeaderCell>
                <StickyHeaderCell>Tipo</StickyHeaderCell>
                <StickyHeaderCell>Estado</StickyHeaderCell>
                <StickyHeaderCell>Símbolo</StickyHeaderCell>
                <StickyHeaderCell align='right'>Cantidad</StickyHeaderCell>
                <StickyHeaderCell align='right'>Precio</StickyHeaderCell>
                <StickyHeaderCell align='right'>Monto</StickyHeaderCell>
                <StickyHeaderCell>Modalidad</StickyHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.length > 0 ? (
                paginated.map(op => (
                  <HoverRow key={op.numero} onClick={() => handleRowClick(op)}>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{op.numero}</TableCell>
                    <TableCell>{fmtDate(op.fechaOrden)}</TableCell>
                    <TableCell>
                      <Chip label={op.tipo} color={tipoColor(op.tipo)} size='small' />
                    </TableCell>
                    <TableCell>
                      <Chip label={op.estado} color={estadoColor(op.estado)} size='small' />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{op.simbolo}</TableCell>
                    <TableCell align='right'>{fmtNum(op.cantidad)}</TableCell>
                    <TableCell align='right'>{fmtARS(op.precio)}</TableCell>
                    <TableCell align='right' sx={{ fontWeight: 600 }}>
                      {fmtARS(op.monto)}
                    </TableCell>
                    <TableCell>{op.modalidad}</TableCell>
                  </HoverRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Typography align='center' color='text.secondary' sx={{ py: 4 }}>
                      No hay operaciones que coincidan con los filtros.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
          onPageChange={setPage}
        />
      </Box>

      {/* Operation detail drawer */}
      <Drawer anchor='right' open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 360, p: 3 }}>
          <Typography variant='h6' fontWeight={700} gutterBottom>
            Detalle de operación
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {selectedOperationStatus === 'loading' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          )}

          {selectedOperation && selectedOperationStatus === 'succeeded' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'Número', value: String(selectedOperation.numero) },
                { label: 'Fecha', value: fmtDate(selectedOperation.fechaOrden) },
                { label: 'Símbolo', value: selectedOperation.simbolo },
                { label: 'Tipo', value: selectedOperation.tipo },
                { label: 'Estado', value: selectedOperation.estado },
                { label: 'Cantidad', value: fmtNum(selectedOperation.cantidad) },
                { label: 'Precio', value: fmtARS(selectedOperation.precio) },
                { label: 'Monto', value: fmtARS(selectedOperation.monto) },
                { label: 'Modalidad', value: selectedOperation.modalidad },
                ...(selectedOperation.montoUsd != null
                  ? [
                      { label: 'Monto USD', value: fmtUSD(selectedOperation.montoUsd) },
                      {
                        label: 'Tipo de cambio',
                        value: `$${fmtNum(selectedOperation.exchangeRate, 2)}`,
                      },
                    ]
                  : []),
              ].map(row => (
                <Box key={row.label}>
                  <Typography variant='caption' color='text.secondary'>
                    {row.label}
                  </Typography>
                  <Typography variant='body1' fontWeight={500}>
                    {row.value ?? '—'}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Button variant='outlined' fullWidth onClick={handleDrawerClose}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const IolPage = () => {
  const dispatch = useAppDispatch();
  const { portfolioArStatus, portfolioUsStatus, operationsStatus } = useAppSelector(
    (s: RootState) => s.iol
  );

  const [activeTab, setActiveTab] = useState(0);
  const [loadedTabs, setLoadedTabs] = useState<Set<number>>(new Set());

  // Load profile + account statement on mount
  useEffect(() => {
    dispatch(fetchIolProfile());
    dispatch(fetchIolAccountStatement());
    setLoadedTabs(prev => new Set(prev).add(0));
  }, [dispatch]);

  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab);

    if (!loadedTabs.has(newTab)) {
      setLoadedTabs(prev => new Set(prev).add(newTab));
      if (newTab === 1 && portfolioArStatus === 'idle') {
        dispatch(fetchIolPortfolio('argentina'));
      }
      if (newTab === 2 && portfolioUsStatus === 'idle') {
        dispatch(fetchIolPortfolio('estados_unidos'));
      }
      if (newTab === 3 && operationsStatus === 'idle') {
        dispatch(fetchIolOperations());
      }
    }
  };

  const handleRefreshAll = () => {
    dispatch(fetchIolProfile());
    dispatch(fetchIolAccountStatement());
    if (activeTab === 1) dispatch(fetchIolPortfolio('argentina'));
    if (activeTab === 2) dispatch(fetchIolPortfolio('estados_unidos'));
    if (activeTab === 3) dispatch(fetchIolOperations());
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant='h4' fontWeight={700} gutterBottom>
            InvertirOnline
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Cuenta, portafolio y operaciones en tiempo real desde tu cuenta IOL.
          </Typography>
        </Box>
        <Button variant='contained' startIcon={<RefreshIcon />} onClick={handleRefreshAll}>
          Actualizar
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label='Resumen' />
          <Tab label='Portafolio Argentina' />
          <Tab label='Portafolio EE.UU.' />
          <Tab label='Operaciones' />
        </Tabs>
      </Box>

      {activeTab === 0 && <OverviewTab />}
      {activeTab === 1 && <PortfolioTab country='argentina' />}
      {activeTab === 2 && <PortfolioTab country='estados_unidos' />}
      {activeTab === 3 && <OperationsTab />}
    </Container>
  );
};

export default IolPage;
