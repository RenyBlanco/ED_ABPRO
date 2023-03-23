const express = require("express");
const rutas = express.Router();
const fs = require('fs');
const fileGasto = "C:/Users/reyna/OneDrive/Desktop/ED_ABPRO/modulos/gastos.json"

const {dltGasto, getRoom, updtGasto, addRoom, getGastos} = require ('../modulos/roommates.controller.js');


rutas.get('/', function(req, res) {
    res.render("index");
});

rutas.get('/roommates', getRoom);

rutas.post('/roommate', addRoom);

rutas.get('/gastos', getGastos);

rutas.post('/gasto', (req, res) => {
    let id = 0;
    let gastos = [];
    const { roommate, monto, descripcion } = req.body;
    
    if(fs.existsSync(fileGasto)){
        gastos = JSON.parse(fs.readFileSync(fileGasto));
    }
    id = gastos.length + 1;
    
    let registro = {
        id: id,
        roommate : roommate,
        descripcion: descripcion,
        monto: monto
    }

    gastos.push(registro);

    fs.writeFileSync(fileGasto, JSON.stringify(gastos), (error) => {
        if (error) {
            console.error(`No se puedo grabar el archivo: ${error}`);
            return;
        }
    });
    res.sendStatus(204)
});

rutas.put('/gasto/:id', updtGasto);

rutas.delete('/gasto/:id', dltGasto);

module.exports = rutas;