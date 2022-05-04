const db = require("../config/database");

class UserController {

  async index(req, res) {
    const conn = await db.connect();

    const [rows, fields] = await conn.execute('SELECT id_usuario, nome, email, dataNascimento, cpf, cargo, nacionalidade FROM usuario');
    
    return res.status(200).json({ data: rows })
  }
 
  async getById(req, res) {
    const { id } = req.body;
    const conn = await db.connect();

    const [rows, fields] = await conn.execute(`SELECT nome, email, dataNascimento, cpf, nacionalidade, cargo FROM usuario WHERE id_usuario=${id}`);
    
    return res.status(200).json({ data: rows[0] })
  }

  async create(req, res) {
    const conn = await db.connect();
    const { nome, email, dataNascimento, cpf, nacionalidade, cargo, senha} = req.body;

    const [rows, fields] = await conn.execute(`INSERT INTO usuario (nome, email, dataNascimento, cpf, nacionalidade, cargo, senha) VALUES ('${nome}', '${email}', '${dataNascimento}', '${cpf}', '${nacionalidade}', '${cargo}', '${senha}')`);
    
    return res.status(200);
  }

  async update(req, res) {
    const conn = await db.connect();
    const { id, nome, email, dataNascimento, cpf, nacionalidade, cargo } = req.body;

    const result = await conn.query('UPDATE usuario SET ? WHERE id_usuario=?', [ { nome, email, dataNascimento, cpf, nacionalidade, cargo }, id], (err) => {
      console.log(err)
    });
    
    return res.status(200);
  }

  async delete(req, res) {
    const conn = await db.connect();
    const { id } = req.params;

    const [rows, fields] = await conn.execute(`DELETE FROM usuario WHERE id_usuario=${id}`);
    
    return res.status(200);
  }
}

export default new UserController()
