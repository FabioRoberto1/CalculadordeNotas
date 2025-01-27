
// Verificando o carregandomento. 
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada!');


//criando formulario.
    const container = document.getElementById('container');
    const resultados = [];

    container.innerHTML = `
        <label for="nome">Nome do Aluno:</label>
        <input type="text" id="nome" placeholder="Digite o nome"><br><br>

        <label for="numerodeNotas">Número de Notas:</label>
        <input type="number" id="numerodeNotas" placeholder="Digite o número de notas"><br><br>

        <button id="gerarNotas">Gerar Campos para Notas</button>
        <div id="notasContainer"></div>
        <button id="calcularMedia" style="display: none;">Calcular Média</button>

        <button id="exportarExcel" style="display: none;">Exportar para Excel</button>

        <table id="resultados" style="display: none;">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Notas</th>
                    <th>Média</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;

//botões.
    const btnGerarNotas = document.getElementById('gerarNotas');
    const notasContainer = document.getElementById('notasContainer');
    const btnCalcularMedia = document.getElementById('calcularMedia');
    const btnExportarExcel = document.getElementById('exportarExcel');

    btnGerarNotas.addEventListener('click', () => {
        const numNotas = parseInt(document.getElementById('numerodeNotas').value);
        if (!numNotas || numNotas <= 0) {
            alert('Digite um número válido de notas!');
            return;
        }

        notasContainer.innerHTML = '';
        for (let i = 0; i < numNotas; i++) {
            const label = document.createElement('label');
            label.textContent = `Nota ${i + 1}: `;
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'nota';
            input.placeholder = 'Digite a nota';
            notasContainer.appendChild(label);
            notasContainer.appendChild(input);
            notasContainer.appendChild(document.createElement('br'));
        }

        btnCalcularMedia.style.display = 'inline-block';
    });

//Calcular notas.
    btnCalcularMedia.addEventListener('click', () => {
        const nome = document.getElementById('nome').value;
        const notasInputs = document.querySelectorAll('.nota');
        const notas = [];

        notasInputs.forEach(input => {
            const nota = parseFloat(input.value);
            if (!isNaN(nota)) {
                notas.push(nota);
            }
        });

        if (notas.length === 0) {
            alert('Insira pelo menos uma nota válida!');
            return;
        }

        const soma = notas.reduce((acc, val) => acc + val, 0);
        const media = soma / notas.length;

//Armazenar os dados no array de resultados.
        resultados.push({ nome: nome || 'Anônimo', notas: notas, media: media });

        // Exibir a tabela de resultados
        const resultadosTable = document.getElementById('resultados');
        const tbody = resultadosTable.querySelector('tbody');
        resultadosTable.style.display = 'table';
        tbody.innerHTML = resultados.map(item => `
            <tr>
                <td>${item.nome}</td>
                <td>${item.notas.join(', ')}</td>
                <td>${item.media.toFixed(2)}</td>
            </tr>
        `).join('');

        btnExportarExcel.style.display = 'inline-block';
    });

    btnExportarExcel.addEventListener('click', () => {
//Usando SheetJS para exportar para Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(resultados.map(item => ({
            Nome: item.nome,
            Notas: item.notas.join(', '),
            Média: item.media.toFixed(2)
        })));
        XLSX.utils.book_append_sheet(wb, ws, "Resultados");

//Gerar o arquivo Excel.
        XLSX.writeFile(wb, "resultados.xlsx");
    });
});
