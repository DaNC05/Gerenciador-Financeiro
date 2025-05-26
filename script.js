
const tbody = document.getElementById('historicoLancamentos');
const saldo =   document.getElementById("saldo");
let saldoInicial = 0;

function salvar(transacoes) {
  localStorage.setItem('transacoes', JSON.stringify(transacoes))
}

function carregar() {
  const dados = localStorage.getItem('transacoes');
  return dados ? JSON.parse(dados) : [];
}

function renderizar(transacao) {
 // Validação dos campos
  if (!transacao.nome || !transacao.valor || !transacao.data) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Formata a data
  const dataObj = new Date(transacao.data);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR');

  // Botão para remover
  let remover = document.createElement("button");
  remover.id = "remover";
  remover.textContent = "X";
  remover.addEventListener("click", function () {
    if (confirm("Deseja realmente remover este lançamento?")) {
      // Ajusta o saldo ao remover
      if (transacao.tipo === "Entrada") {
        saldoInicial -= Number(transacao.valor);
      } else {
        saldoInicial += Number(transacao.valor);
      }
 saldo.textContent = `R$ ${saldoInicial.toFixed(2)}`;
  if (Number(saldoInicial) < 0) {
  saldo.classList.add("negativo");
  saldo.classList.remove("positivo");
}else if(Number(saldoInicial) === 0){
  saldo.classList.remove("positivo");
  saldo.classList.remove("negativo");
}
  else{
  saldo.classList.add("positivo");
  saldo.classList.remove("negativo");
}
       linha.remove();
       listaTransacoes = listaTransacoes.filter(t => !(t.nome === transacao.nome && t.valor === transacao.valor && t.data === transacao.data && t.tipo === transacao.tipo));
salvar(listaTransacoes);
    }
  });

    // Cria nova linha na tabela
  let linha = document.createElement("tr");
  linha.setAttribute("data-tipo", transacao.tipo.toLowerCase());
  linha.setAttribute("data-data", transacao.data); // Armazena a data no formato YYYY-MM-DD

  // Cria células da tabela
  const celula = document.createElement("td")

  // Preenche as células
  celula.textContent = `${transacao.nome} R$${Number(transacao.valor).toFixed(2)} ${transacao.tipo} ${dataFormatada} `;
  celula.appendChild(remover);
  linha.appendChild(celula);

  // Atualiza saldo
  if (transacao.tipo === "Entrada") {
    saldoInicial += Number(transacao.valor);
  } else {
    saldoInicial -= Number(transacao.valor);
  }
 saldo.textContent = `R$ ${saldoInicial.toFixed(2)}`;
  if (Number(saldoInicial) < 0) {
  saldo.classList.add("negativo");
  saldo.classList.remove("positivo");
}  else{
  saldo.classList.add("positivo");
  saldo.classList.remove("negativo");
}

  // Adiciona classe para estilo
  linha.classList.add(transacao.tipo === "Entrada" ? "entrada" : "saida");

  // Adiciona linha à tabela
  tbody.appendChild(linha);



  
}

let listaTransacoes = carregar();
listaTransacoes.forEach(transacao => {
  renderizar(transacao)
})
let btnTema = document.getElementById("switcher");
let body = document.querySelector("body");
const filtro = document.getElementById("filtroLancamento");

// Trocador de tema
btnTema.addEventListener("click", function () {
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    btnTema.classList.remove("fa-sun");
    body.classList.add("light-theme");
    btnTema.classList.add("fa-moon");
  }
  else {
    body.classList.remove("light-theme");
    btnTema.classList.remove("fa-moon");
    body.classList.add("dark-theme");
    btnTema.classList.add("fa-sun");
  }
});

let botao = document.getElementById('button');

// Adicionar novo lançamento
botao.addEventListener("click", () => {
  const transacao = {
    nome: document.getElementById("nomeLancamento").value,
    valor: document.getElementById("valorLancamento").value,
    tipo: document.getElementById("tipoLancamento").value,
    data: document.getElementById("dataLancamento").value,

  }


  listaTransacoes.push(transacao)
  salvar(listaTransacoes)
renderizar(transacao);
document.getElementById("formLancamento").reset();
aplicarFiltros();

});

// Função de filtro integrado
function aplicarFiltros() {
  const filtroSelecionado = filtro.value;
  const linhas = tbody.querySelectorAll("tr");
  const hoje = new Date();

  // Prepara datas para comparação
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());

  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  linhas.forEach(linha => {
    const tipoTransacao = linha.getAttribute("data-tipo");
    const dataTransacao = new Date(linha.getAttribute("data-data"));

    let mostraLinha = false;

    switch (filtroSelecionado) {
      case 'todos':
        mostraLinha = true;
        break;
      case 'entrada':
        mostraLinha = tipoTransacao === 'entrada';
        break;
      case 'saida':
        mostraLinha = tipoTransacao === 'saida'; // Note que está 'saída' com acento
        break;
      case 'hoje':
        mostraLinha = dataTransacao.toDateString() === hoje.toDateString();
        break;
      case 'ontem':
        mostraLinha = dataTransacao.toDateString() === ontem.toDateString();
        break;
      case 'semana':
        mostraLinha = dataTransacao >= inicioSemana && dataTransacao <= hoje;
        break;
      case 'mes':
        mostraLinha = dataTransacao >= inicioMes && dataTransacao <= fimMes;
        break;
    }

    linha.style.display = mostraLinha ? '' : 'none';
  });
}

// Event listener para o filtro
filtro.addEventListener('change', aplicarFiltros);

// Aplica filtros inicialmente
aplicarFiltros();

 