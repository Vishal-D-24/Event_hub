import fs from "fs";
import PDFDocument from "pdfkit";

export function generateCertificateBuffer({ participantName, event, templatePath, signaturePath }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });
      const chunks = [];

      doc.on("data", (data) => chunks.push(data));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // ✅ Certificate Background Template Image
      if (templatePath && fs.existsSync(templatePath)) {
        doc.image(templatePath, 0, 0, {
          width: doc.page.width,
          height: doc.page.height,
        });
      }

      // ------------------------------
      // ✅ TEXT POSITIONS (Perfectly Centered)
      // ------------------------------

      // Participant Name (Main Highlight)
      doc
        .font("Helvetica-Bold")
        .fontSize(42)
        .fillColor("#000000")
        .text(participantName, 0, 250, {
          align: "center",
        });

      // Event Title Line
      doc
        .font("Helvetica")
        .fontSize(20)
        .fillColor("#444")
        .text(`for participating in ${event.title}`, 0, 305, {
          align: "center",
        });

      // Date
      const formattedDate = new Date(event.endDateTime || event.startDateTime).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      doc
        .font("Helvetica")
        .fontSize(14)
        .fillColor("#666")
        .text(`Issued on: ${formattedDate}`, 0, 340, {
          align: "center",
        });

      // ------------------------------
      // ✅ Signature (Optional)
      // ------------------------------
      if (signaturePath && fs.existsSync(signaturePath)) {
        doc.image(signaturePath, doc.page.width / 2 - 200, 430, { width: 120 });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
