var valorUIT = 5150;

function agregarGasto() {
    var ingresos = document.getElementById('ingresos').value;
    var categoria = document.getElementById('categoria').value;
    var gasto = document.getElementById('gasto').value;

    if (ingresos === '' || categoria === '' || gasto === '') {
        alert('Por favor complete todos los campos.');
        return;
    }

    var tabla = document.getElementById('tablaGastos').getElementsByTagName('tbody')[0];
    var nuevaFila = tabla.insertRow(tabla.rows.length);
    var celdaCategoria = nuevaFila.insertCell(0);
    var celdaGasto = nuevaFila.insertCell(1);

    celdaCategoria.innerHTML = categoria;
    celdaGasto.innerHTML = gasto;

    document.getElementById('categoria').value = '';
    document.getElementById('gasto').value = '';
}

function limpiarTabla() {
    var tabla = document.getElementById('tablaGastos').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
}

function mostrarResultado(impuestoTotal, detalles) {
    var resultadoContainer = document.getElementById('resultadoContainer');
    
    resultadoContainer.innerHTML = '';

    var nuevoParrafoTotal = document.createElement('p');
    nuevoParrafoTotal.innerHTML = 'Impuestos calculados: S/ ' + impuestoTotal.toFixed(2);
    
    resultadoContainer.appendChild(nuevoParrafoTotal);

    var nuevoParrafoDetalles = document.createElement('p');
    nuevoParrafoDetalles.innerHTML = '<strong>Detalles del cálculo:</strong><br>' + detalles;
    
    resultadoContainer.appendChild(nuevoParrafoDetalles);
}

function calcularImpuestos() {
    var ingresosAnuales = parseFloat(document.getElementById('ingresos').value);
    var descuento20Porciento = ingresosAnuales * 0.20;
    var resultadoPaso1 = ingresosAnuales - descuento20Porciento;

    var descuento7UIT = Math.min(resultadoPaso1, valorUIT * 7);
    var resultadoPaso2 = resultadoPaso1 - descuento7UIT;

    var deducciones = obtenerDeducciones();
    var montoDeducciones = calcularMontoDeducciones(deducciones);
    var resultadoPaso3 = resultadoPaso2 - montoDeducciones;

    var impuestoTotal = calcularImpuestoPorTramo(resultadoPaso3);

    var detalles = `Ingresos Anuales: S/ ${ingresosAnuales.toFixed(2)}<br>
                     Descuento del 20%: S/ ${descuento20Porciento.toFixed(2)}<br>
                     Descuento de 7 UIT: S/ ${descuento7UIT.toFixed(2)}<br>
                     Deducciones: S/ ${montoDeducciones.toFixed(2)}<br>
                     Total después de deducciones: S/ ${resultadoPaso3.toFixed(2)}`;

    mostrarResultado(impuestoTotal, detalles);
}

function obtenerDeducciones() {
    var tabla = document.getElementById('tablaGastos').getElementsByTagName('tbody')[0];
    var filas = tabla.getElementsByTagName('tr');
    var deducciones = {};

    for (var i = 0; i < filas.length; i++) {
        var categoria = filas[i].getElementsByTagName('td')[0].innerText.toLowerCase();
        var gasto = parseFloat(filas[i].getElementsByTagName('td')[1].innerText.replace('S/ ', ''));

        deducciones[categoria] = gasto;
    }

    return deducciones;
}

function calcularMontoDeducciones(deducciones) {
    var montoTotalDeducciones = 0;

    for (var categoria in deducciones) {
        switch (categoria) {
            case 'arrendamiento':
                montoTotalDeducciones += deducciones[categoria] * 0.30;
                break;
            case 'hoteles':
                montoTotalDeducciones += deducciones[categoria] * 0.15;
                break;
            case 'honorarios':
                montoTotalDeducciones += deducciones[categoria] * 0.30;
                break;
            case 'essalud':
                montoTotalDeducciones += deducciones[categoria];
                break;
            case 'profesion':
                montoTotalDeducciones += deducciones[categoria] * 0.30;
                break;
            default:
                break;
        }
    }

    var limiteDeducciones = valorUIT * 3;
    montoTotalDeducciones = Math.min(montoTotalDeducciones, limiteDeducciones);

    return montoTotalDeducciones;
}

function calcularImpuestoPorTramo(montoBase) {
    var tramo1 = valorUIT * 5;
    var tramo2 = valorUIT * 20;
    var tramo3 = valorUIT * 35;
    var tramo4 = valorUIT * 45;

    var impuesto = 0;

    if (montoBase <= tramo1) {
        impuesto = montoBase * 0.08;
    } else if (montoBase <= tramo2) {
        impuesto = tramo1 * 0.08 + (montoBase - tramo1) * 0.14;
    } else if (montoBase <= tramo3) {
        impuesto = tramo1 * 0.08 + (tramo2 - tramo1) * 0.14 + (montoBase - tramo2) * 0.17;
    } else if (montoBase <= tramo4) {
        impuesto = tramo1 * 0.08 + (tramo2 - tramo1) * 0.14 + (tramo3 - tramo2) * 0.17 + (montoBase - tramo3) * 0.20;
    } else {
        impuesto = tramo1 * 0.08 + (tramo2 - tramo1) * 0.14 + (tramo3 - tramo2) * 0.17 + (tramo4 - tramo3) * 0.20 + (montoBase - tramo4) * 0.30;
    }

    return impuesto;
}
