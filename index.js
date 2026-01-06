const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // <--- 1. AGREGAR ESTO

const app = express();
const db = new sqlite3.Database('./base.sqlite3');

app.use(cors()); // <--- 2. AGREGAR ESTO para permitir conexiones externas
app.use(bodyParser.json());

app.post('/agrega_todo', (req, res) => {
    const { todo } = req.body;
    if (!todo) {
        return res.status(400).json({ error: 'Falta el campo todo' });
    }

    const query = `INSERT INTO todos (todo) VALUES (?)`;
    db.run(query, [todo], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            status: "success",
            id: this.lastID,
            message: "Tarea guardada correctamente"
        });
    });
});

// NUEVO ENDPOINT: Obtener todas las tareas
app.get('/lista_todos', (req, res) => {
    const query = `SELECT * FROM todos`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Devuelve la lista de tareas en formato JSON
        res.status(200).json({
            status: "success",
            data: rows
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const db = new sqlite3.Database('./base.sqlite3', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("❌ Error al abrir la base de datos:", err.message);
    } else {
        console.log("✅ Conectado a la base de datos base.sqlite3");
        
        // Opcional: Crear la tabla si por alguna razón no existe en Render
        db.run(`CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            todo TEXT
        )`);
    }
});