const app = require('./src/app')
const connectDB = require('./src/db/db')
const path = require('path');
const express = require("express")

connectDB()

app.use(express.static(path.join(__dirname, 'public')));

// React Router fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`)
})