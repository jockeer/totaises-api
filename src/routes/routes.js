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

router.get('/api/traerEquipos/:id', async (req, res, next) => {
    let all = await pool.query(`select * from equipo where id_categoria=${req.params.id}`);
    json = all.rows
    // console.log(json)
    res.json(all.rows)
})




module.exports = router