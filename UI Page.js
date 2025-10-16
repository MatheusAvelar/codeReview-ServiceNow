<?xml version="1.0" encoding="utf-8" ?>
<j:jelly trim="false" xmlns:j="jelly:core" xmlns:g="glide" xmlns:u="jelly:util">
    <g:ui_form>

        <!-- Header -->
        <div class="form-header">
            <h2>Code Review - Update Set</h2>
            <button id="btnBuscar" type="button">Buscar</button>
        </div>

        <!-- Inputs para Update Sets e filtros -->
        <div style="margin-bottom:15px;">
            <label for="updateSets">Update Sets</label>
            <textarea id="updateSets" placeholder="Digite os nomes dos Update Sets separados por vírgula" style="width:100%; height:80px; padding:10px; border:1px solid #ccc; border-radius:6px; resize:none;" />
        </div>

        <div style="margin-bottom:15px;">
            <label for="typeFilter">Filtrar por Type</label>
            <input type="text" id="typeFilter" placeholder="Digite um Type para incluir" />
        </div> 

        <div style="margin-bottom:15px;">
            <label for="notTypeFilter">Excluir Type</label>
            <input type="text" id="notTypeFilter" placeholder="Digite um Type para excluir" />
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
    </g:ui_form>

    <style>
        /* Form container */
        g\\:ui_form {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        /* Header */
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

        /* Labels */
        label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
            color: #333;
        }

        /* Inputs e textarea */
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

        /* Botão Buscar */
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

        /* Tabela */
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

        /* Checkboxes na tabela */
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

        /* Filtros fora da tabela */
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

        /* Linhas da tabela por status */
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

            var ga = new GlideAjax('GetUpdateSetArtifacts');
            ga.addParam('sysparm_name', 'getArtifacts');
            ga.addParam('sysparm_updates', updates);
            ga.addParam('sysparm_types', type);
            ga.addParam('sysparm_notTypes', notType);
            ga.getXMLAnswer(function(response) {
                var data = JSON.parse(response || '[]');

                var html = "";
                if (data.length === 0) {
                    html = "<p style='font-style:italic; color:#777;'>Nenhum artefato encontrado.</p>";
                } else {
                    html = "<p><strong>Total de registros:</strong> " + data[0].count + "</p>";
                    html += "<table>";
                    html += "<thead><tr>";
                    html += "<th>Nome</th>";
                    html += "<th>Type</th>";
                    html += "<th>Update Set</th>";
                    html += "<th>Application</th>";
                    html += "<th>Passou</th>";
                    html += "<th>Não Passou</th>";
                    html += "</tr></thead><tbody>";

                    data.forEach(function(item, index) {
                        html += "<tr id='row_" + index + "'>";
                        html += "<td><a target='_blank' href='" + (item.link !== "Não informado" ? item.link : "#") + "'>" + item.name + "</a></td>";
                        html += "<td>" + item.type + "</td>";
                        html += "<td>" + item.updateSet + "</td>";
                        html += "<td>" + item.application + "</td>";
                        html += "<td style='text-align:center;'><input type='checkbox' id='passou_" + index + "' onclick='marcarPassou(" + index + ")' /></td>";
                        html += "<td style='text-align:center;'><input type='checkbox' id='naoPassou_" + index + "' onclick='marcarNaoPassou(" + index + ")' /></td>";
                        html += "</tr>";
                    });

                    html += "</tbody></table>";
                    html += "<p><strong>Total de registros:</strong> " + data[0].count + "</p>";
                }

                document.getElementById('resultado').innerHTML = html;
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

        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById('btnBuscar').onclick = buscarArtefatos;
        });
    </script>
</j:jelly>
