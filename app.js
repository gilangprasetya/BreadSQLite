const express = require('express')
const sqlite3 = require('sqlite3').verbose()
// const fs = require('fs')
var bodyParser = require('body-parser')

const app = express()
const port = 3000

app.set('view engine', 'ejs')

const db = new sqlite3.Database('bread.db')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// let isi = fs.readFileSync('data.json')
// let data = JSON.parse(isi)

app.use(express.static('public'))

app.get('/', (req, res) => {
  const url = req.url == '/' ? '/?page=1' : req.url
  const page = req.query.page || 1
  const limit = 3
  const offset = (page - 1) * limit

  let sqlcount = `SELECT COUNT(*) AS count FROM bread`
  const params = []
  const sqlsearch = []

  if (req.query.id && req.query.checkboxID) {
    params.push(req.query.id)
    sqlsearch.push(`id = $${params.length}`)
  }

  if (req.query.string && req.query.checkboxString) {
    params.push(`%${req.query.string}%`)
    sqlsearch.push(`breadStr LIKE $${params.length}`)
  }

  if (req.query.integer && req.query.checkboxInteger) {
    params.push(req.query.integer)
    sqlsearch.push(`breadInt = $${params.length}`)
  }

  if (req.query.float && req.query.checkboxFloat) {
    params.push(req.query.float)
    sqlsearch.push(`breadFloat = $${params.length}`)
  }

  if (req.query.startDate && req.query.endDate && req.query.checkboxDate) {
    params.push(req.query.startDate)
    params.push(req.query.endDate)
    sqlsearch.push(`tanggal BETWEEN $${params.length - 1} AND $${params.length}`)
  }

  if (req.query.boolean && req.query.checkboxBoolean ) {
    params.push(req.query.boolean)
    sqlsearch.push(`breadBoolean = $${params.length}`)
  }

  if (params.length > 0) {
    sqlcount += ` WHERE ${sqlsearch.join(' AND ')}`
  }

  db.all(sqlcount, params, (err, data) => {
    const pages = Math.ceil(data[0].count / limit)
    sql = `SELECT * FROM bread`
    if (params.length > 0) {
      sql += ` WHERE ${sqlsearch.join(' AND ')}`
    }
    params.push(limit, offset)
    sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`

    db.all(sql, params, (err, data) => {
      res.render('index', { data, pages, page, offset, query: req.query, url })
    })
  })
})


app.get('/add', (req, res) => {
  res.render('add')
})

app.post('/add', (req, res) => {
  const sqltambah = `INSERT INTO bread (breadStr, breadInt, breadFloat, tanggal, breadBoolean) VALUES (?,?,?,?,?)`;
  const params = [req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean];

  db.run(sqltambah, params, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      res.redirect('/');
    }
  });
});


app.get('/delete/:id', (req, res) => {
  const sqlhapus = `DELETE FROM bread WHERE id = ?`
  const id = req.params.id
  db.run(sqlhapus, [id], err => {
    if (err) {
      console.error(err.message)
    } else {
      res.redirect('/')
    }
  })
})

app.get('/edit/:id', (req, res) => {
  const sqledit = `SELECT * FROM bread WHERE id = ?`
  const id = req.params.id
  db.get(sqledit, [id], (err, item) => {
    if (err) {
      console.error(err.message)
    } else {
      res.render('edit', { item })
    }
  })
})

app.post('/edit/:id', (req, res) => {
  const sqlupdate = `UPDATE bread SET breadStr = ?, breadInt = ?, breadFloat = ?, tanggal = ?, breadBoolean = ? WHERE id = ?`
  const id = req.params.id
  db.run(sqlupdate, [req.body.string, req.body.integer, req.body.float, req.body.date ? req.body.date : "kosong", req.body.boolean, id], (err, rows) => {
    if (err) {
      console.error(err.message)
    } else {
      res.redirect('/')
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})