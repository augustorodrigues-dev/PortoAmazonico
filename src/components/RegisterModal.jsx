import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from './ui/dialog';
import { cadastrarUsuario, loginUsuario, verificarTelefone } from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';
import { FiSmartphone, FiCheck } from 'react-icons/fi';

const papelLabel = { produtor: 'Produtor', fretista: 'Fretista', comprador: 'Comprador' };
const papelCor   = { produtor: '#1a5c38', fretista: '#1565a8', comprador: '#8b5e3c' };

const INIT_CADASTRO = { nome: '', cpf: '', cnpj: '', telefone: '', senha: '', confirmarSenha: '' };
const INIT_LOGIN    = { cpf: '', cnpj: '', senha: '' };

const inputStyle = {
  width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
  borderRadius: '8px', fontSize: '0.9rem', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
};
const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '4px' };
const errStyle   = { fontSize: '0.75rem', color: '#dc2626', marginTop: '3px' };

function maskCPF(v) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function maskCNPJ(v) {
  return v.replace(/\D/g, '').slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}
const onlyDigits = (v) => v.replace(/\D/g, '');

export default function RegisterModal({ open, onClose, papel }) {
  const { loginFromApi } = useAuth();
  const navigate = useNavigate();

  const [aba, setAba] = useState('cadastro');
  const [cadastro, setCadastro] = useState(INIT_CADASTRO);
  const [loginForm, setLoginForm] = useState(INIT_LOGIN);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [erroApi, setErroApi] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [telaRecup, setTelaRecup] = useState(false); // false | 'form' | 'enviado'
  const [telefoneRecup, setTelefoneRecup] = useState('');
  const [erroRecup, setErroRecup] = useState(null);

  const cor = papelCor[papel] ?? '#1a5c38';

  function resetAll() {
    setCadastro(INIT_CADASTRO);
    setLoginForm(INIT_LOGIN);
    setErrors({});
    setErroApi(null);
    setSucesso(false);
    setLoading(false);
    setTelaRecup(false);
    setTelefoneRecup('');
    setErroRecup(null);
  }

  function handleOpenChange(isOpen) {
    if (!isOpen) { resetAll(); onClose(); }
  }

  function handleAba(nova) {
    setAba(nova);
    setErrors({});
    setErroApi(null);
  }

  /* ── Cadastro ── */
  function handleCadastroChange(e) {
    let { name, value } = e.target;
    if (name === 'cpf')      value = maskCPF(value);
    if (name === 'cnpj')     value = maskCNPJ(value);
    if (name === 'telefone') value = maskTelefone(value);
    setCadastro((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined, cpfCnpj: undefined }));
  }

  function validateCadastro() {
    const e = {};
    if (!cadastro.nome.trim()) e.nome = 'Nome é obrigatório.';
    if (!cadastro.cpf.trim() && !cadastro.cnpj.trim()) e.cpfCnpj = 'Preencha CPF ou CNPJ.';
    if (cadastro.cpf  && onlyDigits(cadastro.cpf).length  !== 11) e.cpf  = 'CPF incompleto.';
    if (cadastro.cnpj && onlyDigits(cadastro.cnpj).length !== 14) e.cnpj = 'CNPJ incompleto.';
    if (!cadastro.telefone.trim()) e.telefone = 'Telefone é obrigatório.';
    if (!cadastro.senha) e.senha = 'Senha é obrigatória.';
    else if (cadastro.senha.length < 6) e.senha = 'Mínimo 6 caracteres.';
    if (cadastro.senha !== cadastro.confirmarSenha) e.confirmarSenha = 'As senhas não coincidem.';
    return e;
  }

  async function handleCadastroSubmit(e) {
    e.preventDefault();
    const erros = validateCadastro();
    if (Object.keys(erros).length > 0) { setErrors(erros); return; }
    setLoading(true); setErroApi(null);
    try {
      await cadastrarUsuario({
        nome: cadastro.nome,
        cpf:  cadastro.cpf  ? onlyDigits(cadastro.cpf)  : null,
        cnpj: cadastro.cnpj ? onlyDigits(cadastro.cnpj) : null,
        telefone: cadastro.telefone,
        senha: cadastro.senha,
        papel,
      });
      setSucesso(true);
    } catch (err) {
      setErroApi(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ── Login ── */
  function handleLoginChange(e) {
    let { name, value } = e.target;
    if (name === 'cpf')  value = maskCPF(value);
    if (name === 'cnpj') value = maskCNPJ(value);
    setLoginForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined, cpfCnpj: undefined }));
  }

  function validateLogin() {
    const e = {};
    if (!loginForm.cpf.trim() && !loginForm.cnpj.trim()) e.cpfCnpj = 'Preencha CPF ou CNPJ.';
    if (loginForm.cpf  && onlyDigits(loginForm.cpf).length  !== 11) e.cpf  = 'CPF incompleto.';
    if (loginForm.cnpj && onlyDigits(loginForm.cnpj).length !== 14) e.cnpj = 'CNPJ incompleto.';
    if (!loginForm.senha) e.senha = 'Senha é obrigatória.';
    return e;
  }

  /* ── Recuperação de senha ── */
  function maskTelefone(v) {
    return v.replace(/\D/g, '').slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
  }

  async function handleRecupSubmit(e) {
    e.preventDefault();
    if (!telefoneRecup.trim()) { setErroRecup('Informe o número de telefone.'); return; }
    setLoading(true); setErroRecup(null);
    try {
      const encontrado = await verificarTelefone(telefoneRecup);
      if (!encontrado) {
        setErroRecup('Número não cadastrado.');
      } else {
        setTelaRecup('enviado');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const erros = validateLogin();
    if (Object.keys(erros).length > 0) { setErrors(erros); return; }
    setLoading(true); setErroApi(null);
    try {
      const usuario = await loginUsuario({
        cpf:  loginForm.cpf  ? onlyDigits(loginForm.cpf)  : null,
        cnpj: loginForm.cnpj ? onlyDigits(loginForm.cnpj) : null,
        senha: loginForm.senha,
      });
      loginFromApi(usuario);
      handleOpenChange(false);
      navigate('/dashboard');
    } catch (err) {
      setErroApi(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {telaRecup === 'enviado' ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><FiSmartphone /></div>
            <DialogTitle style={{ color: cor, fontSize: '1.3rem' }}>SMS enviado!</DialogTitle>
            <p style={{ color: '#555', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Enviamos um código de recuperação para <strong>{telefoneRecup}</strong>.<br />
              Verifique suas mensagens.
            </p>
            <button onClick={() => { setTelaRecup(false); setTelefoneRecup(''); setAba('login'); }}
              style={{ backgroundColor: cor, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              Voltar ao login
            </button>
          </div>
        ) : telaRecup === 'form' ? (
          <div>
            <button type="button" onClick={() => { setTelaRecup(false); setErroRecup(null); setTelefoneRecup(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: cor, fontWeight: 600, fontSize: '0.85rem', padding: 0, marginBottom: '1rem' }}>
              ← Voltar
            </button>
            <DialogTitle style={{ color: cor, marginBottom: '0.5rem' }}>Recuperar senha</DialogTitle>
            <DialogDescription style={{ marginBottom: '1.25rem' }}>
              Informe o número de telefone cadastrado. Se existir, simularemos o envio de um SMS.
            </DialogDescription>
            <form onSubmit={handleRecupSubmit} noValidate>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle} htmlFor="recup-tel">Telefone cadastrado *</label>
                <input
                  id="recup-tel" style={inputStyle} placeholder="(92) 99999-0000"
                  value={telefoneRecup} maxLength={15}
                  onChange={(e) => { setTelefoneRecup(maskTelefone(e.target.value)); setErroRecup(null); }}
                />
                {erroRecup && <p style={errStyle}>{erroRecup}</p>}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => handleOpenChange(false)}
                  style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  style={{ backgroundColor: loading ? '#999' : cor, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.88rem' }}>
                  {loading ? 'Verificando...' : 'Enviar SMS'}
                </button>
              </div>
            </form>
          </div>
        ) : sucesso ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}><FiCheck /></div>
            <DialogTitle style={{ color: cor, fontSize: '1.3rem' }}>Cadastro realizado!</DialogTitle>
            <p style={{ color: '#555', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Sua conta de <strong>{papelLabel[papel]}</strong> foi criada. Faça login para entrar.
            </p>
            <button onClick={() => { setSucesso(false); setAba('login'); }}
              style={{ backgroundColor: cor, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              Ir para o login
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: cor, display: 'inline-block', flexShrink: 0 }} />
                <DialogTitle style={{ color: cor }}>{papelLabel[papel]}</DialogTitle>
              </div>

              {/* Abas */}
              <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '1.25rem' }}>
                {['cadastro', 'login'].map((a) => (
                  <button key={a} type="button" onClick={() => handleAba(a)}
                    style={{
                      flex: 1, padding: '0.5rem', border: 'none', background: 'none',
                      fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                      color: aba === a ? cor : '#9ca3af',
                      borderBottom: aba === a ? `2px solid ${cor}` : '2px solid transparent',
                      marginBottom: '-2px', transition: 'color 0.15s',
                    }}>
                    {a === 'cadastro' ? 'Criar conta' : 'Entrar'}
                  </button>
                ))}
              </div>

              <DialogDescription>
                {aba === 'cadastro'
                  ? 'Preencha seus dados. CPF ou CNPJ é obrigatório.'
                  : 'Informe suas credenciais para acessar a plataforma.'}
              </DialogDescription>
            </DialogHeader>

            {aba === 'cadastro' ? (
              <form onSubmit={handleCadastroSubmit} noValidate>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle} htmlFor="reg-nome">Nome completo *</label>
                  <input id="reg-nome" name="nome" style={inputStyle} placeholder="Seu nome completo" value={cadastro.nome} onChange={handleCadastroChange} />
                  {errors.nome && <p style={errStyle}>{errors.nome}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: errors.cpfCnpj ? '0.25rem' : '1rem' }}>
                  <div>
                    <label style={labelStyle} htmlFor="reg-cpf">CPF</label>
                    <input id="reg-cpf" name="cpf" style={inputStyle} placeholder="000.000.000-00" value={cadastro.cpf} onChange={handleCadastroChange} maxLength={14} />
                    {errors.cpf && <p style={errStyle}>{errors.cpf}</p>}
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="reg-cnpj">CNPJ</label>
                    <input id="reg-cnpj" name="cnpj" style={inputStyle} placeholder="00.000.000/0000-00" value={cadastro.cnpj} onChange={handleCadastroChange} maxLength={18} />
                    {errors.cnpj && <p style={errStyle}>{errors.cnpj}</p>}
                  </div>
                </div>
                {errors.cpfCnpj && <p style={{ ...errStyle, marginBottom: '1rem' }}>{errors.cpfCnpj}</p>}

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle} htmlFor="reg-telefone">Telefone *</label>
                  <input id="reg-telefone" name="telefone" style={inputStyle} placeholder="(92) 99999-0000" value={cadastro.telefone} onChange={handleCadastroChange} maxLength={15} />
                  {errors.telefone && <p style={errStyle}>{errors.telefone}</p>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={labelStyle} htmlFor="reg-senha">Senha *</label>
                    <input id="reg-senha" name="senha" type="password" style={inputStyle} placeholder="Mín. 6 caracteres" value={cadastro.senha} onChange={handleCadastroChange} />
                    {errors.senha && <p style={errStyle}>{errors.senha}</p>}
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="reg-confirmar">Confirmar senha *</label>
                    <input id="reg-confirmar" name="confirmarSenha" type="password" style={inputStyle} placeholder="Repita a senha" value={cadastro.confirmarSenha} onChange={handleCadastroChange} />
                    {errors.confirmarSenha && <p style={errStyle}>{errors.confirmarSenha}</p>}
                  </div>
                </div>

                {erroApi && <p style={{ ...errStyle, marginBottom: '1rem', textAlign: 'center' }}>{erroApi}</p>}

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => handleOpenChange(false)}
                    style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading}
                    style={{ backgroundColor: loading ? '#999' : cor, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.88rem' }}>
                    {loading ? 'Cadastrando...' : 'Criar conta'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: errors.cpfCnpj ? '0.25rem' : '1rem' }}>
                  <div>
                    <label style={labelStyle} htmlFor="login-cpf">CPF</label>
                    <input id="login-cpf" name="cpf" style={inputStyle} placeholder="000.000.000-00" value={loginForm.cpf} onChange={handleLoginChange} maxLength={14} />
                    {errors.cpf && <p style={errStyle}>{errors.cpf}</p>}
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="login-cnpj">CNPJ</label>
                    <input id="login-cnpj" name="cnpj" style={inputStyle} placeholder="00.000.000/0000-00" value={loginForm.cnpj} onChange={handleLoginChange} maxLength={18} />
                    {errors.cnpj && <p style={errStyle}>{errors.cnpj}</p>}
                  </div>
                </div>
                {errors.cpfCnpj && <p style={{ ...errStyle, marginBottom: '1rem' }}>{errors.cpfCnpj}</p>}

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle} htmlFor="login-senha">Senha *</label>
                  <input id="login-senha" name="senha" type="password" style={inputStyle} placeholder="Sua senha" value={loginForm.senha} onChange={handleLoginChange} />
                  {errors.senha && <p style={errStyle}>{errors.senha}</p>}
                </div>

                {erroApi && <p style={{ ...errStyle, marginBottom: '1rem', textAlign: 'center' }}>{erroApi}</p>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => { setTelaRecup('form'); setErroApi(null); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: cor, fontWeight: 600, fontSize: '0.82rem', padding: 0, textDecoration: 'underline' }}>
                    Esqueceu a senha?
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" onClick={() => handleOpenChange(false)}
                      style={{ background: 'none', border: '1px solid #d1d5db', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>
                      Cancelar
                    </button>
                    <button type="submit" disabled={loading}
                      style={{ backgroundColor: loading ? '#999' : cor, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.88rem' }}>
                      {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
