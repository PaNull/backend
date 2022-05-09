const db = require("../config/database");
const utils = require('../utils/utils');

class TeamController {

  mapTeamWithPlayers(resultQuery) {
    const teamsGroup = utils.groupBy(resultQuery, 'teamId', 'players');

    return teamsGroup.map(team => {
      const playerMap = team.players.map(pl => ({ userId: pl.userId, nome: pl.nome, funcao: pl.funcao })) ;

      return { 
        teamId: team.id,
        teamName: team.players[0].teamName,
        players: playerMap,
      }
    });
  }

  async index(req, res) {
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute('select * from time');

    return res.status(200).json({ data: rows })
  }

  async playersOfTeams(req, res) {
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute('select tim.id_time as teamId, tim.nome as teamName, us.id_usuario as userId, us.nome, usTim.funcao from usuario_time usTim inner join usuario us on usTim.id_usuario = us.id_usuario inner join time tim on usTim.id_time=tim.id_time');
    
    const data = new TeamController().mapTeamWithPlayers(rows);

    return res.status(200).json({ data })
  }

  async addTeamMember(req, res) {
    const { userId, teamId, funcao } = req.body;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`INSERT INTO usuario_time ( id_usuario, id_time, funcao ) VALUES (?, ?, ?)`, [userId, teamId, funcao]);
    
    return res.status(200).json({ message: 'Usuario adicionado no time com sucesso.' })
  }
 
  async getById(req, res) {
    const { id } = req.params;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`SELECT * FROM time WHERE id_time=?`, [id]);
    
    if (rows.length)
      return res.status(200).json({ data: rows[0] })

    return res.status(400).json({ message: 'Time não encontrado.' })
  }

  async create(req, res) {
    const { nome } = req.body;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`INSERT INTO time ( nome ) VALUES (?)`, [nome]);
    
    return res.status(200).json({ message: 'Time criado com sucesso.' });
  }

  async update(req, res) {
    const { id, nome } = req.body;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.query('UPDATE time SET ? WHERE id_time=?', [ { nome }, id]);
    
    
    if (affectedRows)
      return res.status(200).json({ message: 'Time atualizado com sucesso.' });
      
    return res.status(400).json({ message: 'Time não encontrado.' });
  }

  async delete(req, res) {
    const { id } = req.params;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.execute(`DELETE FROM time WHERE id_time=?`, [id]);
    
    if (affectedRows)
      return res.status(200).json({ message: 'Time deletado com sucesso.' });
  
    return res.status(400).json({ message: 'Time não encontrado.' });
  }
}

export default new TeamController()
