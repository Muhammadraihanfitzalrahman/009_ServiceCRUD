import express from 'express'
import pg from 'pg'
const app = express()
const port = process.env.PORT || 3000
const { Pool } = pg

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)

const pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'mahasiswa',
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT) || 5432,
})

pool.on('error', (err) => {
    console.error('Kesalahan koneksi PostgreSQL:', err)
})

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1')
        res.json({ status: 'ok' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error' })
    }
})

// GET ALL
const getAllBiodata = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM biodata ORDER BY id')
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
}

app.get('/', getAllBiodata)
app.get('/biodata', getAllBiodata)

app.get('/biodata/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM biodata WHERE id=$1',
            [req.params.id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Data tidak ditemukan' })
        }

        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
})

// POST (Tambah Data)
app.post('/biodata', (req, res) => {
    const { id, nama, nim, kelas } = req.body;

    if (!id || !nama || !nim || !kelas) {
        return res.status(400).json({
            message: 'id, nama, nim, dan kelas wajib diisi',
        })
    }

    pool.query(
        'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, nama, nim, kelas]
    )
    .then(result => res.status(201).json(result.rows[0]))
    .catch(err => {
        console.error(err)
        res.status(500).send('Internal Server Error')
    })
});

// PUT (Update Data)
app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    if (!nama || !nim || !kelas) {
        return res.status(400).json({
            message: 'nama, nim, dan kelas wajib diisi',
        })
    }

    pool.query(
        'UPDATE biodata SET nama=$1, nim=$2, kelas=$3 WHERE id=$4 RETURNING *',
        [nama, nim, kelas, id]
    )
    .then(result => {
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Data tidak ditemukan"
            });
        }

        res.json({
            message: "Data berhasil diupdate",
            data: result.rows[0]
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
});

// DELETE (Hapus Data)
app.delete('/biodata/:id', (req, res) => {
    const { id } = req.params;

    pool.query(
        'DELETE FROM biodata WHERE id=$1 RETURNING *',
        [id]
    )
    .then(result => {
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Data tidak ditemukan"
            });
        }

        res.json({
            message: "Data berhasil dihapus",
            data: result.rows[0]
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});