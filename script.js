let btnTema = document.getElementById("switcher");
let body = document.querySelector("body");
const filtro = document.getElementById("filtroLancamento");
const tbody = document.getElementById('historicoLancamentos');

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

let saldoInicial = 0;
let botao = document.getElementById('button');

// Adicionar novo lançamento
botao.addEventListener("click", function () {
  let nome = document.getElementById("nomeLancamento").value;
  let valor = document.getElementById("valorLancamento").value;
  let tipo = document.getElementById("tipoLancamento").value;
  let data = document.getElementById("dataLancamento").value;
  let textoSaldo = document.getElementById("saldo");

  // Validação dos campos
  if (!nome || !valor || !data) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Atualiza saldo
  if (tipo === "Entrada") {
    saldoInicial += Number(valor);
  } else {
    saldoInicial -= Number(valor);
  }
  textoSaldo.textContent = `R$ ${saldoInicial.toFixed(2)}`;

  // Formata a data
  const dataObj = new Date(data);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR');

  // Cria nova linha na tabela
  let linha = document.createElement("tr");
  linha.setAttribute("data-tipo", tipo.toLowerCase());
  linha.setAttribute("data-data", data); // Armazena a data no formato YYYY-MM-DD

  // Cria células da tabela
  const celula =  document.createElement("td")
 

  // Botão para remover
  let remover = document.createElement("button");
  remover.id = "remover";
  remover.textContent = "X";
  remover.addEventListener("click", function () {
    if (confirm("Deseja realmente remover este lançamento?")) {
      // Ajusta o saldo ao remover
      if (tipo === "Entrada") {
        saldoInicial -= Number(valor);
      } else {
        saldoInicial += Number(valor);
      }
      textoSaldo.textContent = `R$ ${saldoInicial.toFixed(2)}`;
      linha.remove();
    }
  });

  // Preenche as células
  celula.textContent = `${nome} R$ ${Number(valor).toFixed(2)} ${tipo} ${dataFormatada} `;
  celula.appendChild(remover);
 linha.appendChild(celula);
 
  
  // Adiciona classe para estilo
  linha.classList.add(tipo === "Entrada" ? "entrada" : "saida");
  
  // Adiciona linha à tabela
  tbody.appendChild(linha);

  // Limpa o formulário
  document.getElementById("formLancamento").reset();

  // Aplica os filtros
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
    
    switch(filtroSelecionado) {
      case 'todos':
        mostraLinha = true;
        break;
      case 'entrada':
        mostraLinha = tipoTransacao === 'entrada';
        break;
      case 'saida':
        mostraLinha = tipoTransacao === 'saída'; // Note que está 'saída' com acento
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