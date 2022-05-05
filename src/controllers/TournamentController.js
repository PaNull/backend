const db = require("../config/database");

class TournamentController {

  async index(req, res) {
    const conn = await db.connect();
    const [rows, fields] = await conn.execute('SELECT id_campeonato, nome, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes, modalidade FROM campeonato');
    
    return res.status(200).json({ data: rows })
  }
 
  async getById(req, res) {
    const { id } = req.params;
    const conn = await db.connect();

    const [rows, fields] = await conn.execute(`SELECT id_campeonato, nome, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes, modalidade FROM campeonato WHERE id_campeonato=?`, [id]);
    
    if (rows.length)
      return res.status(200).json({ data: rows[0] })

    return res.status(400).json({ message: 'Campeonato não encontrado.' })
  }

  async create(req, res) {
    const { nome, modalidade, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes } = req.body;
    const conn = await db.connect();

    const [rows, fields] = await conn.execute(`INSERT INTO campeonato (nome, modalidade, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes) VALUES (?, ?, ?, ?, ?, ?)`, [nome, modalidade, new Date(dataStartCampeonato), new Date(dataEndCampeonato), premiacao, qntdTimes]);
    
    return res.status(200).json({ message: 'Campeonato criado com sucesso.' });
  }

  async update(req, res) {
    const { id, nome, modalidade, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes } = req.body;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.query('UPDATE campeonato SET ? WHERE id_campeonato=?', [ { nome, modalidade, dataStartCampeonato: new Date(dataStartCampeonato), dataEndCampeonato: new Date(dataEndCampeonato), premiacao, qntdTimes }, id]);

    if (affectedRows)
      return res.status(200).json({ message: 'Campeonato atualizado com sucesso.' });
      
    return res.status(400).json({ message: 'Campeonato não encontrado.' });
  }

  async delete(req, res) {
    const { id } = req.params;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.execute(`DELETE FROM campeonato WHERE id_campeonato=?`, [id]);
    
    if (affectedRows)
      return res.status(200).json({ message: 'Campeonato deletado com sucesso.' });
    
    return res.status(400).json({ message: 'Campeonato não encontrado.' });
  }
}

export default new TournamentController()
