const functions = require("firebase-functions");
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const cors = require('cors')({ origin: true });

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

                    // Create a new PDFDocument
                    const pdfDoc = await PDFDocument.create();

                    // Set the font for the document
                    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

                    // Add a new page to the document
                    const page = pdfDoc.addPage([600, 800]);

                    let cursor = 700;
                    // Draw text on the page
                    if (jsonObject.hasOwnProperty('esdeveniment')) {
                        console.log("escrivint esdeveniment");
                        console.log(jsonObject.esdeveniment);
                        page.drawText(jsonObject.esdeveniment+"\n", {
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




