const quizQuestions = [
            {
                question: "Qual dispositivo opera na Camada 2 (Enlace) do modelo OSI e usa endereços MAC para encaminhar dados?",
                options: ["Roteador", "Switch", "Hub", "Modem"],
                correct: 1,
                explanation: "O switch opera na Camada 2 e usa a tabela de endereços MAC para encaminhar frames apenas para a porta de destino correta."
            },
            {
                question: "Qual é a faixa de endereços IP privados da Classe C?",
                options: ["10.0.0.0 - 10.255.255.255", "172.16.0.0 - 172.31.255.255", "192.168.0.0 - 192.168.255.255", "224.0.0.0 - 239.255.255.255"],
                correct: 2,
                explanation: "A faixa 192.168.0.0 - 192.168.255.255 é reservada para uso privado em redes Classe C."
            },
            {
                question: "Qual comando do Cisco IOS é usado para entrar no modo de configuração global?",
                options: ["enable", "configure terminal", "interface", "show running-config"],
                correct: 1,
                explanation: "O comando 'configure terminal' ou 'conf t' leva ao modo de configuração global."
            },
            {
                question: "Qual protocolo garante entrega confiável de dados com confirmações e retransmissões?",
                options: ["UDP", "ICMP", "TCP", "ARP"],
                correct: 2,
                explanation: "O TCP garante entrega confiável, ordem correta dos dados e retransmissão em caso de perda."
            },
            {
                question: "Qual é o limite de distância do cabeamento horizontal em um sistema de cabeamento estruturado?",
                options: ["50 metros", "90 metros", "100 metros", "150 metros"],
                correct: 1,
                explanation: "O cabeamento horizontal permanente não pode exceder 90 metros."
            },
            {
                question: "No padrão T568B, qual é a cor do fio no pino 1?",
                options: ["Verde", "Branco-Verde", "Laranja", "Branco-Laranja"],
                correct: 3,
                explanation: "No padrão T568B, o pino 1 é Branco-Laranja."
            },
            {
                question: "Qual tipo de fibra óptica é ideal para longas distâncias?",
                options: ["Multimodo", "Monomodo", "Plástica", "Coaxial"],
                correct: 1,
                explanation: "A fibra monomodo é indicada para longas distâncias por ter menor dispersão do sinal."
            },
            {
                question: "O que o comando 'ipconfig /flushdns' faz?",
                options: ["Libera o IP atual", "Renova o endereço IP", "Limpa o cache DNS", "Mostra configurações de rede"],
                correct: 2,
                explanation: "Esse comando limpa o cache DNS local do sistema."
            },
            {
                question: "Em qual camada do modelo OSI opera o protocolo IP?",
                options: ["Camada 2 - Enlace", "Camada 3 - Rede", "Camada 4 - Transporte", "Camada 7 - Aplicação"],
                correct: 1,
                explanation: "O protocolo IP opera na Camada 3, responsável por endereçamento lógico e roteamento."
            },
            {
                question: "Qual frequência Wi-Fi oferece maior alcance, porém menor velocidade em geral?",
                options: ["5 GHz", "6 GHz", "2.4 GHz", "60 GHz"],
                correct: 2,
                explanation: "A faixa de 2.4 GHz alcança distâncias maiores, mas costuma sofrer mais interferência e ter menor velocidade."
            },
            {
                question: "O que significa SSID em redes Wi-Fi?",
                options: ["Secure System ID", "Service Set Identifier", "Signal Strength ID", "Station System ID"],
                correct: 1,
                explanation: "SSID é o nome da rede sem fio exibido para os usuários."
            },
            {
                question: "Qual protocolo de segurança Wi-Fi é considerado obsoleto e inseguro?",
                options: ["WPA3", "WPA2-AES", "WEP", "WPA2-Enterprise"],
                correct: 2,
                explanation: "WEP é obsoleto e inseguro, não deve ser usado."
            },
            {
                question: "Qual comando mostra a tabela de roteamento em um roteador Cisco?",
                options: ["show interfaces", "show ip route", "show running-config", "show mac address-table"],
                correct: 1,
                explanation: "O comando 'show ip route' exibe a tabela de roteamento."
            },
            {
                question: "Quantas camadas tem o modelo OSI?",
                options: ["4 camadas", "5 camadas", "6 camadas", "7 camadas"],
                correct: 3,
                explanation: "O modelo OSI possui 7 camadas."
            },
            {
                question: "Qual é a função do Gateway Padrão?",
                options: ["Traduzir nomes para IPs", "Atribuir endereços IP automaticamente", "Ser a porta de saída para outras redes", "Armazenar arquivos na rede"],
                correct: 2,
                explanation: "O gateway padrão é a saída da rede local para outras redes, como a internet."
            }
        ];

        let currentQuestion = 0;
        let score = 0;
        let answered = false;
        let shuffledQuestions = [];

        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }

        function initQuiz() {
            shuffledQuestions = shuffleArray(quizQuestions);
            currentQuestion = 0;
            score = 0;
            answered = false;
            renderQuestion();
        }

        function renderQuestion() {
            const container = document.getElementById('quizContainer');
            const question = shuffledQuestions[currentQuestion];
            const progress = (currentQuestion / shuffledQuestions.length) * 100;

            container.innerHTML = `
                <div class="quiz-progress">
                    <span><strong>Questão ${currentQuestion + 1}</strong> de ${shuffledQuestions.length}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span><strong>${score}</strong> pts</span>
                </div>

                <div class="quiz-question">${question.question}</div>

                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <div class="quiz-option" data-index="${index}" onclick="selectOption(${index})">
                            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                            <span>${option}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="quiz-actions">
                    <button class="btn btn-primary" onclick="checkAnswer()" id="checkBtn" disabled>
                        <i class="fas fa-check"></i> Verificar Resposta
                    </button>
                </div>
            `;

            answered = false;
        }

        function selectOption(index) {
            if (answered) return;

            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            document.querySelector(`[data-index="${index}"]`).classList.add('selected');
            document.getElementById('checkBtn').disabled = false;
        }

        function checkAnswer() {
            if (answered) return;
            answered = true;

            const selected = document.querySelector('.quiz-option.selected');
            if (!selected) return;

            const selectedIndex = parseInt(selected.dataset.index, 10);
            const question = shuffledQuestions[currentQuestion];
            const correct = question.correct;

            document.querySelectorAll('.quiz-option').forEach((opt, index) => {
                if (index === correct) {
                    opt.classList.add('correct');
                } else if (index === selectedIndex && selectedIndex !== correct) {
                    opt.classList.add('incorrect');
                }
            });

            if (selectedIndex === correct) {
                score += 10;
            }

            const actionsDiv = document.querySelector('.quiz-actions');
            actionsDiv.innerHTML = `
                <div class="info-box ${selectedIndex === correct ? 'tip' : 'warning'}" style="flex: 1; margin: 0;">
                    <div class="info-box-title">
                        <i class="fas fa-${selectedIndex === correct ? 'check-circle' : 'times-circle'}"></i>
                        ${selectedIndex === correct ? 'Correto!' : 'Incorreto!'}
                    </div>
                    <p>${question.explanation}</p>
                </div>
                <button class="btn btn-primary" onclick="nextQuestion()">
                    ${currentQuestion < shuffledQuestions.length - 1
                        ? 'Próxima <i class="fas fa-arrow-right"></i>'
                        : 'Ver Resultado <i class="fas fa-trophy"></i>'}
                </button>
            `;
        }

        function nextQuestion() {
            currentQuestion++;
            if (currentQuestion < shuffledQuestions.length) {
                renderQuestion();
            } else {
                showResult();
            }
        }

        function showResult() {
            const container = document.getElementById('quizContainer');
            const percentage = (score / (shuffledQuestions.length * 10)) * 100;

            let message = '';
            let icon = '';

            if (percentage >= 80) {
                message = 'Excelente! Você domina muito bem os conceitos de redes.';
                icon = 'trophy';
            } else if (percentage >= 60) {
                message = 'Bom trabalho! Você já tem uma base bem sólida.';
                icon = 'thumbs-up';
            } else if (percentage >= 40) {
                message = 'Você está no caminho certo. Vale revisar alguns pontos.';
                icon = 'book';
            } else {
                message = 'Revise o conteúdo e tente novamente.';
                icon = 'redo';
            }

            container.innerHTML = `
                <div class="quiz-result">
                    <div class="result-icon">
                        <i class="fas fa-${icon}"></i>
                    </div>
                    <div class="quiz-score">${score}/${shuffledQuestions.length * 10}</div>
                    <div class="quiz-message">${message}</div>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">
                        Você acertou <strong>${score / 10}</strong> de <strong>${shuffledQuestions.length}</strong> questões
                        (${percentage.toFixed(0)}%)
                    </p>
                    <div class="quiz-actions" style="justify-content: center;">
                        <button class="btn btn-primary" onclick="initQuiz()">
                            <i class="fas fa-redo"></i> Tentar Novamente
                        </button>
                    </div>
                </div>
            `;
        }
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});
        document.addEventListener('DOMContentLoaded', initQuiz);
    
