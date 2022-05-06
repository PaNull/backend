const db = require("../config/database");

class TeamController {

  async index(req, res) {
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute('select useq.nome as nomeEquipe, us.nome, us.email from usuario_equipe useq inner join usuario us on useq.id_usuario = us.id_usuario ');

    return res.status(200).json({ data: rows })
  }

  async addTeamMember(req, res) {
    const { userId, teamId, funcao } = req.body;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`INSERT INTO usuario_equipe ( id_usuario, id_equipe, funcao ) VALUES (?, ?, ?)`, [userId, teamId, funcao]);
    
    if (rows.length)
      return res.status(200).json({ message: 'Usuario adicionado na equipe com sucesso.' })

    return res.status(400).json({ message: 'Equipe ou usuario não encontrado.' })
  }
 
  async getById(req, res) {
    const { id } = req.params;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`SELECT * FROM equipe WHERE id=?`, [id]);
    
    if (rows.length)
      return res.status(200).json({ data: rows[0] })

    return res.status(400).json({ message: 'Equipe não encontrado.' })
  }

  async create(req, res) {
    const { nome } = req.body;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`INSERT INTO equipe ( nome ) VALUES (?)`, [nome]);
    
    return res.status(200).json({ message: 'Equipe criado com sucesso.' });
  }

  async update(req, res) {
    const { id, nome } = req.body;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.query('UPDATE equipe SET ? WHERE id=?', [ { nome }, id]);
    
    
    if (affectedRows)
      return res.status(200).json({ message: 'Equipe atualizado com sucesso.' });
      
    return res.status(400).json({ message: 'Equipe não encontrado.' });
  }

  async delete(req, res) {
    const { id } = req.params;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.execute(`DELETE FROM equipe WHERE id=?`, [id]);
    
    if (affectedRows)
      return res.status(200).json({ message: 'Equipe deletado com sucesso.' });
  
    return res.status(400).json({ message: 'Equipe não encontrado.' });
  }
}

export default new TeamController()
