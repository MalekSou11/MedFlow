const PDFDocument = require('pdfkit');

const generatePrescriptionPDF = (prescription) => {
  const doc = new PDFDocument();
  // on retournera un buffer stream
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  doc.fontSize(18).text('Ordonnance Médicale', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Patient: ${prescription.patientName || ''}`);
  doc.text(`Date: ${new Date(prescription.date).toLocaleDateString()}`);
  doc.moveDown();

  prescription.medicines.forEach((m, idx) => {
    doc.text(`${idx+1}. ${m.name} — ${m.dose} — ${m.frequency} — ${m.duration}`);
  });

  doc.end();
  return new Promise((resolve) => {
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });
};

module.exports = { generatePrescriptionPDF };
