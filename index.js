const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const router = express.Router();

const port = 3000;
app.use(cors());
app.use(express.json());
app.use("/api", router);

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "db_test01"
});

router.get('/', (req, res) => {
    res.send('Hello');
}); 

router.get('/users', (req, res) => {
    const q = "SELECT * FROM tb_user";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(results);
    });
});

router.post('/create', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    db.query(`
        INSERT INTO tb_user (name, email, password) 
        VALUES (?, ?, ?)
    `, [name, email, password], (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.send("registered success");
        }
    })
});

router.get('/userdetail/:id', (req, res) => {
    const id = req.params.id;
    
    db.query(`
        SELECT * FROM tb_user WHERE id = ?
    `, [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(results);
    });
});

router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const q = "UPDATE tb_user SET name = ?, email = ?, password = ? WHERE id = ?";

    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];

    db.query(q, [...values, userId],
        (err, results) => {
            if (err) return res.send(err);
            return res.json(results);
        });
    
    const updateVal = [...values, userId];
    console.log(updateVal);
});

router.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    const q = "DELETE FROM tb_user WHERE id = ?";

    db.query(q, [userId], (err, results) => {
        if (err) return res.send(err);
        return res.json(results);
    });
})



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});