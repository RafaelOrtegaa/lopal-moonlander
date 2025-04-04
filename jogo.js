//Moonlander. Um jogo de alunissagem.
//Rafael Ortega (https://github.com/RafaelOrtegaa)
//28/03/2025
//Versão 0.1.0


/** @type {HTMLCanvasElement} */

// Seleção de modelagem de dados 

let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");

let lancamentoPelaEsquerda = (Math.round(Math.random()) == 0);

let moduloLunar = {
    posicao: {
        x: lancamentoPelaEsquerda ? 100 : 700,
        y: 100
    },
    angulo: lancamentoPelaEsquerda ? -Math.PI / 2 : Math.PI / 2,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: lancamentoPelaEsquerda ? 2 : -2,
        y: 0
    },
    combustivel: 1000,
    rotacaoAntiHorario: false,
    rotacaoHorario: false
}

let estrelas = [];

for (let i = 0; i < 500; i++) {
    estrelas[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(2 * Math.random()),
        brilho: 1.0,
        apagando: true,
        cintilacao: 0.05 * Math.random()
    }
}

function desenharModuloLunar() {
    contexto.save();
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5, moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if (moduloLunar.motorLigado) {
        desenharChama();
    }


    contexto.restore();
}

function desenharChama() {
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 15);
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}

function mostrarVelocidadeVertical() {
    mostrarIndicador(
        mensagem = `Velocidade Vertical: ${(10 * moduloLunar.velocidade.y).toFixed(1)}`,
        x = 100,
        y = 60
    )
}

function mostrarCombustivel() {
    mostrarIndicador(
        mensagem = `Combustível: ${(moduloLunar.combustivel / 1000 * 100).toFixed(0)}%`,
        x = 550,
        y = 60
    )
}

function desenharEstrelas() {
    for (let i = 0; i < estrelas.length; i++) {
        let estrela = estrelas[i];
        contexto.beginPath();
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2 * Math.PI);
        contexto.closePath();
        contexto.fillStyle = `rgba(255, 255, 255,  ${estrela.brilho})`;
        contexto.fill();
        if (estrela.apagando) {
            estrela.brilho -= estrela.cintilacao;
            if (estrela.brilho <= 0.1) {
                estrela.apagando = false;
            }
        } else {
            estrela.brilho += estrela.cintilacao;
            if (estrela.brilho >= 0.95) {
                estrela.apagando = true;
            }
        }
    }
    contexto.restore();
}

function mostrarVelocidadeHorizontal() {
    mostrarIndicador(
        mensagem = `Velocidade Horizontal: ${(10 * moduloLunar.velocidade.x).toFixed(1)}`,
        x = 100,
        y = 80
    )
}

function mostrarAngulo() {
    mostrarIndicador(
        mensagem = `Ângulo: ${(moduloLunar.angulo * 180 / Math.PI).toFixed(0)}°`,
        x = 550,
        y = 80

    );
}

function mostrarAltitude() {

    mostrarIndicador(
        mensagem = `Altitude: ${(canvas.height - moduloLunar.posicao.y).toFixed(0)}`,
        x = 950,
        y = 60
    )
}

function desenhar() {
    //limpar a tela
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    // Essa função atualiza o modulo lunar em função da gravidade 
    mostrarVelocidadeVertical();
    mostrarVelocidadeHorizontal();
    mostrarAltitude();
    mostrarAngulo();
    mostrarCombustivel();
    atracaoGravitacional();
    desenharEstrelas();
    desenharModuloLunar();

    if (moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)) {

        if (moduloLunar.velocidade.y >= 0.5 ||
            Math.abs(moduloLunar.velocidade.x) >= 0.5 ||
            5 < Math.abs(moduloLunar.angulo)
        ) {
            contexto.font = "bold 60px Calibri";
            contexto.textAlign = "center";
            contexto.textBaseline = "middle";
            contexto.fillStyle = "red";
            return contexto.fillText("Você morreu de queda!", canvas.width / 2, canvas.height / 2);
        } else {
            contexto.font = "bold 60px Calibri";
            contexto.textAlign = "center";
            contexto.textBaseLine = "middle";
            contexto.fillStyle = "green";
            return contexto.fillText("Você pousou com sucesso!", canvas.width / 2, canvas.height / 2);
        }
    }

    //Esta função repete a execução da função desenhar a cada atualização de tela
    requestAnimationFrame(desenhar);
}

function mostrarIndicador(mensagem, x, y) {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    contexto.fillText(mensagem, x, y);
}

// Pressionando a seta para cima para ligar o motor 
document.addEventListener("keydown", teclaPressionada)

function teclaPressionada(evento) {

    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = true;

    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoHorario = true;

    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoAntiHorario = true;

    }
}

document.addEventListener("keyup", teclaSolta);

function teclaSolta(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = false;
    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoHorario = false;

    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoAntiHorario = false;

    }
}

let gravidade = 0.01;
function atracaoGravitacional() {
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;

    if (moduloLunar.rotacaoAntiHorario) {
        moduloLunar.angulo += Math.PI / 180;
    } else if (moduloLunar.rotacaoHorario) {
        moduloLunar.angulo -= Math.PI / 180
    }

    if (moduloLunar.motorLigado) {
        moduloLunar.velocidade.y -= 0.0115 * Math.cos(moduloLunar.angulo);
        moduloLunar.velocidade.x += 0.0115 * Math.sin(moduloLunar.angulo);
    }

    if (moduloLunar.motorLigado) {
        moduloLunar.velocidade.y -= 0.0115
        if (moduloLunar.combustivel > 0) {
            moduloLunar.motorLigado = true;
            moduloLunar.combustivel--;
        } else {
            moduloLunar.motorLigado = false;
        }
    }

    moduloLunar.velocidade.y += gravidade;


}

desenhar();