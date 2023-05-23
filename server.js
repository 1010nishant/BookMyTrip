const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// console.log(process.env)


mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(con => {
    console.log('db connection successful')
    console.log(con.connections)
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app is running on ${port}....`);
})