const app = require("./app")
require('dotenv').config()


app.listen(process.env.PORT,()=>{
    console.log(`server is running at PORT ${process.env.PORT}`)
})