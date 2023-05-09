const functions = require("firebase-functions");
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require("fs");
const cors = require('cors')({ origin: true });
//const fs = require('fs');

exports.generatePDF = functions.https.onRequest(async (req, res) => {

    if (req.method === 'GET') {
        // Handle GET request
        //res.send('Hello World! This tests the PDF');


        console.log("--------------------NEW REQUEST--------------------");

        cors(req, res, async () => {
            const {data} = req.body;

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
                size: 50,
                font,
                color: rgb(1, 0, 0), // red color
            });



            // Get the PDF file as a buffer
            const pdfBytes = await pdfDoc.save();

            console.log("PDF BYTES:");
            console.log(pdfBytes);


            // Set the response headers to indicate that this is a PDF document
            //res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=pdfDoc.pdf');

            console.log("HEADERS:");
            console.log(res.getHeaders());
/*
            // Send the PDF bytes array as the response body
            var response = {
                "pdf": pdfBytes
            };
             */
            res.end(pdfBytes);




        });
    }



    else if (req.method === 'POST') {
        // Handle POST request

        console.log("--------------------NEW REQUEST--------------------");

        cors(req, res, async () => {
            const {data} = req.body;

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
                size: 50,
                font,
                color: rgb(1, 0, 0), // red color
            });

            // Get the PDF file as a buffer
            const pdfBytes = await pdfDoc.save();

            console.log("PDF BYTES:");
            console.log(pdfBytes);


            // Set the response headers to indicate that this is a PDF document
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=pdfDoc.pdf');

            console.log("HEADERS:");
            console.log(res.getHeaders());

            // Send the PDF bytes array as the response body
            res.send(pdfBytes);
        });
    }
    else {
        res.status(405).send('Method Not Allowed');
    }
});




