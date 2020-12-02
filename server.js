const express = require('express');
const app = express();
const port = 3003;

app.use('/', express.static('personal-budget-app'));

app.get('/', (req, res) => {
    res.sendStatus('Hello world');
});

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});