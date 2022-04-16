// Importar módulos necesarios
const { Pool } = require('pg');

// Crear nueva instancia de la clase Pool, con objeto de configuración
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "Nick1212",
    port: 5432,
    database: "likeme",
});

// Función asincrónica para insertar un post
const insertar = async (datos) => {
    const consulta = {
        text: 'INSERT INTO posts (usuario, url, descripcion, likes) VALUES ($1, $2,  $3, 0) RETURNING *;',
        values: datos,
    };

    try {
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.log;
        throw error;
    }
};

// Función asincrónica para consultar posts
const consultar = async () => {
    try {
        const result = await pool.query("SELECT id, usuario, url, descripcion, likes FROM posts ORDER BY id ASC");
        return result;
    } catch (error) {
        console.log(error.code);
        throw error;
    }
};

// Función asincrónica para editar un usuario
const editar = async (id) => {
    const values = Object.values([id]);
    try {
        const consulta = {
            text: 'UPDATE posts SET likes = likes + 1 WHERE id = $1',
            values
        }
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


// Exportando funciones
module.exports = { insertar, consultar, editar };