const request = require('request');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid');
const filePath = "C:/Users/reyna/OneDrive/Desktop/ED_ABPRO/modulos/roommates.json";
const fileGasto = "C:/Users/reyna/OneDrive/Desktop/ED_ABPRO/modulos/gastos.json";



getRoom = async (req, res) => {
    try {
        if(fs.existsSync(filePath)){
            const data = JSON.parse(fs.readFileSync(filePath));
            res.json(data);
        }else{
            res.json({});
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salio mal...'
        })
    }
}

addRoom = async (req, res) => {
    const userId = uuidv4();
    let nuevos = [];
    request('https://randomuser.me/API', (error, response, body) => {
        if (error) {
            console.error(`No se pudo accesar a API: ${error.message}`);
            return;
        }
        if (response.statusCode != 200) {
            console.error(`Estado esperado 200 pero recivido ${response.statusCode}.`);
            return;
        }
        companiero = JSON.parse(body);
        let registro = {
            id: userId,
            nombre : companiero.results[0].name.first+' '+companiero.results[0].name.last,
            debe: 0,
            recibido: 0
        }

        if(fs.existsSync(filePath)){
            roommates = JSON.parse(fs.readFileSync(filePath));
            nuevos = roommates;
        }

        nuevos.push(registro);

        fs.writeFileSync(filePath, JSON.stringify(nuevos), (error) => {
            if (error) {
                console.error(`No se puedo grabar el archivo: ${error}`);
                return;
            }
        });
        res.sendStatus(204);
    });
    
}

getGastos = async (req, res) => {
    try {
        if(fs.existsSync(fileGasto)){
            const data = JSON.parse(fs.readFileSync(fileGasto));
            res.json(data);
        }else{
            res.json({});
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salio mal...'
        })
    }
}

updtGasto = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { roommate, descripcion, monto } = req.body;
        const data = JSON.parse(fs.readFileSync(fileGasto));
        let registro = {
            id: id,
            roommate : roommate,
            descripcion: descripcion,
            monto: monto
        }
        console.log(registro);
        let indice = data.map(element => element.id).indexOf(id);
        console.log(data[indice]);
        data[indice] = registro;
        fs.writeFileSync(fileGasto, JSON.stringify(data));
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salio mal...'
        })
    }
}

dltGasto = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const data = JSON.parse(fs.readFileSync(fileGasto));
        let indice = data.map(element => element.id).indexOf(id);
        data.splice(indice,1);
        fs.writeFileSync(fileGasto, JSON.stringify(data));
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'Algo salio mal...'
        }) 
    }
}

module.exports = {
    dltGasto,
    updtGasto,
    getGastos,
    getRoom,
    addRoom
}