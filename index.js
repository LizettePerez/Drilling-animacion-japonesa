const express = require('express');
const req = require('express/lib/request');
const app = express();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs/promises');

const PORT = 3000;

//Pagina de inicio
app.get('/', (req, res) => {
  res.send('Inicio')
})

//Obtener todos los datos
app.get('/animes', async (req, res) => {
  try {
    const animeData = JSON.parse(await fs.readFile(__dirname + '/anime.json', 'utf8'));
    res.status(200).json(animeData);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

//Obtener datos de un anime por su id
app.get('/animes/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const animeData = JSON.parse(await fs.readFile(__dirname + '/anime.json', 'utf8'));
    const anime = animeData[id];

    if (anime) {
      res.json(anime);
    } else {
      res.status(404).json({
        status: 'OK',
        message: 'Anime no encontrado'
      })
    }

  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

//Obtener datos de un anime por su nombre
app.get('/animes/nombre/:nombre', async (req, res) => {
  const nombreBuscado = req.params.nombre.toLowerCase();

  try {
    const animeData = JSON.parse(await fs.readFile(__dirname + '/anime.json', 'utf8'))
    const animesArray = Object.values(animeData);
    const anime = animesArray.find(anime => anime.nombre.toLowerCase() === nombreBuscado);

    if (anime) {
      res.json(anime);
    } else {
      res.status(404).json({
        status: 'OK',
        message: 'Anime no encontrado'
      })
    }

  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
})

// Crear un nuevo anime
app.get('/create', async (req, res) => {
  try {
    const id = uuidv4();
    const nombre = req.query.nombre;
    const genero = req.query.genero;
    const año = req.query.año;
    const autor = req.query.autor;

    const animeData = JSON.parse(await fs.readFile(__dirname + '/anime.json', 'utf8'));
    
    const nuevoAnime = {
      nombre,
      genero,
      año,
      autor
    };

    animeData[id] = nuevoAnime;

    await fs.writeFile(__dirname + '/anime.json', JSON.stringify(animeData, null, 2), 'utf8');

    res.status(201).json({
      status: 'OK',
      message: 'Anime creado exitosamente',
      id: id
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

// Actualizar datos de un anime por su id
app.get('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const nombre = req.query.nombre;
    const genero = req.query.genero;
    const año = req.query.año;
    const autor = req.query.autor;
    let encontrado = false;

    const animeData = JSON.parse(await fs.readFile(__dirname + '/anime.json'));

    Object.keys(animeData).forEach((animeId) => {
      if (animeId === id) {
        const anime = animeData[animeId];
        anime.nombre = nombre || anime.nombre;
        anime.genero = genero || anime.genero;
        anime.año = año || anime.año;
        anime.autor = autor || anime.autor;
        encontrado = true;
      }
    });

    if (encontrado) {
      await fs.writeFile(__dirname + '/anime.json', JSON.stringify(animeData, null, 2));
      res.status(200).json(animeData);
    } else {
      res.status(404).json({
        status: 'OK',
        message: 'No existe anime a actualizar'
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
  res.end();
});




app.listen(PORT, () => console.log(`Iniciando en puerto ${PORT}`))