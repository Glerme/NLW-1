const express = require("express")
const server = express()

//configurar pasta publica
server.use(express.static("public"))


//utilizando template engine 
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

//habilitar o uso do req.body
server.use(express.urlencoded({extended: true}))


// Pegar o banco de dados
const db = require("./database/db.js")


//configurar caminhos da aplição
//pagina inicial
//req: requisiçao
//res: resposta
server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    // console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req,res) => { 
    
    //inserir dados no banco de dados
    const query = (`
            INSERT INTO places (
                image,
                name,
                address,
                address2,
                state,
                city,
                items
            ) VALUES (?,?,?,?,?,?,?);
            `)
        
    
        const values = [
            req.body.image,
            req.body.name,
            req.body.address,
            req.body.address2,
            req.body.state,
            req.body.city,
            req.body.items,
        ]
    
        function afterInsertData(err) {
            if (err) {
                return console.log(err)
            }
    
            console.log("Cadastrado com sucesso")
            console.log(this)

            return res.render('create-point.html', {saved: true})
        }
    
        db.run(query, values, afterInsertData)
    
   
    
    
    
    
})





server.get("/search", (req, res) => {
   const search = req.query.search

   if(search == ''){
    //    pesquisa vazia
    return res.render(__dirname + "/views/search.html", {total: 0} )
   }
   
   
   
   
   
//    PEGAR DO BANCO DE DADOS
   
    db.all(`SELECT * FROM places WHERE city LIKE = '%${search}%'`,function(err, rows) {
    if (err) {
        return console.log(err)
    }

    console.log("Aqui estão os seus registros")
    console.log(rows)

    const total = rows.length

    return res.render(__dirname + "/views/search.html", {places: rows, total: total} )
})
    
})



//ligar o servidor
server.listen(3000)
