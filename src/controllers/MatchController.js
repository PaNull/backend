const db = require("../config/database");
const utils = require('../utils/utils');
const querySelect = `Select par.partidaId, par.resultado, par.dataPartida, par.ganhadorId, eq.id as idEquipe, eq.nome From partida par Join equipe eq on par.idTimeA = eq.id or par.idTimeB = eq.id`;

class MatchController {

  mapMatch(resultQuery) {
    const matchesGroup = utils.groupBy(resultQuery, 'partidaId', 'teams');

    return matchesGroup.map(match => {
      const teamMap = match.teams.map(team => ({ idEquipe: team.idEquipe, nome: team.nome })) ;

      return { 
        partidaId: match.id,
        resultado: resultQuery[0].resultado,
        dataPartida: resultQuery[0].dataPartida,
        ganhadorId: resultQuery[0].ganhadorId,
        teamA: teamMap[0],
        teamB: teamMap[1] 
      }
    });
  }

  async index(req, res) {
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(querySelect);

    const data = new MatchController().mapMatch(rows);

    return res.status(200).json({ data })
  }

  async getById(req, res) {
    const { id } = req.params;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`${querySelect} WHERE partidaId=?`, [id]);

    const data = new MatchController().mapMatch(rows);

    if (rows.length)
      return res.status(200).json({ data })

    return res.status(400).json({ message: 'Partida não encontrada.' })
  }

  async create(req, res) {
    const { idTeamA, idTeamB, dataPartida } = req.body;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`INSERT INTO partida (idTimeA, idTimeB, dataPartida) VALUES (?, ?, ?)`, [idTeamA, idTeamB, new Date(dataPartida)]);
    
    return res.status(200).json({ message: 'Partida criada com sucesso.' });
  }

  async update(req, res) {
    const { id, resultado, ganhadorId } = req.body;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.query('UPDATE partida SET ? WHERE partidaId=?', [ { resultado, ganhadorId }, id]);
    
    
    if (affectedRows)
      return res.status(200).json({ message: 'Partida atualizada com sucesso.' });
      
    return res.status(400).json({ message: 'Partida não encontrada.' });
  }

  async delete(req, res) {
    const { id } = req.params;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.execute(`DELETE FROM partida WHERE partidaId=?`, [id]);
    
    if (affectedRows)
      return res.status(200).json({ message: 'Partida deletada com sucesso.' });
  
    return res.status(400).json({ message: 'Partida não encontrada.' });
  }
}

export default new MatchController()
