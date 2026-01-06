const express = require('express');
const sqlite3 = require('sqlite3').sync();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./base.sqlite3');

app.use(bodyParser.json());

// Punto d, f y h: Endpoint POST
app.post('/agrega_todo', (req, res) => {
    const { todo } = req.body;

    if (!todo) {
        return res.status(400).json({ error: 'El campo "todo" es requerido' });
    }

    const query = `INSERT INTO todos (todo) VALUES (?)`;
    
    db.run(query, [todo], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Punto h: Responder con JSON y estado 201
        res.status(201).json({
            status: "success",
            id: this.lastID,
            message: "Tarea guardada correctamente"
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});