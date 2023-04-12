const express = require ('express');
const cors = require('cors')
const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
const app = express();
app.use(express.json());
app.use(cors());

// setting up database
const sequelize = new Sequelize(
    'chama',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

// creating db connection
sequelize.authenticate().then(()=>{
    console.log('Connection successful')
}).catch((error)=>{
    console.log('Connection to database failed', error)
});

// define the tables in the databases
const members = sequelize.define('members',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        // allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique : true
    },
    Gender: {
        type: DataTypes.ENUM('Male','Female'),
        allowNull: true
    }
});

//  create the table 
sequelize.sync().then(()=>{
    console.log('Table: members')
}).catch((error)=>{
    console.error('something went wrong::', error)
})

// create new user 
app.post('/new', (req, res)=>{
    const {firstName, lastName, phone, email,Gender} = req.body
    members.create({firstName, lastName, phone,email,Gender}).then((member)=>{
        // console.log(member)
        res.send('User added')
    }).catch((error)=>{
        console.log('Failed to add user::', error)
    })
})

// get all users from the database
app.get('/members', (req, res)=>{
    members.findAll().then((members)=>{
        // console.log(members)
        res.send(members)
    }).catch((error)=>{
        console.log('An error occured::',error)
    })
});

// delete a user 
app.delete('/members/:id', (req, res)=>{
const {id} = req.params
members.destroy({ where: {id}}).then(()=>{
console.log(`user with id ${id} removed`)
res.send(`user with id ${id} removed`)
}).catch((error)=>{
    console.log(error)
})
})

//getting members by id
app.get("/members/:id",(req, res)=>{
    const {id} = req.params
    members.findOne({where:{id}}).then((member)=>{
        if(!member){
            res.send('user not found')
        }
        res.send(member)
    }).catch((error)=>{
        if(!res.headersSent){
            res.send("something went wrong")
            console.log(error)
        }
    })
})

// update details where necessary
app.patch("/members/:id/update",(req, res)=>{
    const {id} = req.params
    const {firstName, lastName, phone, email, Gender} = req.body
    members.update({firstName, lastName, phone, email, Gender}, {where:{id}}).then((member)=>{
        console.log(member)
        res.send('Member data updated')
    }).catch((error)=>{
        console.log(error)
    })
})

// starting the server 
app.listen(5000,  ()=>{
    console.log('App booted on http://localhost:5000')
});