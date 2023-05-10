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
                    const jsonObject = JSON.parse(data);

                    const qrCodeBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAZoAAAGaAQAAAAAefbjOAAADDUlEQVR4nO2cS27bShBFT6UJeEgBbwFeCrUzI0vKDsilaAEGmkMDFO4bdHWTjkeJDEqhigODHx2oGyrU51bRJv74mH78OQMBBRRQQAEFFNAxIfOjw87lssPsBHaeO2CuHzjfZXkB7Q8NkqQMTCfQCGjkahrL8yRJ0mdov+UFtD80NwfA1c+GnGT2+mGA+427LS+gu0FSTmLIHkk0zh5Jvv2bAvo3oJI4TK8fBv2CnUlfFYt/bE8B/Q3US2v2wHDpAJLKJYCk5X7LC2hvaDIzLy6KU0hiuHTYW04CrqXUuNfyAtoPKtniGhgES40am3ufI8eD7ymgWyBKVTmsIaFfSjG6eUqvkm2WKnV88D0FdAvEqjNo7CU3hn7xxMHtwM+KKhEWcWSo+ohcswf6hWIRYyszytNqL2ERh4aaj/DfXGP5s6Cxr55hxIWK8BHHh2ogaE5hyOBRo2pVGklyAwmLODrUcsdlaxvKqXoLoDiP8BHPAVU7IHmnq1UdUqb5jeQpRFjE00C9y9b6ecKbXGeS7C1fzZ/O0Q1/Imi4vIjJOmDta7Rjsg6m11CxnwcyOwH0kr1J0rgxi+TJREk577K8gHZXsaF/N4aLocnSwqBrJ+YOwYeVy2n1Gg++p4BugZqKrSpOfc4xi1KZkzzHjMzy6FCrOVsjI9MiRNKqYrtMFRZxdGjT6fK+Rv5Nkqodjo1k8eB7CugWqM1OJhl0i2DpoM/A/CImA6YzMPzqsGHcd3kB7Q61ThfeyGh5hKtW+tIcDx9xaGg7AVEShxo/vK/RBic8foRFHBxCn49yc2MW+m1mIizi4FDJI6rUkBaG0bUHGy4G9O8dzP8tsE5lP/ieAvoGqLSxMuWdLnvL4PN17Sz6Gs8B1VpjPsHwC2B+kQGI+eQTt0Wu7HP1JQ++p4Bugbqvt67G9CqMfukoZWn/3om5ydgPvqeAvhPyOZnZX/ArrVBI8mbYnZcX0G5Qm5casr/EtTY7i21E7/M5oM10PrRelitU67t9dS43qs/DQxb/mSyggAIKKKCAAvpL6H8z7GIAtV7FHAAAAABJRU5ErkJggg=='

                        const jpgUrl = 'http://agenda.cultura.gencat.cat/content/dam/agenda/articles/2023/04/14/006/000men(3).jpg';
                        const agent = new https.Agent({ rejectUnauthorized: false });
                        const response = await axios.get(jpgUrl, { responseType: 'arraybuffer', httpsAgent: agent });
                        const jpgImageBytes = response.data;
                    console.log("IMAGE:");
                    console.log(jpgImageBytes);




                    // Create a new PDFDocument
                        const pdfDoc = await PDFDocument.create();


                        const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
                        const jpgDims = jpgImage.scale(0.5);

                    // Set the font for the document
                    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

                    // Add a new page to the document
                    const page = pdfDoc.addPage([600, 800]);

                    // Decode the base64 string into a Uint8Array
                    const qrCodeBytes = Uint8Array.from(atob(qrCodeBase64), (c) => c.charCodeAt(0));

                    // Embed the QR code image in the PDF
                    const qrCodeImage = await pdfDoc.embedPng(qrCodeBytes);
                    const qrCodeDims = qrCodeImage.scale(0.5);

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


                        page.drawImage(jpgImage, {
                            x: page.getWidth() / 2 - jpgDims.width / 2,
                            y: page.getHeight() / 2 - jpgDims.height / 2 + 250,
                            width: jpgDims.width,
                            height: jpgDims.height,
                        });


                    // Draw the QR code image on the page
                    page.drawImage(qrCodeImage, {
                        x: page.getWidth() / 2 - qrCodeDims.width / 2,
                        y: page.getHeight() / 2 - qrCodeDims.height / 2,
                        width: qrCodeDims.width,
                        height: qrCodeDims.height,
                    });


