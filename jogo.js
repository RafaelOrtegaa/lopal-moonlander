//Moonlander. Um jogo de alunissagem.
//Rafael Ortega (https://github.com/RafaelOrtegaa)
//28/03/2025
//Versão 0.1.0




/** @type {HTMLCanvasElement} */


// Seleção de modelagem de dados 

let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");

let x;
let velocidadeX;
let angulo

if (Math.round(Math.random()) == 0) {
    x = 100;
    velocidadeX = 2;
    angulo = -Math.PI / 2
} else {
    x = 700;
    velocidadeX = -2;
    angulo = Math.PI / 2;
}

let moduloLunar = {
    posicao: {
        x: x,
        y: 100
    },
    angulo: angulo,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: velocidadeX,
        y: 0
    },
    combustivel: 1000,
    rotacaoAntiHorario: false,
    rotacaoHorario: false
}

let estrelas = [];
for( let i = 0; i < 500; i++){
    estrelas[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(Math.random() * 2 ),
        transparencia: 1.0,
        diminuicao: true,
        razaoDeCintilacao: Math.random() * 0.05
    };
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
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    let velocidade = `Velocidade Vertical: ${(10 * moduloLunar.velocidade.y).toFixed(1)}`;
    contexto.fillText(velocidade, 100, 60);
}

function mostrarCombustivel() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    let combustivel = `Combustível: ${(moduloLunar.combustivel / 1000 * 100).toFixed(0)}`;
    contexto.fillText(combustivel + "%", 550, 60);
}

function desenharEstrelas(){
    for ( let i = 0; i < estrelas.length; i++){
        let estrela = estrelas[i];
        contexto.beginPath();
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2 * Math.PI);
        contexto.closePath();
        contexto.fillStyle = "rgba(255, 255, 255 " + estrela.transparencia + ")";
        contexto.fill();
        contexto.restore();
    }
}

function mostrarVelocidadeHorizontal() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    let velocidade = `Velocidade Horizontal: ${(10 * moduloLunar.velocidade.x).toFixed(1)}`;
    contexto.fillText(velocidade, 100, 80);
}

function mostrarAngulo() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    let anguloMostrar = `Ângulo: ${(moduloLunar.angulo * 180 / Math.PI).toFixed(0)}`;
    contexto.fillText(anguloMostrar + "º", 550, 80);
}


function mostrarAltitude() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    let altura = `Altitude: ${(canvas.height - moduloLunar.posicao.y).toFixed(0)}`;
    contexto.fillText(altura + "m", 950, 60);
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
    desenharModuloLunar();
    desenharEstrelas();

    if (moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)) {

        if (moduloLunar.velocidade.y >= 0.5 ||
            moduloLunar.velocidade.x >= 0.5 ||
            (5 < moduloLunar.angulo ||
                moduloLunar.angulo < -5
            )
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



