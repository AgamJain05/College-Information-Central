// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js";









dotenv.config({
    path: './.env'
})



// const server = express()

// checking if the server is running on mobile or not
// app.get('/api/endpoint', (req, res) => {
//     res.json({ message: 'Hello from backend!' });
//   });
  



// server.use(express.json())
connectDB()

.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
      
    
})

// .then(() => {
//     const PORT = process.env.PORT || 8000;
//     app.listen(PORT, '0.0.0.0', () => {
//         console.log(`⚙️ Server is running at http://0.0.0.0:${PORT}`);
//     });
// })
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
