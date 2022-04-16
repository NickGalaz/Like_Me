// Importar módulos necesarios
const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 3000;
// Importando funciones
const { insertar, consultar, editar } = require('./consultas');

// Crear servidor
http
    .createServer(async (req, res) => {

        // Ruta raíz
        if (req.url == "/" && req.method == "GET") {
            res.setHeader('content-type', 'text/html;charset=utf8')
            const html = fs.readFileSync('index.html', 'utf8')
            res.statusCode = 200;
            res.end(html);
        } else if (req.url == "/estilos.css" && req.method === "GET") {
            res.setHeader('content-type', 'text/css;charset=utf8')
            const estilo = fs.readFileSync('estilos.css', 'utf8')
            res.statusCode = 200;
            res.end(estilo);

            // Ruta POST de url = '/post'
        } else if (req.url == '/post' && req.method == 'POST') {
            try {
                let body = "";
                req.on('data', (chunk) => {
                    body += chunk;
                });
                req.on("end", async () => {
                    const datos = Object.values(JSON.parse(body));
                    const result = await insertar(datos);
                    res.statusCode = 201;
                    res.end(JSON.stringify(result));
                });
            } catch (error) {
                showError(error, res);
            }
        }

        // Ruta GET de url = '/posts'
        else if (req.url == "/posts" && req.method === "GET") {
            try {
                const registros = await consultar();
                res.statusCode = 200;
                res.end(JSON.stringify(registros));
            } catch (error) {
                showError(error, res);
            }
        }

        // Ruta PUT de url = '/post'
        else if (req.url.startsWith('/post?') && req.method == "PUT") {
            try {
                const { id } = url.parse(req.url, true).query;
                console.log('id', id);
                const respuesta = await editar(id);
                res.statusCode = 201;
                res.end(JSON.stringify(respuesta));
            } catch (error) {
                showError(error, res);
            }
        }
    })
    .listen(port, () => console.log('Conectado al puerto:', port));

const showError = (error, res) => {
    console.log(error.message);
    console.log(error.code);
    res.statusCode = 500;
    res.end(JSON.stringify(error));
}