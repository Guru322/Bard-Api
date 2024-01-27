import express from 'express';
import Bard from 'bard-ai';
import fetch from 'node-fetch'
import fs from 'fs'; 

const app = express();
const port = process.env.PORT || 8080;

const Cookies1 = '';  //put your cookie named __Secure-1PSID
const Cookies2 = '';  //put your cookie named __Secure-1PSIDTS

let myBard = new Bard({
    "__Secure-1PSID": Cookies1,
    "__Secure-1PSIDTS": Cookies2,
});

app.get('/', async (req, res) => {
    res.send({Creator: 'Guru'});
});

app.get('/bard', async (req, res) => {
    const text = req.query.text;
    if (!text) {
        res.send({result: 'Enter Text Plz'});
    }

    if (!Cookies1) {
        res.send({result: 'Enter ( COOKIE_1PSID or COOKIE_1PSIDTS ) Plz'});
    } 

    if (!Cookies2) {
        res.send({result: 'Enter ( COOKIE_1PSID or COOKIE_1PSIDTS ) Plz'});
    }

    try {
        let myChatContinued = myBard.createChat({
            conversationID: 'c_149255c849e865ec',
            responseID: 'r_fbfd2bf1fb0f34bb',
            choiceID: 'rc_2a0e2dc652382483',
            _reqID: '100000'
        });

        let databard = await myChatContinued.ask(text);

        res.send({result: databard});
} catch (error) {
    console.error('Error:', error);
    res.send({result: 'Error in Api Response'});
}
});

app.get('/bardimg', async (req, res) => {
    const text = req.query.text;
    const image = req.query.image;

    if (!text) {
        res.send({ result: 'Enter Text Plz' });
        return;
    }

    if (!image) {
        res.send({ result: 'Enter Image Plz' });
        return;
    }

    try {
        const imageResponse = await fetch(image);
        const imageBuffer = await imageResponse.buffer();
        fs.writeFileSync('./temp_image.png', imageBuffer);
        const imgd = await myBard.ask(text, {
            image: "./temp_image.png",
        });
        res.send({ result: imgd });
        fs.unlinkSync('./temp_image.png');
    } catch (error) {
        console.error('Error:', error);
        res.send({ result: 'Error in Image Processing' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});