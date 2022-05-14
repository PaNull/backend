const db = require("../config/database");
const utils = require('../utils/utils');
import MatchController from './MatchController';

class TournamentController {

  async index(req, res) {
    const conn = await db.connect();
    const [rows, fields] = await conn.execute('SELECT id_campeonato, nome, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes, modalidade, etapa FROM campeonato');
    
    return res.status(200).json({ data: rows })
  }
 
  async getById(req, res) {
    const { id } = req.params;
    const conn = await db.connect();

    const [rows, fields] = await conn.execute(`SELECT id_campeonato, nome, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes, modalidade, etapa FROM campeonato WHERE id_campeonato=?`, [id]);
    
    if (rows.length)
      return res.status(200).json({ data: rows[0] })

    return res.status(400).json({ message: 'Campeonato não encontrado.' })
  }

  async getRegisteredTeamsChampionship(id_campeonato) {
    const conn = await db.connect();
    
    return await conn.execute(`SELECT tm.id_time, tm.nome FROM campeonato_times ct inner join time tm on ct.id_time=tm.id_time WHERE ct.id_campeonato=?`, [id_campeonato]);
  }

  async registeredTeamsChampionship(req, res) {
    const { id } = req.params;
    
    const [rows, fields] = await new TournamentController().getRegisteredTeamsChampionship(id);

    if (rows.length)
      return res.status(200).json({ data: rows })

    return res.status(400).json({ message: 'Nenhum time inscrito no campeonato.' })
  }

  async shuffleMatches(req, res) {
    const { id  } = req.params;

    const [rows, fields] = await new TournamentController().getRegisteredTeamsChampionship(id);
    const shuffleMatches = utils.shuffleArray(rows)

    for (let index = 0; index < shuffleMatches.length; index++) {
      if (index % 2 === 0) {
        continue
      }

      const teamA = shuffleMatches[index]
      const teamB = shuffleMatches[index-1]
      const dataPartida = new Date();
      dataPartida.setHours(new Date().getHours() + index)
      dataPartida.setMinutes(new Date().getMinutes() + 30)

      const resultMatch = await MatchController.createMatch({ idTeamA: teamA.id_time, idTeamB: teamB.id_time, dataPartida, idCampeonato: id });
    }

    return res.status(200).json({ data: shuffleMatches, message: 'Partidas geradas.' });
  }

  async registerTeamChampionship(req, res) {
    const { idTime, idCampeonato } = req.body;
    const conn = await db.connect();

    const [rows, fields] = await conn.execute(`INSERT INTO campeonato_times (id_campeonato, id_time) VALUES (?, ?)`, [idCampeonato, idTime ]);
    
    return res.status(200).json({ message: 'Time inscrito com sucesso.' });
  }

  async create(req, res) {
    const { nome, modalidade, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes } = req.body;
    const conn = await db.connect();

    const [rows, fields] = await conn.execute(`INSERT INTO campeonato (nome, modalidade, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes) VALUES (?, ?, ?, ?, ?, ?)`, [nome, modalidade, new Date(dataStartCampeonato), new Date(dataEndCampeonato), premiacao, qntdTimes]);
    
    return res.status(200).json({ message: 'Campeonato criado com sucesso.' });
  }

  async update(req, res) {
    const { id, nome, modalidade, dataStartCampeonato, dataEndCampeonato, premiacao, qntdTimes, stage } = req.body;
    const conn = await db.connect();

    const [{affectedRows}, fields] = await conn.query('UPDATE campeonato SET ? WHERE id_campeonato=?', [ { nome, modalidade, dataStartCampeonato: new Date(dataStartCampeonato), dataEndCampeonato: new Date(dataEndCampeonato), premiacao, qntdTimes, etapa: stage }, id]);

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
