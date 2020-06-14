
const express = require('express');
const Pool = require('pg').Pool;
const cors = require('cors'); 

const pool = new Pool({
    user:'kkvmltqygkvcnf',
    password:'52680f75a1092e20fd407a7e0b17eddd3e55d04a58b073c7d4ea4ea0d3a8bedc',
    host:'ec2-35-169-254-43.compute-1.amazonaws.com',
    database:'d7dkc9ht6gmvpe',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});
  
const server = express();

server.use(cors());

server.use(express.json());

//GET
server.get('/tarefa', async function(request, response) {
   result = await pool.query('SELECT * FROM tarefas');

   return response.json(result.rows);
})

server.get('/tarefa/search', async function(request, response) {
    const disciplina = request.query.disciplina;
    const sql = `SELECT * FROM tarefas WHERE disciplina ILIKE $1`;
    const result = await pool.query(sql, ["%" +  disciplina + "%"]);
    return response.json(result.rows);
})

server.get('/tarefa/:id', async function(request, response) {
    const id = request.params.id;
    const sql = `SELECT * FROM tarefas WHERE id = $1`
    const result = await pool.query(sql, [id]);
    return response.json(result.rows);
})


//POST
server.post('/tarefa', async function(request, response) {
    const disciplina = request.body.disciplina;
    const date = request.body.date;
   // const entregue = request.body.entregue;
    const sql= `INSERT INTO tarefas (disciplina, date, entrega) VALUES ($1, $2, $3)`;
    await pool.query(sql, [disciplina, date, false]);
    return response.status(204).send();
})


//DELETE
server.delete('/tarefa/:id', async function(request, response) {
    const id = request.params.id;
    const sql = `DELETE FROM tarefas WHERE id = $1`;
    await pool.query(sql, [id]);
    return response.status(204).send();
})


//UPDATE
server.put('/tarefa/:id', async function(request, response) {
    const id = request.params.id;
    const { disciplina, date, entrega} = request.body;
    const sql = `UPDATE tarefas SET disciplina = $1, date = $2, entrega = $3 WHERE id = $4`;
    await pool.query(sql, [disciplina, date, entrega, id]);
    return response.status(204).send();
})


//UPDATE Do Entregue
server.patch('/tarefa/:id/entregue', async function(request, response) {
    const id = request.params.id;
    const sql = `UPDATE tarefas SET entrega = true WHERE id = $1`;
    await pool.query(sql, [id]);
    return response.status(204).send();
})

server.patch('/tarefa/:id/naoentregue', async function(request, response) {
    const id = request.params.id;
    const sql = `UPDATE tarefas SET entrega = false WHERE id = $1`;
    await pool.query(sql, [id]);
    return response.status(204).send();
});



server.listen(process.env.PORT || 3000); 
