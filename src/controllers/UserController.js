const db = require("../config/database");

class UserController {

  async index(req, res) {
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute('SELECT id_usuario, nome, email, dataNascimento, cpf, cargo, nacionalidade FROM usuario');
    
    rows.forEach(user => {
      user.link = `../update/index.html?id=${user.id_usuario}`;
    });

    return res.status(200).json({ data: rows })
  }
 
  async getById(req, res) {
    const { id } = req.params;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`SELECT nome, email, dataNascimento, cpf, nacionalidade, cargo FROM usuario WHERE id_usuario=?`, [id]);
    
    if (rows.length)
      return res.status(200).json({ data: rows[0] })

    return res.status(400).json({ message: 'Usuario não encontrado.' })
  }

  async create(req, res) {
    const { nome, email, dataNascimento, cpf, nacionalidade, cargo, senha} = req.body;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`INSERT INTO usuario (nome, email, dataNascimento, cpf, nacionalidade, cargo, senha) VALUES (?, ?, ?, ?, ?, ?, ?)`, [nome, email, new Date(dataNascimento), cpf, nacionalidade, cargo, senha]);
    
    return res.status(200).json({ message: 'Usuario criado com sucesso.' });
  }

  async update(req, res) {
    const { id, nome, email, dataNascimento, cpf, nacionalidade, cargo } = req.body;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.query('UPDATE usuario SET ? WHERE id_usuario=?', [ { nome, email, dataNascimento: new Date(dataNascimento), cpf, nacionalidade, cargo }, id]);
    
    
    if (affectedRows)
      return res.status(200).json({ message: 'Usuario atualizado com sucesso.' });
      
    return res.status(400).json({ message: 'Usuario não encontrado.' });
  }

  async delete(req, res) {
    const { id } = req.params;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.execute(`DELETE FROM usuario WHERE id_usuario=?`, [id]);
    
    if (affectedRows)
      return res.status(200).json({ message: 'Usuario deletado com sucesso.' });
  
    return res.status(400).json({ message: 'Usuario não encontrado.' });
  }
}

export default new UserController()
