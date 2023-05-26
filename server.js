const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// console.log(process.env)


testTour.save().then(doc => {
    console.log(doc)
}).catch(err => {
    console.log('error--', err)
})

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('db connection successful')
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app is running on ${port}....`);
})