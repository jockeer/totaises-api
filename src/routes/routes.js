const express = require('express')
const router = express.Router()
const pool = require('../database')

//-------------ROUTES-------------------
router.get('/', function (req, res, next) {
    res.json({
        message: 'Hola'
    })
});



//----------------API---------------------------
let json = {}

router.get('/api/traerJugadoresEquipo/:id', async (req, res, next) => {
    let all = await pool.query(`select * from jugador where id_equipo=${req.params.id}`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})
router.get('/api/traerEquipos/:id', async (req, res, next) => {
    let all = await pool.query(`select * from equipo where id_categoria=${req.params.id}`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})
router.get('/api/traerCampeonatos/:id', async (req, res, next) => {
    let all = await pool.query(`select * from campeonato where id_categoria=${req.params.id}`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})

router.get('/api/traerDetalleEquipo/:id', async (req, res, next) => {
    let all = await pool.query(`select * from equipo where id=${req.params.id}`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})
router.get('/api/tablaPosiciones/:id', async (req, res, next) => {
    let all = await pool.query(`select e.id, e.nombre as "Equipo",dtc.partidos_jugados,
                                dtc.partidos_ganados,dtc.partidos_perdidos,dtc.partidos_empatados,dtc.puntos 
                                from detalle_campeonato dtc join equipo e
                                    on(dtc.id_equipo=e.id)
                                    join campeonato ca
                                    on(dtc.id_campeonato=ca.id)
                                    where dtc.id_campeonato = ${req.params.id} order by dtc.puntos desc`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})
router.get('/api/traerCampeonatos', async (req, res, next) => {
    let all = await pool.query(`select * from campeonato`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})

router.get('/api/traerPartidosPorCampeonato/:id/:fecha', async (req, res, next) => {
    let all = await pool.query(`select pa.id,pa.estado, pa.fecha,pa.goles_local,pa.goles_visitante,
                                el.nombre as "Equipo_Local",
                                ev.nombre as "Equipo_Visitante",ar.nombre || ' ' || ar.apellido as "Arbitro",
                                can.nombre as "Estadio",cam.nombre as "Campeonato"
                                from partido pa join equipo el
                                    on(pa.id_equipo_local=el.id)
                                    join equipo ev
                                    on(pa.id_equipo_visitante=ev.id)
                                    join arbitro ar
                                    on(pa.id_arbitro=ar.id)
                                    join cancha can
                                    on(pa.id_cancha=can.id)
                                    join campeonato cam
                                    on(pa.id_campeonato=cam.id)
                                    where cam.id = ${req.params.id} and pa.fecha = '${req.params.fecha}'`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})
router.get('/api/traerdetallePartido/:id', async (req, res, next) => {
    let all = await pool.query(`select pa.id, pa.estado,pa.fecha,pa.goles_local,pa.goles_visitante,el.nombre as "Equipo_Local",ev.nombre as "Equipo_Visitante",ar.nombre || ' ' || ar.apellido as "Arbitro",can.nombre as "Estadio",cam.nombre as "Campeonato"
                                from partido pa join equipo el
                                    on(pa.id_equipo_local=el.id)
                                    join equipo ev
                                    on(pa.id_equipo_visitante=ev.id)
                                    join arbitro ar
                                    on(pa.id_arbitro=ar.id)
                                    join cancha can
                                    on(pa.id_cancha=can.id)
                                    join campeonato cam
                                    on(pa.id_campeonato=cam.id)
                                    where pa.id = ${req.params.id} `);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})

router.post('/api/registrarCampeonato', async (req, res, next) => {
    let body=req.body
    let all = await pool.query(`insert into campeonato(nombre,fecha_inicio,id_categoria)values('${body.nombre}','${body.fecha_inicio}',${body.id_categoria})`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})
router.post('/api/inscribirEquipo', async (req, res, next) => {
    let body=req.body
    let all = await pool.query(`insert into detalle_campeonato (id_equipo,id_campeonato,partidos_jugados,partidos_ganados,partidos_perdidos,partidos_empatados,puntos)values(${body.id_equipo},${body.id_campeonato},0,0,0,0,0)`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})
router.put('/api/actualizarPartido', async (req, res, next) => {
    let body=req.body
    let all = await pool.query(`update partido set goles_local=${body.goles_local}, goles_visitante=${body.goles_visitante}, estado='jugado' where id=${body.id}`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})





module.exports = router