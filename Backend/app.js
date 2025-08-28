const express = require('express');
const cors = require('cors');
const studentRoute = require('./routes/student.Routes.js')
const hrRoute = require('./routes/hr.Routes.js');
const jobRoute = require('./routes/job.Routes.js');
const testRoute = require('./routes/question.Routes.js')
const progressRoute = require('./routes/progress.routes.js')
const app = express();
const connectDB = require('./config/database.js');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use('/api/students/', studentRoute);
app.use('/api/hr/', hrRoute);
app.use('/api/job/', jobRoute)
app.use('/api/questions/', testRoute);
app.use('/api/progress/', progressRoute);

const PORT = 5000 || process.env.PORT;
app.listen(PORT,()=>{
   console.log(`Server is Running ai Port ${PORT}`)
})