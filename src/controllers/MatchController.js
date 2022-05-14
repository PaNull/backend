const db = require("../config/database");
const utils = require('../utils/utils');
const querySelect = `Select par.id_partida, par.resultado, par.dataPartida, par.id_ganhador as ganhadorId, tim.id_time as idTime, tim.nome From partida par Join time tim on par.id_timeA = tim.id_time or par.id_timeB = tim.id_time`;

class MatchController {

  mapMatch(resultQuery) {
    const matchesGroup = utils.groupBy(resultQuery, 'id_partida', 'teams');

    return matchesGroup.map(match => {
      const teamMap = match.teams.map(team => ({ idTime: team.idTime, nome: team.nome })) ;

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
    
    const [rows, fields] = await conn.execute(`${querySelect} WHERE id_partida=?`, [id]);

    const data = new MatchController().mapMatch(rows);

    if (rows.length)
      return res.status(200).json({ data })

    return res.status(400).json({ message: 'Partida não encontrada.' })
  }

  async getByTournamentId(req, res) {
    const { id } = req.params;
    const conn = await db.connect();
    
    const [rows, fields] = await conn.execute(`${querySelect} WHERE id_campeonato=?`, [id]);

    const data = new MatchController().mapMatch(rows);

    if (rows.length)
      return res.status(200).json({ data })

    return res.status(400).json({ message: 'Partida não encontrada.' })
  }

  async create(req, res) {
    const { idTeamA, idTeamB, dataPartida, idCampeonato } = req.body;

    const [rows, fields] = await new MatchController().createMatch({ idTeamA, idTeamB, dataPartida, idCampeonato });
    
    return res.status(200).json({ message: 'Partida criada com sucesso.' });
  }

  async createMatch({ idTeamA, idTeamB, dataPartida, idCampeonato }) {
    const conn = await db.connect();
    
    return await conn.execute(`INSERT INTO partida (id_timeA, id_timeB, dataPartida, id_campeonato) VALUES (?, ?, ?, ?)`, [idTeamA, idTeamB, new Date(dataPartida), idCampeonato]);
  }

  async update(req, res) {
    const { id, resultado, ganhadorId } = req.body;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.query('UPDATE partida SET ? WHERE id_partida=?', [ { resultado, id_ganhador: ganhadorId }, id]);
    
    
    if (affectedRows)
      return res.status(200).json({ message: 'Partida atualizada com sucesso.' });
      
    return res.status(400).json({ message: 'Partida não encontrada.' });
  }

  async delete(req, res) {
    const { id } = req.params;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.execute(`DELETE FROM partida WHERE id_partida=?`, [id]);
    
    if (affectedRows)
      return res.status(200).json({ message: 'Partida deletada com sucesso.' });
  
    return res.status(400).json({ message: 'Partida não encontrada.' });
  }
}

export default new MatchController()