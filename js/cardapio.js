/* =========================================
   MARMITA DO 10 – Cardápio JS
   Onda Tech · Salvador Galdino
   ========================================= */

const WA_NUMBER = '5541995199032';

// ── Dados do cardápio ──
const produtos = [
  // Marmitas
  {
    id: 1, cat: 'marmitas', nome: 'Marmita Pequena', emoji: '🍱',
    img: 'img/marmita-pequena.png',
    desc: 'Arroz, feijão, farofa e macarrão. Escolha 1 opção de carne.',
    preco: 10.00, badge: null
  },
  {
    id: 2, cat: 'marmitas', nome: 'Marmita Média', emoji: '🍱',
    img: 'img/marmita-media.png',
    desc: 'Arroz, feijão, farofa e macarrão. Escolha 1 opção de carne. Porção maior!',
    preco: 17.00, badge: 'Mais pedido'
  },
  {
    id: 3, cat: 'marmitas', nome: 'Marmita Grande', emoji: '🍱',
    img: 'img/marmita-grande.png',
    desc: 'Arroz, feijão, farofa e macarrão. Escolha 1 opção de carne. Porção família!',
    preco: 20.00, badge: null
  },

  // Adicionais
  {
    id: 4, cat: 'adicionais', nome: 'Adicional de Carne', emoji: '🥩',
    img: 'img/adicional-carne.png',
    desc: 'Adicione uma porção extra de carne à sua marmita (qualquer opção disponível).',
    preco: 3.00, badge: null
  },
];

// ── Opções de carne (exibidas como info no cardápio) ──
const opcoesCarneTexto = 'Calabresa acebolada · Ovos fritos · Carne moída com legumes';

// ── Estado ──
let carrinho = {};
let tipoEntrega = 'entrega';
let pagamentoSelecionado = '';

