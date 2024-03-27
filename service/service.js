const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Caminho para o arquivo de metadados
const metadataFilePath = './nft-meta.json';

// Endpoint para obter os metadados
app.get('/metadata', async (req, res) => {
    try {
        const metadata = await fs.readJson(metadataFilePath);
        res.send(metadata);
    } catch (error) {
        console.log(error);
        res.status(500).send({error: 'Não foi possível ler os metadados'});
    }
});

// Endpoint para atualizar os metadados
app.post('/metadata', async (req, res) => {
    try {
        await fs.writeJson(metadataFilePath, req.body, err => {
            if (err) {
                console.error('Erro ao escrever os metadados', err);
                res.status(500).send({error: 'Não foi possível atualizar os metadados'});
            }
        });
        
        console.log(req.body)
        res.send({success: true});
    } catch (error) {
        res.status(500).send({error: 'Não foi possível atualizar os metadados'});
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

async function ensureMetadataFileExists() {
    try {
        await fs.ensureFile(metadataFilePath);
    } catch (error) {
        console.error('Erro ao garantir que o arquivo de metadados exista', error);
    }
}

// Então chame esta função antes de iniciar o servidor ou antes de lidar com as requisições
ensureMetadataFileExists();