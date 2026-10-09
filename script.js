
const html = document.documentElement;
const btnTema = document.getElementById('btnTema');

function aplicarTema(tema) {
  html.dataset.tema = tema;
  btnTema.textContent = tema === 'escuro' ? '☀️' : '🌙';
  try { localStorage.setItem('tema', tema); } catch (e) {}
}
let salvo = null;
try { salvo = localStorage.getItem('tema'); } catch (e) {}
aplicarTema(salvo || (matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'));
btnTema.addEventListener('click', () => aplicarTema(html.dataset.tema === 'claro' ? 'escuro' : 'claro'));


const alvo = document.getElementById('digitado');
const frase = alvo.dataset.texto;
let i = 0;
(function digitar() {
  if (i <= frase.length) {
    alvo.textContent = frase.slice(0, i++);
    setTimeout(digitar, 90);
  }
})();


const secoes = document.querySelectorAll('.secao');
secoes.forEach(s => s.classList.add('oculto'));
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visivel');
    e.target.querySelectorAll('.nivel').forEach(n => n.style.width = n.dataset.nivel + '%');
    observador.unobserve(e.target);
  });
}, { threshold: 0.2 });
secoes.forEach(s => observador.observe(s));


const estrelas = document.querySelectorAll('.estrela');
document.addEventListener('mousemove', e => {
  const x = (e.clientX / innerWidth - 0.5) * 30;
  const y = (e.clientY / innerHeight - 0.5) * 30;
  estrelas.forEach((s, n) => s.style.translate = `${x * (n + 1)}px ${y * (n + 1)}px`);
});


const nome = document.getElementById('nome');
const telefone = document.getElementById('telefone');
const email = document.getElementById('email');
const mensagem = document.getElementById('mensagem');
const contador = document.getElementById('contador');
const retorno = document.getElementById('retorno');


nome.addEventListener('input', () => {
  nome.value = nome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
});

telefone.addEventListener('input', () => {
  let n = telefone.value.replace(/\D/g, '').slice(0, 11);
  if (n.length > 6) n = `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  else if (n.length > 2) n = `(${n.slice(0, 2)}) ${n.slice(2)}`;
  else if (n.length > 0) n = `(${n}`;
  telefone.value = n;
});


mensagem.addEventListener('input', () => {
  contador.textContent = `${mensagem.value.length}/200`;
});

document.getElementById('formulario').addEventListener('submit', e => {
  e.preventDefault();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  const regras = [
    [nome, nome.value.trim().length >= 3],
    [telefone, telefone.value.length === 15],
    [email, emailOk],
    [mensagem, mensagem.value.trim().length >= 10]
  ];
  regras.forEach(([campo, ok]) => campo.classList.toggle('erro', !ok));
  if (regras.every(([, ok]) => ok)) {
    retorno.textContent = `Obrigado, ${nome.value.split(' ')[0]}! Mensagem enviada com sucesso.`;
    e.target.reset();
    contador.textContent = '0/200';
  } else {
    retorno.textContent = 'Confira os campos em vermelho: nome (mín. 3 letras), telefone completo, e-mail válido e mensagem (mín. 10 caracteres).';
  }
});