// ── Render menu ──
function renderMenu(catFiltro = 'todos') {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  const filtrados = catFiltro === 'todos' ? produtos : produtos.filter(p => p.cat === catFiltro);

  filtrados.forEach(p => {
    const noCarrinho = carrinho[p.id]?.qty > 0;
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="card-img-wrap">
        ${p.img
          ? `<img src="${p.img}" alt="${p.nome}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="card-emoji-fallback" style="display:none">${p.emoji}</div>`
          : `<div class="card-emoji-fallback">${p.emoji}</div>`
        }
        ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-name">${p.nome}</div>
        <div class="card-desc">${p.desc}</div>
        ${p.cat === 'marmitas' ? `<div class="card-desc" style="margin-top:6px;color:#0B6E8F;font-size:.78rem;"><strong>Carnes:</strong> ${opcoesCarneTexto}</div>` : ''}
      </div>
      <div class="card-footer-custom">
        <div class="card-price">
          R$ ${p.preco.toFixed(2).replace('.', ',')}
        </div>
        <button class="btn-add ${noCarrinho ? 'added' : ''}" data-id="${p.id}">
          ${noCarrinho ? '<i class="bi bi-check-lg"></i>' : '<i class="bi bi-plus-lg"></i>'}
        </button>
      </div>`;
    grid.appendChild(card);
  });

  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => adicionarItem(parseInt(btn.dataset.id)));
  });
}

// ── Carrinho ──
function adicionarItem(id) {
  const prod = produtos.find(p => p.id === id);
  if (!prod) return;
  if (!carrinho[id]) carrinho[id] = { ...prod, qty: 1 };
  else carrinho[id].qty++;
  const btn = document.querySelector(`.btn-add[data-id="${id}"]`);
  if (btn) { btn.classList.add('added'); btn.innerHTML = '<i class="bi bi-check-lg"></i>'; }
  atualizarCarrinho();
  abrirCarrinho();
}

function removerUm(id) {
  if (!carrinho[id]) return;
  carrinho[id].qty--;
  if (carrinho[id].qty <= 0) {
    delete carrinho[id];
    const btn = document.querySelector(`.btn-add[data-id="${id}"]`);
    if (btn) { btn.classList.remove('added'); btn.innerHTML = '<i class="bi bi-plus-lg"></i>'; }
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const itens = Object.values(carrinho);
  const total = itens.reduce((acc, i) => acc + i.preco * i.qty, 0);
  const qtdTotal = itens.reduce((acc, i) => acc + i.qty, 0);

  const countEl = document.getElementById('cartCount');
  if (qtdTotal > 0) { countEl.textContent = qtdTotal; countEl.classList.add('show'); }
  else { countEl.classList.remove('show'); }

  const emptyEl  = document.getElementById('cartEmpty');
  const listEl   = document.getElementById('cartList');
  const footerEl = document.getElementById('cartFooter');

  if (itens.length === 0) {
    emptyEl.style.display = 'block';
    listEl.innerHTML = '';
    footerEl.style.display = 'none';
    return;
  }
  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';

  listEl.innerHTML = itens.map(item => `
    <li class="cart-item">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nome}</div>
        <div class="cart-item-price">R$ ${(item.preco * item.qty).toFixed(2).replace('.', ',')}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="removerUm(${item.id})">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="adicionarItem(${item.id})">+</button>
      </div>
    </li>`).join('');

  document.getElementById('cartTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ── Sidebar ──
function abrirCarrinho() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function fecharCarrinho() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

// ── Modal Checkout ──
function abrirModal() {
  fecharCarrinho();
  preencherResumo();
  document.getElementById('modalCheckout').classList.add('open');
  document.getElementById('modalOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function fecharModal() {
  document.getElementById('modalCheckout').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

function preencherResumo() {
  const itens = Object.values(carrinho);
  const total = itens.reduce((acc, i) => acc + i.preco * i.qty, 0);
  document.getElementById('resumoLista').innerHTML = itens.map(i =>
    `<li><span>${i.qty}x ${i.nome}</span><span>R$ ${(i.preco * i.qty).toFixed(2).replace('.', ',')}</span></li>`
  ).join('');
  document.getElementById('resumoTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ── Tipo entrega/retirada ──
function setTipo(tipo) {
  tipoEntrega = tipo;
  document.querySelectorAll('.tipo-btn').forEach(b => b.classList.toggle('active', b.dataset.tipo === tipo));
  document.getElementById('camposEntrega').style.display = tipo === 'entrega' ? 'flex' : 'none';
}

// ── Pagamento ──
function setPagamento(pag) {
  pagamentoSelecionado = pag;
  document.querySelectorAll('.pag-btn').forEach(b => b.classList.toggle('active', b.dataset.pag === pag));
  document.getElementById('trocoWrap').style.display = pag === 'Dinheiro' ? 'block' : 'none';
}

// ── Validação ──
function validar() {
  const nome = document.getElementById('inputNome').value.trim();
  if (!nome) { alert('Por favor, informe seu nome.'); return false; }
  if (!pagamentoSelecionado) { alert('Selecione a forma de pagamento.'); return false; }
  if (tipoEntrega === 'entrega') {
    const rua    = document.getElementById('inputRua').value.trim();
    const numero = document.getElementById('inputNumero').value.trim();
    const bairro = document.getElementById('inputBairro').value.trim();
    if (!rua || !numero || !bairro) { alert('Preencha rua, número e bairro para entrega.'); return false; }
  }
  return true;
}

// ── Montar e enviar WhatsApp ──
function enviarWhatsApp() {
  if (!validar()) return;

  const itens  = Object.values(carrinho);
  const total  = itens.reduce((acc, i) => acc + i.preco * i.qty, 0);
  const nome   = document.getElementById('inputNome').value.trim();
  const obs    = document.getElementById('inputObs').value.trim();
  const troco  = document.getElementById('inputTroco').value.trim();

  let msg = '🍱 *Pedido – Marmita do 10*\n\n';

  msg += '*🛒 Itens do pedido:*\n';
  itens.forEach(i => {
    msg += `• ${i.qty}x ${i.nome} — R$ ${(i.preco * i.qty).toFixed(2).replace('.', ',')}\n`;
  });
  msg += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n`;

  msg += `\n*📦 Tipo:* ${tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada no local'}\n`;

  if (tipoEntrega === 'entrega') {
    const rua    = document.getElementById('inputRua').value.trim();
    const numero = document.getElementById('inputNumero').value.trim();
    const bairro = document.getElementById('inputBairro').value.trim();
    const cidade = document.getElementById('inputCidade').value.trim();
    const ref    = document.getElementById('inputRef').value.trim();
    msg += `\n*📍 Endereço:*\n`;
    msg += `${rua}, ${numero} – ${bairro}, ${cidade}\n`;
    if (ref) msg += `Referência: ${ref}\n`;
  }

  msg += `\n*👤 Nome:* ${nome}\n`;
  msg += `*💳 Pagamento:* ${pagamentoSelecionado}\n`;
  if (pagamentoSelecionado === 'Dinheiro' && troco) msg += `Troco para: ${troco}\n`;
  if (obs) msg += `\n*📝 Obs:* ${obs}\n`;

  msg += '\nOlá! Gostaria de confirmar esse pedido. 😊';

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();

  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderMenu(pill.dataset.cat);
    });
  });

  document.getElementById('cartToggle').addEventListener('click', abrirCarrinho);
  document.getElementById('cartClose').addEventListener('click', fecharCarrinho);
  document.getElementById('cartOverlay').addEventListener('click', fecharCarrinho);
  document.getElementById('btnFinalizar').addEventListener('click', abrirModal);
  document.getElementById('modalClose').addEventListener('click', fecharModal);
  document.getElementById('modalOverlay').addEventListener('click', fecharModal);

  document.querySelectorAll('.tipo-btn').forEach(btn => {
    btn.addEventListener('click', () => setTipo(btn.dataset.tipo));
  });
  setTipo('entrega');

  document.querySelectorAll('.pag-btn').forEach(btn => {
    btn.addEventListener('click', () => setPagamento(btn.dataset.pag));
  });

  document.getElementById('btnWhatsApp').addEventListener('click', enviarWhatsApp);
});
