document.addEventListener("DOMContentLoaded", () => {
  // 1. Definições de Constantes e Variáveis
  const painelBingo = document.getElementById("painel-bingo");
  const ultimoNumeroDisplay = document.getElementById("ultimo-numero-display");
  const bolinhasRestantesDisplay = document.getElementById(
    "bolinhas-restantes-display"
  );
  const listaFaltantesUl = document.getElementById("lista-faltantes");
  const listaSorteadosUl = document.getElementById("lista-sorteados");
  const btnReset = document.getElementById("btn-reset");
  const btnSortear = document.getElementById("btn-sortear");

  let numerosSorteados = [];

  const MAX_NUMERO = 75;
  const LETRAS_BINGO = ["B", "I", "N", "G", "O"];

  const LETRA_CORES = {
    B: "#007bff", // Azul
    I: "#dc3545", // Vermelho
    N: "#ffc107", // Amarelo
    G: "#28a745", // Verde
    O: "#6f42c1", // Roxo
    DEFAULT: "#333",
  };

  // -------------------------------------
  // Lógica do Painel
  // -------------------------------------

  function getLetra(valor) {
    const indice = Math.floor((valor - 1) / 15);
    return LETRAS_BINGO[indice] || "";
  }

  // Função principal que constrói o painel em grade
  function inicializarPainel() {
    painelBingo.innerHTML = "";

    LETRAS_BINGO.forEach((letra, index) => {
      // Cria o elemento da letra
      const letraDiv = document.createElement("div");
      letraDiv.classList.add("bingo-grid__letter");
      letraDiv.textContent = letra;
      painelBingo.appendChild(letraDiv);

      // Cria a linha de números
      const numerosRow = document.createElement("div");
      numerosRow.classList.add("bingo-grid__numbers-row");

      const inicio = index * 15 + 1;
      const fim = (index + 1) * 15;

      for (let i = inicio; i <= fim; i++) {
        const divNumero = document.createElement("div");
        divNumero.classList.add("number-chip");
        divNumero.textContent = i;
        divNumero.dataset.valor = i;
        divNumero.dataset.letra = letra;

        // Estilo da borda com a cor da letra
        divNumero.style.borderColor = LETRA_CORES[letra];

        // Bind do evento de clique para marcar/desmarcar
        divNumero.addEventListener("click", () => {
          toggleNumero(divNumero, parseInt(i), letra);
        });

        numerosRow.appendChild(divNumero);
      }
      painelBingo.appendChild(numerosRow);
    });

    // Aplica o estilo de sorteado se o número estiver no array (útil no reset)
    numerosSorteados.forEach((num) => {
      const elemento = document.querySelector(`[data-valor="${num}"]`);
      if (elemento) {
        const letra = getLetra(num);
        applySortedStyle(elemento, letra);
      }
    });
  }

  // Aplica o estilo de chip sorteado (com a cor da letra)
  function applySortedStyle(elemento, letra) {
    elemento.classList.add("sorted");
    elemento.style.backgroundColor = LETRA_CORES[letra];
    elemento.style.color = "var(--color-white)";
  }

  // Remove o estilo de chip sorteado
  function removeSortedStyle(elemento) {
    elemento.classList.remove("sorted");
    elemento.style.backgroundColor = "var(--color-white)";
    elemento.style.color = "var(--color-dark)";
  }

  // Alterna entre marcado/desmarcado (Função manual ao clicar)
  function toggleNumero(elemento, valor, letra) {
    if (!elemento.classList.contains("sorted")) {
      marcarNumero(elemento, valor, letra);
    } else {
      desmarcarNumero(elemento, valor, letra);
    }
  }

  // Marca um número
  function marcarNumero(elemento, valor, letra) {
    if (elemento.classList.contains("sorted")) return;

    applySortedStyle(elemento, letra);

    numerosSorteados.push(valor);
    // numerosSorteados.sort((a, b) => a - b); // Removido para manter ordem cronológica

    atualizarTudo(letra, valor);

    // Aciona a animação de overlay
    if (typeof showOverlay === 'function') {
      showOverlay(valor, letra);
    }
  }

  // Desmarca um número
  function desmarcarNumero(elemento, valor, letra) {
    if (!elemento.classList.contains("sorted")) return;

    removeSortedStyle(elemento);

    numerosSorteados = numerosSorteados.filter((n) => n !== valor);

    // Recalcula o último se o número desmarcado era o último exibido.
    if (parseInt(ultimoNumeroDisplay.textContent.split("-").pop()) === valor) {
      if (numerosSorteados.length > 0) {
        const ultimoSorteado = numerosSorteados[numerosSorteados.length - 1];
        const novaLetra = getLetra(ultimoSorteado);
        atualizarTudo(novaLetra, ultimoSorteado);
      } else {
        atualizarTudo(); // Limpa tudo
      }
    } else {
      atualizarTudo(null, null, false);
    }
  }

  // Função para sortear um número aleatório
  function sortearNumero() {
    if (numerosSorteados.length >= MAX_NUMERO) {
      alert("Todas as 75 bolinhas já foram sorteadas!");
      return;
    }

    const todosNumeros = Array.from({ length: MAX_NUMERO }, (_, i) => i + 1);
    const numerosDisponiveis = todosNumeros.filter(
      (num) => !numerosSorteados.includes(num)
    );

    const indiceAleatorio = Math.floor(
      Math.random() * numerosDisponiveis.length
    );
    const numeroSorteado = numerosDisponiveis[indiceAleatorio];

    const elemento = document.querySelector(`[data-valor="${numeroSorteado}"]`);
    const letra = getLetra(numeroSorteado);

    if (elemento) {
      marcarNumero(elemento, numeroSorteado, letra);
      // Efeito visual (piscando/destaque) no chip sorteado
      elemento.classList.add("last-sorted");
      setTimeout(() => {
        elemento.classList.remove("last-sorted");
      }, 1000);
    }
  }

  // Função unificada de atualização (Chama todas as atualizações de tela)
  function atualizarTudo(letra = null, valor = null, updateLast = true) {
    // Atualiza Últimos Números (Visualização de 3 bolas)
    if (updateLast) {
      const len = numerosSorteados.length;
      const ballCurrent = document.getElementById("ball-current");
      const ballPrev1 = document.getElementById("ball-prev-1");
      const ballPrev2 = document.getElementById("ball-prev-2");

      if (len > 0) {
        // Bola Atual (Última)
        const currentVal = numerosSorteados[len - 1];
        renderBall(ballCurrent, currentVal);
      } else {
        resetBall(ballCurrent, "--");
      }

      if (len > 1) {
        // Penúltima
        const prev1Val = numerosSorteados[len - 2];
        renderBall(ballPrev1, prev1Val);
      } else {
        resetBall(ballPrev1, "");
      }

      if (len > 2) {
        // Antepenúltima
        const prev2Val = numerosSorteados[len - 3];
        renderBall(ballPrev2, prev2Val);
      } else {
        resetBall(ballPrev2, "");
      }

      const ballPrev3 = document.getElementById("ball-prev-3");
      if (len > 3) {
        const prev3Val = numerosSorteados[len - 4];
        renderBall(ballPrev3, prev3Val);
      } else {
        resetBall(ballPrev3, "");
      }

      const ballPrev4 = document.getElementById("ball-prev-4");
      if (len > 4) {
        const prev4Val = numerosSorteados[len - 5];
        renderBall(ballPrev4, prev4Val);
      } else {
        resetBall(ballPrev4, "");
      }
    }

    // atualizarListaSorteados(); // Removido
    // atualizarListaFaltantes(); // Não precisamos mais da lista detalhada
    atualizarBolinhasRestantes();
  }

  function renderBall(element, value) {
    element.textContent = value;
    const letra = getLetra(value);
    element.style.backgroundColor = LETRA_CORES[letra];
    element.style.borderColor = "rgba(0,0,0,0.1)"; // Reset border style
  }

  function resetBall(element, text) {
    element.textContent = text;
    element.style.backgroundColor = "#ccc";
  }

  // Função que lista os números JÁ SORTEADOS (Em formato de bolinhas coloridas)
  // Função removida (Lista removida do HTML)
  function atualizarListaSorteados() {
    // funcao vazia
  }

  // Função Simbolica (Lista removida do HTML)
  function atualizarListaFaltantes() {
    // Função mantida vazia para compatibilidade se chamada
  }

  // Função que mostra a QUANTIDADE de bolinhas restantes
  function atualizarBolinhasRestantes() {
    bolinhasRestantesDisplay.textContent = MAX_NUMERO - numerosSorteados.length;
  }

  function resetPainel() {
    if (
      confirm(
        "Tem certeza que deseja RESETAR o painel de bingo? Todos os números serão desmarcados."
      )
    ) {
      numerosSorteados = [];

      inicializarPainel();

      inicializarPainel();

      // Limpa os displays de bola
      resetBall(document.getElementById("ball-current"), "--");
      resetBall(document.getElementById("ball-prev-1"), "");
      resetBall(document.getElementById("ball-prev-2"), "");
      resetBall(document.getElementById("ball-prev-3"), "");
      resetBall(document.getElementById("ball-prev-4"), "");

      // atualizarListaSorteados();
      // atualizarListaFaltantes();
      atualizarBolinhasRestantes();
    }
  }

  // 4. Event Listeners
  btnReset.addEventListener("click", resetPainel);
  btnSortear.addEventListener("click", sortearNumero);

  // Inicialização
  inicializarPainel();
  atualizarBolinhasRestantes();
  atualizarListaFaltantes();
  // atualizarListaSorteados();

  // -------------------------------------
  // Lógica de Troca de Tema
  // -------------------------------------
  const themeBtns = document.querySelectorAll('.theme-btn');

  function setTheme(theme) {
    // Remove todas as classes de tema
    document.body.classList.remove('dark-mode', 'black-mode');

    // Remove estado ativo dos botões
    themeBtns.forEach(btn => btn.style.transform = 'scale(1)');

    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else if (theme === 'black') {
      document.body.classList.add('black-mode');
    }
    // light é o default (sem classe)

    // Salva no LocalStorage
    localStorage.setItem('bingo-theme', theme);
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
    });
  });

  // Carregar tema salvo
  const savedTheme = localStorage.getItem('bingo-theme');
  if (savedTheme) {
    setTheme(savedTheme);
  }

  // -------------------------------------
  // Overlay de Animação
  // -------------------------------------
  const overlay = document.getElementById("number-overlay");
  const overlayText = document.getElementById("overlay-text");
  const overlayContent = document.getElementById("overlay-content");
  let overlayTimeout;

  function showOverlay(valor, letra) {
    // Configura o valor e a cor
    overlayText.textContent = valor;

    // Pega a cor baseada na letra
    const cor = LETRA_CORES[letra];

    overlayContent.style.borderColor = cor;
    overlayContent.style.border = `10px solid ${cor}`;
    overlayText.style.color = cor;

    // Mostra o overlay
    overlay.classList.remove("overlay-hidden");

    // Reinicia a animação removendo e recolocando o elemento ou a classe
    // (O layout reflow vai acontecer na transição de display/opacity, mas para garantir o keyframe:)
    overlayContent.style.animation = 'none';
    overlayContent.offsetHeight; /* trigger reflow */
    overlayContent.style.animation = 'zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    // Limpa timeout anterior se houver
    if (overlayTimeout) clearTimeout(overlayTimeout);

    // Esconde após 5 segundos
    overlayTimeout = setTimeout(() => {
      hideOverlay();
    }, 5000); // 5 segundos
  }

  function hideOverlay() {
    overlay.classList.add("overlay-hidden");
  }

  // Integrar no marcarNumero
  const originalMarcarNumero = marcarNumero;
  // Reescrevendo marcarNumero ou injetando... 
  // Na verdade, vou modificar a marcarNumero existente acima, mas como estou editando o final do arquivo, 
  // vou redefinir a função marcarNumero original é melhor NÃO, pois ela é chamada internamente.
  // Vou criar um hook na função marcarNumero original não dá fácil sem editar o meio do arquivo.

  // Melhor abordagem: Editar a função marcarNumero original no meio do arquivo.
  // Como esta tool call é para o final, vou cancelar essa edição e fazer um multi_replace ou replace separado para a função marcarNumero.

  // Mas espera, eu tenho que editar o marcarNumero. Vou fazer isso em uma tool call separada.
  // Porem, eu posso adicionar o listener de click no overlay para fechar antes.
  overlay.addEventListener('click', hideOverlay);

  // -------------------------------------
  // Toggle Controles (Sortear/Resetar)
  // -------------------------------------
  const btnToggleControls = document.getElementById('btn-toggle-controls');
  const controlsExpanded = document.getElementById('controls-expanded');

  if (btnToggleControls && controlsExpanded) {
    btnToggleControls.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents click from bubbling if needed
      controlsExpanded.classList.toggle('hidden');
    });

    // Optional: Click outside to close
    document.addEventListener('click', (e) => {
      if (!controlsExpanded.contains(e.target) && !btnToggleControls.contains(e.target)) {
        controlsExpanded.classList.add('hidden');
      }
    });
  }
});