/*
                    //IMATGES:
                    const qrCodeImage = await axios.get(
                        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZoAAAGaAQAAAAAefbjOAAADDUlEQVR4nO2cS27bShBFT6UJeEgBbwFeCrUzI0vKDsilaAEGmkMDFO4bdHWTjkeJDEqhigODHx2oGyrU51bRJv74mH78OQMBBRRQQAEFFNAxIfOjw87lssPsBHaeO2CuHzjfZXkB7Q8NkqQMTCfQCGjkahrL8yRJ0mdov+UFtD80NwfA1c+GnGT2+mGA+427LS+gu0FSTmLIHkk0zh5Jvv2bAvo3oJI4TK8fBv2CnUlfFYt/bE8B/Q3US2v2wHDpAJLKJYCk5X7LC2hvaDIzLy6KU0hiuHTYW04CrqXUuNfyAtoPKtniGhgES40am3ufI8eD7ymgWyBKVTmsIaFfSjG6eUqvkm2WKnV88D0FdAvEqjNo7CU3hn7xxMHtwM+KKhEWcWSo+ohcswf6hWIRYyszytNqL2ERh4aaj/DfXGP5s6Cxr55hxIWK8BHHh2ogaE5hyOBRo2pVGklyAwmLODrUcsdlaxvKqXoLoDiP8BHPAVU7IHmnq1UdUqb5jeQpRFjE00C9y9b6ecKbXGeS7C1fzZ/O0Q1/Imi4vIjJOmDta7Rjsg6m11CxnwcyOwH0kr1J0rgxi+TJREk577K8gHZXsaF/N4aLocnSwqBrJ+YOwYeVy2n1Gg++p4BugZqKrSpOfc4xi1KZkzzHjMzy6FCrOVsjI9MiRNKqYrtMFRZxdGjT6fK+Rv5Nkqodjo1k8eB7CugWqM1OJhl0i2DpoM/A/CImA6YzMPzqs'
                    );

                    const qrCodeImageEmbed = await pdfDoc.embedPng(qrCodeImage.data);

                    page.drawImage(qrCodeImageEmbed, {
                        x: 250, // X-coordinate position of the image on the page
                        y: 100, // Y-coordinate position of the image on the page
                        width: 200, // Width of the image
                        height: 200, // Height of the image
                    });


                    console.log("GETTING IMAGES");

                    const imageBytes = await axios.get(
                        'http://agenda.cultura.gencat.cat/content/dam/agenda/articles/2023/04/14/006/000men(3).jpg',
                        { responseType: 'arraybuffer' }
                    );

                    console.log("EMBEDING IMAGES");

                    const imageEmbed = await pdfDoc.embedJpg(imageBytes.data);

                    console.log("WRITING IMAGES");

                    page.drawImage(imageEmbed, {
                        x: 100, // X-coordinate position of the image on the page
                        y: 100, // Y-coordinate position of the image on the page
                        width: 200, // Width of the image
                        height: 200, // Height of the image
                    });
*/
                    // Get the PDF file as a buffer
                    const pdfBytes = await pdfDoc.save();

                    console.log("PDF BYTES:");
                    console.log(pdfBytes);

                    // Set the response headers to indicate that this is a PDF document
                    res.setHeader('Content-Disposition', 'attachment; filename=pdfDoc.pdf');

                    console.log("HEADERS:");
                    console.log(res.getHeaders());

                    res.end(pdfBytes);

                } catch (error) {
                    console.error('Invalid JSON string:', error);
                    res.status(400).send('Invalid JSON');
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




