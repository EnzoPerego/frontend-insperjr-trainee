// Tipos base para o projeto seguindo padrões da coordenadora

// Tipos para estados com null
export type StateWithNull<T> = T | null;

// Tipos para objetos de tradução (seguindo padrão Record<string, string>)
export type TranslationObject = Record<string, string>;

// Tipos para produtos
export interface Produto {
  id: string;
  titulo: string;
  descricao_capa?: string;
  descricao_geral?: string;
  image_url?: string;
  preco: number;
  preco_promocional?: number;
  status: 'Ativo' | 'Inativo' | 'Indisponível';
  estrelas_kaiserhaus: boolean;
  categoria: {
    id: string;
    nome: string;
  };
  acompanhamentos: Acompanhamento[];
  created_at: string;
  updated_at: string;
}

export interface Acompanhamento {
  nome: string;
  preco: number;
}

// Tipos para pedidos
export interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  status: PedidoStatus;
  total: number;
  data: string;
  itens: PedidoItem[];
}

export interface PedidoItem {
  produto: string;
  quantidade: number;
  preco: number;
}

// Tipos para categorias
export interface Categoria {
  id: string;
  nome: string;
}

// Tipos para componentes
export interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onMobileMenuClose: () => void;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  onLogout?: () => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  className?: string;
}

// Tipos para funções de callback
export type VoidFunction = () => void;
export type AsyncVoidFunction = () => Promise<void>;
export type StateSetter<T> = (value: T) => void;

// Tipos para filtros e ordenação
export type SortOption = 'menor' | 'maior' | 'az' | '';
export type FilterOption = string | null;

// Tipos para status de produtos
export type ProdutoStatus = 'Ativo' | 'Inativo' | 'Indisponível';

// Tipos para status de pedidos
// Ampliado para cobrir tanto os rótulos antigos do frontend quanto os do backend
export type PedidoStatus =
  | 'Pendente'
  | 'Em preparo'
  | 'Pronto'
  | 'Saiu para entrega'
  | 'Entregue'
  | 'Cancelado'
  | 'À caminho'
  | 'Ativo'
  | 'Concluído';
