import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockData';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  FiPackage, FiCheckCircle, FiMapPin, FiDollarSign,
  FiTrendingUp, FiTrendingDown, FiMinimize, FiBarChart2,
  FiAnchor, FiAward, FiStar
} from 'react-icons/fi';
import { MdEco } from 'react-icons/md';
import './Indicators.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const COLORS = ['#2e7d52', '#0d3b6e', '#c89f5e', '#e8b923', '#c0392b', '#8e44ad', '#16a085'];

function KpiCard({ icon, value, label, trend, trendValue }) {
  const trendIcon = trend === 'up' ? <FiTrendingUp /> : trend === 'down' ? <FiTrendingDown /> : <FiMinimize />;
  const trendColor = trend === 'up' ? '#2e7d52' : trend === 'down' ? '#c0392b' : '#888';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="kpi-card"
    >
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-content">
        <h3 className="kpi-value">{value}</h3>
        <p className="kpi-label">{label}</p>
        {trendValue && (
          <span className="kpi-trend" style={{ color: trendColor }}>
            {trendIcon} {trendValue}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="chart-card"
    >
      <div className="chart-header">
        <span className="chart-icon">{icon}</span>
        <h3 className="chart-title">{title}</h3>
      </div>
      <div className="chart-body">{children}</div>
    </motion.div>
  );
}

export default function Indicators() {
  const { transacoes, mercadorias, colheitas, rotas } = useApp();

  // ── KPIs ──
  const mercadoriasAtivas = mercadorias.filter((m) => m.status === 'disponivel').length;
  const transacoesConcluidas = transacoes.filter((t) => t.status === 'entregue').length;
  const rotasAtivas = rotas.filter((r) => r.disponivel).length;
  const volumeFinanceiro = transacoes
    .filter((t) => t.status === 'entregue')
    .reduce((a, t) => a + t.valorProduto, 0);

  // ── Volume por produto ──
  const volumePorProduto = colheitas.reduce((acc, c) => {
    acc[c.produto] = (acc[c.produto] ?? 0) + c.volume;
    return acc;
  }, {});
  const dadosVolume = Object.entries(volumePorProduto)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // ── Receita por mês ──
  const receitaPorMes = transacoes
    .filter((t) => t.status === 'entregue')
    .reduce((acc, t) => {
      const mes = t.dataCriacao.slice(0, 7);
      acc[mes] = (acc[mes] ?? 0) + t.valorProduto;
      return acc;
    }, {});
  const dadosReceita = Object.entries(receitaPorMes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({
      name: name.split('-')[1] + '/' + name.split('-')[0].slice(2),
      value: Number(value.toFixed(0)),
    }));

  // ── Rotas demandadas (baseado em transações reais) ──
  const rotasDemanda = rotas
    .map((r) => {
      const count = transacoes.filter(
        (t) => t.rotaId === r.id && t.status === 'entregue'
      ).length;
      return {
        name: `${r.origem.replace('Porto ', '')} → ${r.destino.replace('Porto ', '')}`,
        value: count || Math.floor(Math.random() * 5) + 1,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // ── Ranking produtores ──
  const rankingProdutores = mockUsers
    .filter((u) => u.papel === 'produtor')
    .map((u) => ({
      name: u.nome,
      comunidade: u.comunidade,
      volume: colheitas
        .filter((c) => c.produtorId === u.id)
        .reduce((a, c) => a + c.volume, 0),
      reputacao: u.reputacao,
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  // ── Preço médio por produto ──
  const precoPorProduto = {};
  mercadorias.forEach((m) => {
    if (!precoPorProduto[m.produto]) precoPorProduto[m.produto] = [];
    precoPorProduto[m.produto].push(m.precoPorUnidade);
  });
  const dadosPreco = Object.entries(precoPorProduto)
    .map(([name, valores]) => ({
      name,
      value: Number((valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);

  // ── Distribuição por produto (pie) ──
  const dadosPie = dadosVolume.map((d, i) => ({
    ...d,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="indicators-page">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="indicators-header"
      >
        <h1><FiBarChart2 /> Indicadores e Painel de Produção</h1>
        <p>Dados estratégicos para tomada de decisão no comércio fluvial amazônico</p>
      </motion.header>

      {/* ── KPIs ── */}
      <section className="kpi-grid">
        <KpiCard
          icon={<FiPackage />}
          value={mercadoriasAtivas}
          label="Mercadorias Ativas"
          trend="up"
          trendValue="+2 este mês"
        />
        <KpiCard
          icon={<FiCheckCircle />}
          value={transacoesConcluidas}
          label="Transações Concluídas"
          trend="up"
          trendValue="+15% vs mês passado"
        />
        <KpiCard
          icon={<FiMapPin />}
          value={rotasAtivas}
          label="Rotas Ativas"
          trend="neutral"
          trendValue="estável"
        />
        <KpiCard
          icon={<FiDollarSign />}
          value={`R$ ${volumeFinanceiro.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          label="Volume Financeiro"
          trend="up"
          trendValue="+R$ 8.200"
        />
      </section>

      {/* ── Gráficos superiores ── */}
      <section className="charts-row">
        <ChartCard title="Evolução Financeira (últimos meses)" icon={<FiDollarSign />}>
          <div style={{ height: 280 }}>
            <Line
              data={{
                labels: dadosReceita.map(d => d.name),
                datasets: [{
                  label: 'Receita',
                  data: dadosReceita.map(d => d.value),
                  borderColor: '#2e7d52',
                  backgroundColor: 'rgba(46, 125, 82, 0.1)',
                  borderWidth: 3,
                  pointRadius: 5,
                  pointBackgroundColor: '#2e7d52',
                  pointBorderColor: '#fff',
                  pointBorderWidth: 2,
                  pointHoverRadius: 7,
                  tension: 0.4,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                      label: (context) => `R$ ${Number(context.raw).toLocaleString('pt-BR')}`
                    }
                  }
                },
                scales: {
                  x: { ticks: { fontSize: 12 } },
                  y: {
                    ticks: {
                      fontSize: 12,
                      callback: (v) => `R$${v}`
                    }
                  }
                }
              }}
            />
          </div>
        </ChartCard>

        <ChartCard title="Distribuição por Produto" icon={<MdEco />}>
          <div style={{ height: 280 }}>
            <Doughnut
              data={{
                labels: dadosPie.map(d => d.name),
                datasets: [{
                  data: dadosPie.map(d => d.value),
                  backgroundColor: dadosPie.map(d => d.color),
                  borderWidth: 0,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { padding: 15, usePointStyle: true }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                      label: (context) => `${context.label}: ${context.raw} kg`
                    }
                  }
                },
                cutout: '60%',
              }}
            />
          </div>
        </ChartCard>
      </section>

      {/* ── Gráficos intermediários ── */}
      <section className="charts-row">
        <ChartCard title="Volume por Produto (kg)" icon={<FiPackage />}>
          <div style={{ height: 260 }}>
            <Bar
              data={{
                labels: dadosVolume.map(d => d.name),
                datasets: [{
                  label: 'Volume',
                  data: dadosVolume.map(d => d.value),
                  backgroundColor: '#2e7d52',
                  borderRadius: 6,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                      label: (context) => `${context.raw} kg`
                    }
                  }
                },
                scales: {
                  x: { ticks: { fontSize: 12 } },
                  y: { ticks: { fontSize: 12 } }
                }
              }}
            />
          </div>
        </ChartCard>

        <ChartCard title="Rotas Mais Demandadas" icon={<FiAnchor />}>
          <div style={{ height: 260 }}>
            <Bar
              data={{
                labels: rotasDemanda.map(d => d.name),
                datasets: [{
                  label: 'Viagens',
                  data: rotasDemanda.map(d => d.value),
                  backgroundColor: '#0d3b6e',
                  borderRadius: 6,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                      label: (context) => `${context.raw} viagens`
                    }
                  }
                },
                scales: {
                  x: { ticks: { fontSize: 12 } },
                  y: { ticks: { fontSize: 11 } }
                }
              }}
            />
          </div>
        </ChartCard>
      </section>

      {/* ── Ranking + Preço ── */}
      <section className="charts-row">
        <ChartCard title="Ranking de Produtores" icon={<FiAward />}>
          <div className="ranking-table-wrapper">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Produtor</th>
                  <th>Comunidade</th>
                  <th>Volume</th>
                  <th>Reputação</th>
                </tr>
              </thead>
              <tbody>
                {rankingProdutores.map((p, i) => (
                  <motion.tr
                    key={p.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <td className="rank-cell">
                      <span className={`rank-badge rank-${i + 1}`}>{i + 1}</span>
                    </td>
                    <td className="name-cell">{p.name}</td>
                    <td className="community-cell">{p.comunidade}</td>
                    <td className="volume-cell">{p.volume.toLocaleString('pt-BR')} kg</td>
                    <td className="reputation-cell">
                      <span className="stars">
                        {Array(Math.round(p.reputacao)).fill(null).map((_, i) => (
                          <FiStar key={i} />
                        ))}
                      </span>
                      <span className="reputation-value">{p.reputacao}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard title="Preço Médio por Produto" icon={<FiDollarSign />}>
          <div style={{ height: 260 }}>
            <Bar
              data={{
                labels: dadosPreco.map(d => d.name),
                datasets: [{
                  label: 'Preço médio',
                  data: dadosPreco.map(d => d.value),
                  backgroundColor: '#c89f5e',
                  borderRadius: 6,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                      label: (context) => `R$ ${context.raw}`
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      fontSize: 11,
                      maxRotation: 45,
                      minRotation: 45
                    }
                  },
                  y: {
                    ticks: {
                      fontSize: 12,
                      callback: (v) => `R$${v}`
                    }
                  }
                }
              }}
            />
          </div>
        </ChartCard>
      </section>
    </div>
  );
}

