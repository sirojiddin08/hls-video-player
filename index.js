const express = require('express');
const axios = require('axios');
const https = require('https');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Add the CORS middleware

// Disaple https agent
const agent = new https.Agent({
    rejectUnauthorized: false
});

// Create custom Axios instance with agent
const customAxios = axios.create({ 
    httpsAgent: agent
});


app.post('/', (req, res) => {
    const camCode = req.body.cam_code;
    const type = req.body.type;

    console.log(camCode, type);

    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://10.100.9.100/artemis/api/video/v2/cameras/previewURLs',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Ca-Key': '23490096',
            'X-Ca-Signature': 'SA7GmKlzc/locWlusHvGA1rqU2Lvf23CTkg6W5N3bSs='
        },
        data: {
            "cameraIndexCodes": camCode,
            "streamType": 0,
            "protocol": type || "hls"
        }
    };
    customAxios(config)
        .then(function (response) {
            res.send({
                url: response.data.data.list[0].url
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.listen(3000, () => console.log('Server started on port 3000'));