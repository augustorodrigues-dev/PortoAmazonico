import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdHome, MdAssignment, MdInventory, MdDirectionsBoat,
  MdHistory, MdBarChart, MdShoppingCart, MdLocationOn, MdSettings,
} from 'react-icons/md';

const menuProdutor = [
  { section: 'Início', items: [{ to: '/dashboard', icon: <MdHome />, label: 'Painel' }] },
  {
    section: 'Produção',
    items: [
      { to: '/producao/registrar', icon: <MdAssignment />, label: 'Registrar Colheita' },
      { to: '/producao/anunciar', icon: <MdInventory />, label: 'Anunciar Mercadoria' },
    ],
  },
  {
    section: 'Logística',
    items: [{ to: '/logistica/rotas', icon: <MdDirectionsBoat />, label: 'Consultar Fretes' }],
  },
  {
    section: 'Histórico',
    items: [
      { to: '/historico', icon: <MdHistory />, label: 'Minhas Transações' },
      { to: '/indicadores', icon: <MdBarChart />, label: 'Indicadores' },
    ],
  },
];

const menuComprador = [
  { section: 'Início', items: [{ to: '/dashboard', icon: <MdHome />, label: 'Painel' }] },
  {
    section: 'Mercado',
    items: [{ to: '/catalogo', icon: <MdShoppingCart />, label: 'Catálogo' }],
  },
  {
    section: 'Logística',
    items: [
      { to: '/logistica/nova-rota', icon: <MdLocationOn />, label: 'Cadastrar Rota' },
      { to: '/logistica/rotas', icon: <MdDirectionsBoat />, label: 'Rotas Disponíveis' },
    ],
  },
  {
    section: 'Histórico',
    items: [
      { to: '/historico', icon: <MdHistory />, label: 'Minhas Transações' },
      { to: '/indicadores', icon: <MdBarChart />, label: 'Indicadores' },
    ],
  },
];

const menuAdmin = [
  { section: 'Início', items: [{ to: '/dashboard', icon: <MdHome />, label: 'Painel' }] },
  {
    section: 'Administração',
    items: [
      { to: '/admin', icon: <MdSettings />, label: 'Painel Admin' },
      { to: '/historico', icon: <MdHistory />, label: 'Transações' },
      { to: '/indicadores', icon: <MdBarChart />, label: 'Indicadores' },
    ],
  },
];

const menus = { produtor: menuProdutor, comprador: menuComprador, admin: menuAdmin };

export default function Sidebar() {
  const { usuario } = useAuth();
  const menu = menus[usuario?.papel] ?? [];

  return (
    <aside className="sidebar">
      {menu.map((group) => (
        <div key={group.section}>
          <div className="sidebar-section">{group.section}</div>
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  );
}
