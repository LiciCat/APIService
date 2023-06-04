const functions = require("firebase-functions");
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const cors = require('cors')({ origin: true });
const axios = require('axios');
const { ImageType } = require('pdf-lib');
const https = require('https');


exports.generatePDF = functions.https.onRequest(async (req, res) => {

    if (req.method === 'GET') {
        // Handle GET request
        //res.send('Hello World! This tests the PDF');

        console.log("--------------------NEW REQUEST--------------------");

        cors(req, res, async () => {

            // Create a new PDFDocument
            const pdfDoc = await PDFDocument.create();

            // Set the font for the document
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            // Add a new page to the document
            const page = pdfDoc.addPage([600, 800]);

            // Draw text on the page

            page.drawText('Hello, World!', {
                x: 50,
                y: 700,
                size: 20,
                font,
                color: rgb(0, 0, 0), // red color
            });

            // Get the PDF file as a buffer
            const pdfBytes = await pdfDoc.save();

            console.log("PDF BYTES:");
            console.log(pdfBytes);

            // Set the response headers to indicate that this is a PDF document
            res.setHeader('Content-Disposition', 'attachment; filename=pdfDoc.pdf');

            console.log("HEADERS:");
            console.log(res.getHeaders());

            res.end(pdfBytes);

        });
    }



    else if (req.method === 'POST') {
        // Handle POST request

        console.log("--------------------NEW REQUEST--------------------");

        cors(req, res, async () => {

            const data = req.body;

            console.log("Data:", data);
            console.log("Type of Data:", typeof data);

            if (data) {
                try {
                    let jsonObject;
                    if (typeof data === "string") {
                        jsonObject = JSON.parse(data);
                    }
                    else if (data !== null && typeof data === "object"){
                        jsonObject = data //JSON.stringify(data);
                    }
                    else {
                        console.error('Invalid data format');
                        res.status(400).send('Invalid data format');
                    }
                    //console.log("INICIANT PROCÉS (PARSING):");
                    //console.log("PARSED");

                    // Create a new PDFDocument
                    const pdfDoc = await PDFDocument.create();

                    // Set the font for the document
                    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

                    // Add a new page to the document
                    const page = pdfDoc.addPage([600, 800]);
                    const { width, height } = page.getSize()
                    const fontSize = 18

                    let cursor = 720;
                    // Draw text on the page
                    if (jsonObject.hasOwnProperty('esdeveniment')) {
                        console.log("escrivint esdeveniment");
                        console.log(jsonObject.esdeveniment);

                        page.drawText(jsonObject.esdeveniment, {
                            x: 66,
                            maxWidth: page.getWidth()*0.56,
                            y: cursor,
                            size: fontSize,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 71;

                    }

                    if (jsonObject.hasOwnProperty('data')) {
                        console.log("escrivint data");
                        console.log(jsonObject.data);
                        page.drawText(jsonObject.data, {
                            x: 66,
                            y: cursor,
                            size: fontSize,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 20;
                    }

                    if (jsonObject.hasOwnProperty('hora')) {
                        console.log("escrivint hora");
                        console.log(jsonObject.hora);
                        page.drawText(jsonObject.hora, {
                            x: 66,
                            y: cursor,
                            size: fontSize,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 20;
                    }

                    if (jsonObject.hasOwnProperty('nom')) {
                        console.log("escrivint nom");
                        console.log(jsonObject.nom);
                        page.drawText(jsonObject.nom, {
                            x: 66,
                            y: cursor,
                            size: fontSize,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 20;
                    }

                    if (jsonObject.hasOwnProperty('qr')) {
                        console.log("dibuixant QR");

                        const qr = jsonObject.qr
                        const qrCodeBase64 = qr.slice(22);

                        //console.log(qrCodeBase64);

                        // Decode the base64 string into a Uint8Array
                        const qrCodeBytes = Uint8Array.from(atob(qrCodeBase64), (c) => c.charCodeAt(0));

                        // Embed the QR code image in the PDF
                        const qrCodeImage = await pdfDoc.embedPng(qrCodeBytes);
                        const qrCodeDims = qrCodeImage.scale(0.38);
                        //x:page.getWidth() ; qrCodeDims.width ;y: page.getHeight() ; qrCodeDims.height
                        // Draw the QR code image on the page
                        page.drawImage(qrCodeImage, {
                            x: page.getWidth()*0.66, //page.getWidth() - 50 - qrCodeDims.width, /// 2 - qrCodeDims.width / 2,
                            y: 750 - qrCodeDims.height, //page.getHeight() / 2 + qrCodeDims.height / 2 + 100,
                            width: qrCodeDims.width,
                            height: qrCodeDims.height,
                        });
                    }

                    if (jsonObject.hasOwnProperty('foto')) {
                        console.log("dibuixant foto");

                        const jpgUrl = jsonObject.foto;
                        const agent = new https.Agent({rejectUnauthorized: false});
                        const response = await axios.get(jpgUrl, {responseType: 'arraybuffer', httpsAgent: agent});
                        const jpgImageBytes = response.data;
                        console.log("IMAGE:");
                        //console.log(jpgImageBytes);

                        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
                        const jpgDims = jpgImage.scale(0.5);

                        page.drawImage(jpgImage, {
                            x: page.getWidth() / 2 - jpgDims.width / 2,
                            y: page.getHeight() / 2 - jpgDims.height,// / 2 + 150,
                            width: jpgDims.width,
                            height: jpgDims.height,
                        });

                                    }


                    /*

                    // Add a new page to the document
                    const page = pdfDoc.addPage([600, 800]);

                    let cursor = 700;
                    // Draw text on the page
                    if (jsonObject.hasOwnProperty('esdeveniment')) {
                        console.log("escrivint esdeveniment");
                        console.log(jsonObject.esdeveniment);
                        page.drawText(jsonObject.esdeveniment, {
                            x: 50,
                            y: cursor,
                            size: 20,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 20;
                    }

                    if (jsonObject.hasOwnProperty('data')) {
                        console.log("escrivint data");
                        console.log(jsonObject.data);
                        page.drawText(jsonObject.data, {
                            x: 50,
                            y: cursor,
                            size: 20,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 20;
                    }

                    if (jsonObject.hasOwnProperty('hora')) {
                        console.log("escrivint hora");
                        console.log(jsonObject.hora);
                        page.drawText(jsonObject.hora, {
                            x: 50,
                            y: cursor,
                            size: 20,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 20;
                    }

                    if (jsonObject.hasOwnProperty('nom')) {
                        console.log("escrivint nom");
                        console.log(jsonObject.nom);
                        page.drawText(jsonObject.nom, {
                            x: 50,
                            y: cursor,
                            size: 20,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 20;
                    }

                    if (jsonObject.hasOwnProperty('qr')) {
                        console.log("dibuixant QR");

                        const qr = jsonObject.qr
                        const qrCodeBase64 = qr.slice(22);

                        //console.log(qrCodeBase64);

                        // Decode the base64 string into a Uint8Array
                        const qrCodeBytes = Uint8Array.from(atob(qrCodeBase64), (c) => c.charCodeAt(0));

                        // Embed the QR code image in the PDF
                        const qrCodeImage = await pdfDoc.embedPng(qrCodeBytes);
                        const qrCodeDims = qrCodeImage.scale(0.5);

                        // Draw the QR code image on the page
                        page.drawImage(qrCodeImage, {
                            x: page.getWidth() / 2 - qrCodeDims.width / 2,
                            y: page.getHeight() / 2 - qrCodeDims.height / 2 - 100,
                            width: qrCodeDims.width,
                            height: qrCodeDims.height,
                        });
                    }

                    if (jsonObject.hasOwnProperty('foto')) {
                        console.log("dibuixant foto");

                        const jpgUrl = jsonObject.foto;
                        const agent = new https.Agent({rejectUnauthorized: false});
                        const response = await axios.get(jpgUrl, {responseType: 'arraybuffer', httpsAgent: agent});
                        const jpgImageBytes = response.data;
                        console.log("IMAGE:");
                        //console.log(jpgImageBytes);

                        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
                        const jpgDims = jpgImage.scale(0.5);

                        page.drawImage(jpgImage, {
                            x: page.getWidth() / 2 - jpgDims.width / 2,
                            y: page.getHeight() / 2 - jpgDims.height / 2 + 150,
                            width: jpgDims.width,
                            height: jpgDims.height,
                        });

                    }

                     */

                    // Get the PDF file as a buffer
                    const pdfBytes = await pdfDoc.save();

                    console.log("PDF BYTES:");
                    console.log(pdfBytes);

                    // Set the response headers to indicate that this is a PDF document
                    res.setHeader('Content-Disposition', 'attachment; filename=pdfDoc.pdf');

                    console.log("HEADERS:");
                    console.log(res.getHeaders());

                    console.log("SENDING:");
                    res.end(pdfBytes);
                    console.log("SENT:");


                }  catch (error) {
                    console.error('Invalid JSON string:', error);
                    res.status(400).send('Invalid JSON: '+error);
                }
            }    else {
                console.error('No data provided');
                res.status(400).send('No data provided');
            }
        });

        console.log('-----------DONE--------------');

    }
    else {
        res.status(405).send('Method Not Allowed');
    }
});



//------------------------------------------------------------------------------


exports.generatePDFLicitacio = functions.https.onRequest(async (req, res) => {

    if (req.method === 'GET') {
        // Handle GET request
        //res.send('Hello World! This tests the PDF');

        console.log("--------------------NEW REQUEST--------------------");

        cors(req, res, async () => {

            // Create a new PDFDocument
            const pdfDoc = await PDFDocument.create();

            // Set the font for the document
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            // Add a new page to the document
            const page = pdfDoc.addPage([600, 800]);

            // Draw text on the page

            page.drawText('Hello, World!', {
                x: 50,
                y: 700,
                size: 20,
                font,
                color: rgb(0, 0, 0), // red color
            });

            // Get the PDF file as a buffer
            const pdfBytes = await pdfDoc.save();

            console.log("PDF BYTES:");
            console.log(pdfBytes);

            // Set the response headers to indicate that this is a PDF document
            res.setHeader('Content-Disposition', 'attachment; filename=pdfDoc.pdf');

            console.log("HEADERS:");
            console.log(res.getHeaders());

            res.end(pdfBytes);

        });
    }
    
    else if (req.method === 'POST') {
        // Handle POST request

        console.log("--------------------NEW REQUEST--------------------");

        cors(req, res, async () => {

            const data = req.body;

            console.log("Data:", data);
            console.log("Type of Data:", typeof data);

            let texter;
            if (data) {
                try {
                    let jsonObject;
                    if (typeof data === "string") {
                        jsonObject = JSON.parse(data);
                    } else if (data !== null && typeof data === "object") {
                        jsonObject = data //JSON.stringify(data);
                    } else {
                        console.error('Invalid data format');
                        res.status(400).send('Invalid data format');
                    }
                    //console.log("INICIANT PROCÉS (PARSING):");
                    //console.log("PARSED");

                    // Create a new PDFDocument
                    const pdfDoc = await PDFDocument.create();

                    // Set the font for the document
                    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

                    // Add a new page to the document
                    const page = pdfDoc.addPage([600, 800]);
                    const {width, height} = page.getSize()
                    const fontSize = 18

                    let cursor = 720;
                    // Draw text on the page
                    if (jsonObject.hasOwnProperty('title')) {
                        console.log("escrivint title");
                        console.log(jsonObject.title);
                        page.drawText(jsonObject.title, {
                            x: 66,
                            maxWidth: page.getWidth() - 135,
                            y: cursor,
                            size: fontSize + 2,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 50;
                    }

                    if (jsonObject.hasOwnProperty('denomination')) {
                        console.log("escrivint denomination");
                        console.log(jsonObject.denomination);
                        page.drawText(jsonObject.denomination, {
                            x: 66,
                            maxWidth: page.getWidth() - 135,
                            y: cursor,
                            size: fontSize + 2,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 81;
                    }

                    if (jsonObject.hasOwnProperty('date')) {
                        console.log("escrivint date");
                        console.log(jsonObject.date);
                        page.drawText(jsonObject.date, {
                            x: 66,
                            y: cursor,
                            size: fontSize,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 20;
                    }

                    if (jsonObject.hasOwnProperty('price')) {
                        console.log("escrivint price");
                        console.log(jsonObject.price);
                        texter = jsonObject.price + "€"
                        page.drawText(texter, {
                            x: 66,
                            y: cursor,
                            size: fontSize,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 25;
                    }

                    if (jsonObject.hasOwnProperty('description')) {
                        console.log("escrivint description");
                        console.log(jsonObject.description);
                        page.drawText(jsonObject.description, {
                            x: 66,
                            maxWidth: page.getWidth() - 135,
                            y: cursor,
                            size: fontSize-5,
                            font,
                            color: rgb(0, 0, 0), // black color
                        });
                        cursor = cursor - 20;
                    }

                    /*
                    if (jsonObject.hasOwnProperty('qr')) {
                        console.log("dibuixant QR");

                        const qr = jsonObject.qr
                        const qrCodeBase64 = qr.slice(22);

                        //console.log(qrCodeBase64);

                        // Decode the base64 string into a Uint8Array
                        const qrCodeBytes = Uint8Array.from(atob(qrCodeBase64), (c) => c.charCodeAt(0));

                        // Embed the QR code image in the PDF
                        const qrCodeImage = await pdfDoc.embedPng(qrCodeBytes);
                        const qrCodeDims = qrCodeImage.scale(0.38);
                        //x:page.getWidth() ; qrCodeDims.width ;y: page.getHeight() ; qrCodeDims.height
                        // Draw the QR code image on the page
                        page.drawImage(qrCodeImage, {
                            x: page.getWidth()*0.66, //page.getWidth() - 50 - qrCodeDims.width, /// 2 - qrCodeDims.width / 2,
                            y: 750 - qrCodeDims.height, //page.getHeight() / 2 + qrCodeDims.height / 2 + 100,
                            width: qrCodeDims.width,
                            height: qrCodeDims.height,
                        });
                    }
                    */

                    /*
                    if (jsonObject.hasOwnProperty('foto')) {
                        console.log("dibuixant foto");

                        const jpgUrl = jsonObject.foto;
                        const agent = new https.Agent({rejectUnauthorized: false});
                        const response = await axios.get(jpgUrl, {responseType: 'arraybuffer', httpsAgent: agent});
                        const jpgImageBytes = response.data;
                        console.log("IMAGE:");
                        //console.log(jpgImageBytes);

                        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
                        const jpgDims = jpgImage.scale(0.5);

                        page.drawImage(jpgImage, {
                            x: page.getWidth() / 2 - jpgDims.width / 2,
                            y: page.getHeight() / 2 - jpgDims.height,// / 2 + 150,
                            width: jpgDims.width,
                            height: jpgDims.height,
                        });

                    }
                    */
                    // Get the PDF file as a buffer
                    const pdfBytes = await pdfDoc.save();

                    console.log("PDF BYTES:");
                    console.log(pdfBytes);

                    // Set the response headers to indicate that this is a PDF document
                    res.setHeader('Content-Disposition', 'attachment; filename=pdfDoc.pdf');

                    console.log("HEADERS:");
                    console.log(res.getHeaders());

                    console.log("SENDING:");
                    res.end(pdfBytes);
                    console.log("SENT:");


                } catch (error) {
                    console.error('Invalid JSON string:', error);
                    res.status(400).send('Invalid JSON: ' + error);
                }
            } else {
                console.error('No data provided');
                res.status(400).send('No data provided');
            }
        });

        console.log('-----------DONE--------------');

    }
    else {
        res.status(405).send('Method Not Allowed');
    }
});
