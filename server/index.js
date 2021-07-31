const express= require("express")
const cors= require("cors")
const bodyParser= require ("body-parser")
const dotenv= require ("dotenv")

dotenv.config()
const app= express()
app.use(cors({origin:'*'}))
app.use(bodyParser.json({limit:"10mb"}))
app.use(bodyParser.urlencoded({limit:"10mb", extended:false}))

app.post('/insert', async (req,res)=>{
    const conn= await connect()
    const result= await conn.query('CALL insertUser(?,?,?)',[req.body.firstName, req.body.lastName, req.body.img]) 
    res.send(result)
})

app.post('/update', async (req,res)=>{
    const conn= await connect()
    const result = await conn.query('CALL updateUser(?,?,?,?)',[req.body.id,req.body.firstName,req.body.lastName,req.body.img])
    res.send(result)
})

app.post('/delete', async (req,res)=>{
    const conn= await connect()
    const result = await conn.query('CALL deleteUser(?)',[req.body.id])
    res.send(result)
})

app.get('/query/:query', async (req,res)=>{
    const conn=await connect()
        const [rows]= await conn.query('SELECT * FROM user WHERE FIRSTNAME LIKE ? OR LASTNAME LIKE ? OR ID = ?',['%'+ req.params.query+'%','%'+req.params.query+'%',req.params.query])

    var users=[]
    rows.map((row)=>{
        users.push({nome:row.firstname+' '+row.lastname,id:row.id,img:row.img})
    })
    res.send(users)
})

app.get('/query', async (req,res)=>{
    const conn=await connect() 
    const [rows]= await conn.query('SELECT * FROM user')

    var users=[]
    rows.map((row)=>{
        users.push({nome:row.firstname+' '+row.lastname,id:row.id,img:row.img})
    })
    res.send(users)
})

app.listen(process.env.PORT,()=>{
    console.log("Servidor rodando na porta: " + process.env.PORT)
})

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'crudNextPoint'
    });
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}
