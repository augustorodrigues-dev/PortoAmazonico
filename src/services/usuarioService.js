// Usuários em memória — reseta ao fechar o navegador
// O array cresce enquanto a aplicação estiver aberta na sessão
const usuarios = [
  { id: 'u1', nome: 'Maria da Silva',  cpf: '111.111.111-11', cnpj: null,                 telefone: '(92) 99999-0001', senha: '111111', papel: 'produtor',  pix: '111.111.111-11',     reputacao: 4.7, totalAvaliacoes: 23, ativo: true },
  { id: 'u2', nome: 'João Pereira',    cpf: '222.222.222-22', cnpj: null,                 telefone: '(92) 99999-0002', senha: '222222', papel: 'comprador', pix: '222.222.222-22',     reputacao: 4.2, totalAvaliacoes: 10, ativo: true },
  { id: 'u3', nome: 'Carlos Mendes',   cpf: null,             cnpj: '33.333.333/0001-33', telefone: '(92) 99999-0003', senha: '333333', papel: 'produtor',  pix: '33.333.333/0001-33', reputacao: 4.9, totalAvaliacoes: 40, ativo: true },
  { id: 'u4', nome: 'Admin',           cpf: '000.000.000-00', cnpj: null,                 telefone: '(92) 99999-0000', senha: '000000', papel: 'admin',     pix: null,                 reputacao: null, totalAvaliacoes: 0, ativo: true },
  { id: 'u5', nome: 'Ana Ribeiro',     cpf: '444.444.444-44', cnpj: null,                 telefone: '(92) 99999-0004', senha: '444444', papel: 'comprador', pix: '444.444.444-44',     reputacao: 3.8, totalAvaliacoes: 5,  ativo: true },
];

let proximoId = usuarios.length + 1;

function formatarCPF(digits) {
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarCNPJ(digits) {
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function cadastrarUsuario(dados) {
  const { nome, cpf, cnpj, telefone, senha, papel } = dados;

  const cpfFormatado  = cpf  ? formatarCPF(cpf)  : null;
  const cnpjFormatado = cnpj ? formatarCNPJ(cnpj) : null;

  const jaExiste = usuarios.find(
    (u) =>
      (cpfFormatado  && u.cpf  === cpfFormatado)  ||
      (cnpjFormatado && u.cnpj === cnpjFormatado) ||
      u.telefone === telefone,
  );
  if (jaExiste) {
    return Promise.reject(new Error('CPF, CNPJ ou telefone já cadastrado.'));
  }

  const novoUsuario = {
    id: 'u' + proximoId++,
    nome,
    cpf:  cpfFormatado  ?? null,
    cnpj: cnpjFormatado ?? null,
    telefone,
    senha,
    papel,
    pix: cpfFormatado ?? cnpjFormatado ?? null,
    reputacao: null,
    totalAvaliacoes: 0,
    ativo: true,
  };

  usuarios.push(novoUsuario);
  return Promise.resolve(novoUsuario);
}

export function loginUsuario(dados) {
  const { cpf, cnpj, senha } = dados;

  const cpfFormatado  = cpf  ? formatarCPF(cpf)  : null;
  const cnpjFormatado = cnpj ? formatarCNPJ(cnpj) : null;

  const usuario = usuarios.find(
    (u) =>
      (cpfFormatado  && u.cpf  === cpfFormatado)  ||
      (cnpjFormatado && u.cnpj === cnpjFormatado),
  );

  if (!usuario) {
    return Promise.reject(new Error('CPF/CNPJ não encontrado.'));
  }

  if (usuario.senha !== senha) {
    return Promise.reject(new Error('Senha incorreta.'));
  }

  return Promise.resolve(usuario);
}

// Verifica se um telefone está cadastrado (usado na recuperação de senha)
export function verificarTelefone(telefone) {
  const digits = telefone.replace(/\D/g, '');
  const encontrado = usuarios.find((u) => u.telefone.replace(/\D/g, '') === digits);
  return Promise.resolve(!!encontrado);
}

// Utilitário de debug — chame listarUsuarios() no console para ver quem está cadastrado
export function listarUsuarios() {
  return [...usuarios];
}
