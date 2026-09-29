const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
res.send("Hello from the webshop backend!");
});

app.listen(PORT, () => {
console.log(`Backend running on port ${PORT}`);
});