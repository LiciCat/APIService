
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//const functions = require('firebase-functions');

//exports.helloWorld = functions.https.onRequest((req, res) => {
//    res.send('Hello World!');
//});
const functions = require('firebase-functions');
const PDFDocument = require('pdfkit');
const blobStream  = require('blob-stream');

exports.generatePDF = functions.https.onRequest((req, res) => {
    // Parse the JSON request
    const data = req.body;

    // Create a new PDF document
    const doc = new PDFDocument();
    const stream = doc.pipe(blobStream());

    // Add content to the PDF document
    doc.fontSize(25).text(data.title);
    doc.fontSize(16).text(data.description);

    // Finalize the PDF document
    doc.end();

    // Return the PDF document to the client
    stream.on('finish', () => {
        const pdf = stream.toBlob('application/pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
        res.send(pdf);
    });
});

//const functions = require('firebase-functions');
const pdfMake = require('pdfmake');
//const cors = require('cors')({origin: true});

/*
exports.createPDF = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        // Get data from the request body
        //const data = request.body;

        // Sample JSON object
        const data = {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "1234567890"
        };


        // Define the PDF document definition
        const docDefinition = {
            content: [
                { text: 'User Information', style: 'header' },
                { text: `Name: ${data.name}` },
                { text: `Email: ${data.email}` },
                { text: `Phone: ${data.phone}` }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                }
            }
        };

        // Create a PDF document using the document definition
        const pdfDoc = pdfMake.createPdf(docDefinition);

        // Generate the PDF file and send it back to the client
        pdfDoc.getBuffer((buffer) => {
            response.setHeader('Content-Type', 'application/pdf');
            response.setHeader('Content-Disposition', `attachment; filename=${data.name}.pdf`);
            response.send(buffer);
        });
    });
});

-------------------------------------------------------------------------
*/

const pdfFonts = require('vfs_fonts');

pdfMake.addVirtualFileSystem(pdfFonts);

const fs = require('fs');

// Define the font that you want to use
const arial = {
    Arial: {
        normal: 'C:/Windows/Fonts/Arial-Regular.ttf',
        bold: 'C:/Windows/Fonts/Arial-Bold.ttf',
        italics: 'C:/Windows/Fonts/Arial-Italic.ttf',
        bolditalics: 'C:/Windows/Fonts/Arial-BoldItalic.ttf'
    }
};

// Sample JSON object
const data = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890"
};

// Define the PDF document definition
const docDefinition = {
    content: [
        { text: 'User Information', style: 'header' },
        { text: `Name: ${data.name}` },
        { text: `Email: ${data.email}` },
        { text: `Phone: ${data.phone}` }
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
            font: 'Arial'
        }
    },
    defaultStyle: {
        font: 'Arial'
    },
    fonts: arial
};

// Create a PDF document using the document definition
const printer = new pdfMake();
const pdfDoc = printer.createPdfKitDocument(docDefinition);

// Generate the PDF file and download it
pdfDoc.pipe(fs.createWriteStream('output.pdf'));
pdfDoc.end();
