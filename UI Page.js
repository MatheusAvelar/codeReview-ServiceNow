<?xml version="1.0" encoding="utf-8"?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:u="jelly:util">
    <g:ui_form>

        <!-- Header organizado -->
        <div class="form-header">
            <h2>Code Review - Update Set</h2>
            <button id="btnBuscar" type="button">Buscar</button>
        </div>

        <!-- Inputs para Update Sets e filtros -->
        <div style="margin-bottom:15px;">
            <label for="updateSets">Update Sets</label>
            <textarea id="updateSets" placeholder="Digite os nomes dos Update Sets separados por vírgula" style="width:100%; height:80px; padding:10px; border:1px solid #ccc; border-radius:6px; resize:none;"></textarea>
        </div>

        <div style="margin-bottom:15px;">
            <label for="typeFilter">Filtrar por Type</label>
            <input type="text" id="typeFilter" placeholder="Digite um Type para incluir" />
        </div>

        <div style="margin-bottom:15px;">
            <label for="notTypeFilter">Excluir Type</label>
            <input type="text" id="notTypeFilter" placeholder="Digite um Type para excluir" />
        </div>

        <div style="margin-bottom:15px;">
            <label for="applicationFilter">Filtrar por Application</label>
            <input type="text" id="applicationFilter" placeholder="Digite o nome da Application" />
        </div>

        <!-- Filtros de checkbox fora da tabela -->
        <div class="filter-group">
            <input type="checkbox" id="filterPassou" onchange="filtrarPassou()" />
            <label for="filterPassou">Mostrar apenas registros que passaram</label>

            <input type="checkbox" id="filterNaoPassou" onchange="filtrarNaoPassou()" />
            <label for="filterNaoPassou">Mostrar apenas registros que não passaram</label>
        </div>

        <!-- Resultado -->
        <div id="resultado" style="margin-top:20px;"></div>

        <!-- Botão salvar dentro do form -->
        <div style="margin-top:20px;">
            <button id="btnSalvar" type="button" style="background-color:#28a745;">Salvar Review</button>
        </div>

    </g:ui_form>

    <style>
        g\\:ui_form {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .form-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #009639;
            padding-bottom: 10px;
        }

        .form-header h2 {
            margin: 0;
            font-size: 24px;
            color: #009639;
        }

        label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
            color: #333;
        }

        input[type="text"],
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-family: Arial, sans-serif;
            margin-bottom: 15px;
            box-sizing: border-box;
        }

        button {
            background-color: #0078D4;
            color: white;
            padding: 10px 25px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #005a9e;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 10px 12px;
            text-align: left;
        }

        th {
            background-color: #009639;
            color: white;
            font-weight: bold;
            text-align: center;
        }

        tr:nth-child(even) {
            background-color: #F5F5F5;
        }

        a {
            color: #009639;
            text-decoration: none;
            font-weight: bold;
        }

        a:hover {
            text-decoration: underline;
        }

        input[type="checkbox"] {
            transform: scale(1.1);
            cursor: pointer;
        }

        input[id^="passou_"] {
            accent-color: #28a745;
        }

        input[id^="naoPassou_"] {
            accent-color: #dc3545;
        }

        .filter-group {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            gap: 20px;
        }

        .filter-group input[type="checkbox"] {
            transform: scale(1.2);
        }

        .filter-group input#filterPassou {
            accent-color: #009639;
        }

        .filter-group input#filterNaoPassou {
            accent-color: #dc3545;
        }

        .filter-group label {
            font-weight: bold;
            color: #333;
            margin: 0;
        }

        .passou {
            background-color: #DFF0D8 !important;
        }

        .nao-passou {
            background-color: #f8d7da !important;
        }
    </style>

    <script type="text/javascript">
        function buscarArtefatos() {
            var updates = document.getElementById('updateSets').value;
            var type = document.getElementById('typeFilter').value;
            var notType = document.getElementById('notTypeFilter').value;
            var application = document.getElementById('applicationFilter').value;

            var ga = new GlideAjax('GetUpdateSetArtifacts');
            ga.addParam('sysparm_name', 'getArtifacts');
            ga.addParam('sysparm_updates', updates);
            ga.addParam('sysparm_types', type);
            ga.addParam('sysparm_notTypes', notType);
            ga.addParam('sysparm_application', application);
            ga.getXMLAnswer(function(response) {
                var data = JSON.parse(response || '[]');
                var resultado = document.getElementById('resultado');
                resultado.innerHTML = '';

                if (data.length === 0) {
                    var p = document.createElement('p');
                    p.style.fontStyle = 'italic';
                    p.style.color = '#777';
                    p.textContent = 'Nenhum artefato encontrado.';
                    resultado.appendChild(p);
                    return;
                }

                var info = document.createElement('p');
                info.innerHTML = '<strong>Total de registros:</strong> ' + data.length;
                resultado.appendChild(info);

                var table = document.createElement('table');
                var thead = document.createElement('thead');
                var trHead = document.createElement('tr');
                ['Nome', 'Ação', 'Type', 'Update Set', 'Application', 'Passou', 'Não Passou', 'Comentário']
                .forEach(function(h) {
                    var th = document.createElement('th');
                    th.textContent = h;
                    trHead.appendChild(th);
                });
                thead.appendChild(trHead);
                table.appendChild(thead);

                var tbody = document.createElement('tbody');
                data.forEach(function(item, index) {
                    var tr = document.createElement('tr');
                    tr.id = 'row_' + index;
                    tr.dataset.link = item.link || '';

                    var tdNome = document.createElement('td');
                    var link = document.createElement('a');
                    link.href = item.link || '#';
                    link.target = '_blank';
                    link.textContent = item.name;
                    tdNome.appendChild(link);
                    tr.appendChild(tdNome);

                    ['action', 'type', 'updateSet', 'application'].forEach(function(key) {
                        var td = document.createElement('td');
                        td.textContent = item[key];
                        tr.appendChild(td);
                    });

                    var tdPassou = document.createElement('td');
                    tdPassou.style.textAlign = 'center';
                    var chk1 = document.createElement('input');
                    chk1.type = 'checkbox';
                    chk1.id = 'passou_' + index;
                    chk1.checked = !!item.passou;
                    chk1.onclick = function() {
                        marcarPassou(index);
                    };
                    tdPassou.appendChild(chk1);
                    tr.appendChild(tdPassou);

                    var tdNao = document.createElement('td');
                    tdNao.style.textAlign = 'center';
                    var chk2 = document.createElement('input');
                    chk2.type = 'checkbox';
                    chk2.id = 'naoPassou_' + index;
                    chk2.checked = !!item.naoPassou;
                    chk2.onclick = function() {
                        marcarNaoPassou(index);
                    };
                    tdNao.appendChild(chk2);
                    tr.appendChild(tdNao);

                    var tdComent = document.createElement('td');
                    var inputComent = document.createElement('input');
                    inputComent.type = 'text';
                    inputComent.id = 'comentario_' + index;
                    inputComent.placeholder = 'Comentário (opcional)';
                    inputComent.style.width = '100%';
                    inputComent.value = item.comentario || '';
                    tdComent.appendChild(inputComent);
                    tr.appendChild(tdComent);

                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);
                resultado.appendChild(table);

                // 🔹 APLICAR CORES AOS CHECKBOXES MARCADOS
                Array.from(tbody.rows).forEach(function(row, index) {
                    var passou = document.getElementById('passou_' + index);
                    var naoPassou = document.getElementById('naoPassou_' + index);

                    if (passou) {
                        if (passou.checked) {
                            row.classList.add('passou');
                            row.classList.remove('nao-passou');
                        } else {
                            row.classList.remove('passou');
                        }
                    }

                    if (naoPassou) {
                        if (naoPassou.checked) {
                            row.classList.add('nao-passou');
                            row.classList.remove('passou');
                        } else {
                            row.classList.remove('nao-passou');
                        }
                    }
                });

                var info2 = document.createElement('p');
                info2.innerHTML = '<strong>Total de registros:</strong> ' + data.length;
                resultado.appendChild(info2);
            });

            Array.from(document.querySelectorAll("#resultado table tbody tr")).forEach(function(row, index) {
                var passou = document.getElementById('passou_' + index);
                var naoPassou = document.getElementById('naoPassou_' + index);

                if (passou) {
                    if (passou.checked) {
                        row.classList.add('passou');
                        row.classList.remove('nao-passou');
                    }
                } else if (naoPassou) {
                    if (naoPassou.checked) {
                        row.classList.add('nao-passou');
                        row.classList.remove('passou');
                    }
                }
            });
        }

        function marcarPassou(index) {
            var row = document.getElementById('row_' + index);
            var passou = document.getElementById('passou_' + index);
            var naoPassou = document.getElementById('naoPassou_' + index);
            if (passou.checked) {
                row.classList.add('passou');
                row.classList.remove('nao-passou');
                naoPassou.checked = false;
            } else {
                row.classList.remove('passou');
            }
        }

        function marcarNaoPassou(index) {
            var row = document.getElementById('row_' + index);
            var naoPassou = document.getElementById('naoPassou_' + index);
            var passou = document.getElementById('passou_' + index);
            if (naoPassou.checked) {
                row.classList.add('nao-passou');
                row.classList.remove('passou');
                passou.checked = false;
            } else {
                row.classList.remove('nao-passou');
            }
        }

        function filtrarPassou() {
            var filtro = document.getElementById('filterPassou').checked;
            var naoPassouFiltro = document.getElementById('filterNaoPassou');
            if (filtro) naoPassouFiltro.checked = false;

            var tabela = document.querySelector("#resultado table tbody");
            if (!tabela) return;

            Array.from(tabela.rows).forEach(function(row) {
                var passouCheckbox = row.querySelector("input[id^='passou_']");
                row.style.display = filtro ? (passouCheckbox.checked ? "" : "none") : "";
            });
        }

        function filtrarNaoPassou() {
            var filtro = document.getElementById('filterNaoPassou').checked;
            var passouFiltro = document.getElementById('filterPassou');
            if (filtro) passouFiltro.checked = false;

            var tabela = document.querySelector("#resultado table tbody");
            if (!tabela) return;

            Array.from(tabela.rows).forEach(function(row) {
                var naoPassouCheckbox = row.querySelector("input[id^='naoPassou_']");
                row.style.display = filtro ? (naoPassouCheckbox.checked ? "" : "none") : "";
            });
        }

        function salvarReviews() {
            var tabela = document.querySelector("#resultado table tbody");
            if (!tabela) return;

            var data = [];
            Array.from(tabela.rows).forEach(function(row, index) {
                var passou = row.querySelector("input[id^='passou_']").checked;
                var naoPassou = row.querySelector("input[id^='naoPassou_']").checked;

                if (passou || naoPassou) {
                    var comentario = row.querySelector("input[id^='comentario_']").value;
                    var link = row.getAttribute("data-link");

                    data.push({
                        name: row.cells[0].innerText,
                        action: row.cells[1].innerText,
                        type: row.cells[2].innerText,
                        updateSet: row.cells[3].innerText,
                        application: row.cells[4].innerText,
                        passou: passou,
                        naoPassou: naoPassou,
                        comentario: comentario,
                        link: link
                    });
                }
            });

            if (data.length === 0) {
                alert("Nenhum registro selecionado para salvar.");
                return;
            }

            var ga = new GlideAjax('GetUpdateSetArtifacts');
            ga.addParam('sysparm_name', 'saveReview');
            ga.addParam('sysparm_data', JSON.stringify(data));
            ga.getXMLAnswer(function(response) {
                alert(response);
            });
        }

        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById('btnBuscar').onclick = buscarArtefatos;
            document.getElementById('btnSalvar').onclick = salvarReviews;
        });
    </script>
</j:jelly>
