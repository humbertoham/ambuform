'use client'

import React, { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Hash } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument, rgb, StandardFonts, PDFImage } from 'pdf-lib';




export default function ReportForm() {
  interface GlasgowRow {
  parameter: string;
  scores: { score: number; description: string }[];
}

const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

 


const glasgowData: GlasgowRow[] = [
  {
    parameter: 'Apertura ocular',
    scores: [
      { score: 4, description: 'Espontánea' },
      { score: 3, description: 'A la orden' },
      { score: 2, description: 'Al dolor' },
      { score: 1, description: 'Ausente' },
    ],
  },
  {
    parameter: 'Respuesta verbal',
    scores: [
      { score: 5, description: 'Orientado' },
      { score: 4, description: 'Confuso' },
      { score: 3, description: 'Palabras inapropiadas' },
      { score: 2, description: 'Sonidos incomprensibles' },
      { score: 1, description: 'Ausente' },
    ],
  },
  {
    parameter: 'Respuesta motora',
    scores: [
      { score: 6, description: 'Obedece órdenes' },
      { score: 5, description: 'Localiza dolor' },
      { score: 4, description: 'Retirada al dolor' },
      { score: 3, description: 'Flexión anormal (decorticación)' },
      { score: 2, description: 'Extensión anormal (descerebración)' },
      { score: 1, description: 'Ausente' },
    ],
  },
];


  const [formData, setFormData] = useState({
    other:'',
    unit: '01',
    shift: 'Mañana',
    times: {} as Record<string, string>,
    transport: '',
    location: '',
    name: '',
    address: '',
    age: '',
    sex: 'M',
    bloodType:'',
    callType:'Consulta',
    civilStatus:'',
    profession:'',
    relationship:'',
    beneficiary:'',
    vitals:'',
    phone:'',
    responsibleAdult:'',
    pacientStatus:'',
    respiration:'Normal',
    bleeding:'Ninguna',
    pain:'Ninguno',
    priority:'Rojo',
    principal:'',
    description:'',
    temperature:'',
    pulse:'',
    autoAccident:'',
    arterialPress:'',
    alergies:'',
    conLevel:'',
    respiratoryNoise:'Normales',
    aux:'',
    medicine:'',
    pupile:'Normales',
    medicineHour:'',
    medicineDosis:'',
    oxi:'',
    codeTras:'01',
    hospital:'Morelos',
    medRec:'',
    o2:'No',
    serviceC:'',
    serviceM:'',
    operator:'',
    tUM1:'',
    tUM2:'',
    skin:'',
    folio: '',
    ante:'',
    dex:'',
    ao: 4,
    rv: 5,
    rm: 6,
    rcp:'No',
    ven:'No',
    collar:'No',
    ice:'No',
    enfe:'No',
    tabla:'No',
    puntas:'No',
    mask:'No',
  });
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const sigCanvasRef2 = useRef<SignatureCanvas>(null);
// Refs






const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('time_')) {
      const key = name.replace('time_', '');
      setFormData(prev => ({ ...prev, times: { ...prev.times, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

   



  }; 
  const clearSignature = () => sigCanvasRef.current?.clear();
const clearSignature2 = () => sigCanvasRef2.current?.clear();
  const handleGeneratePDF = async () => {
    // 1. Load your PDF template from public folder
    const templateBytes = await fetch('/plantilla.pdf').then(res => res.arrayBuffer());

    // 2. Create a PDFDocument
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    const page2 = pdfDoc.getPages()[1];
   const { width:w2, height:h2 } = page2.getSize();
   const page3 = pdfDoc.getPages()[2];
   const { width:w3, height:h3 } = page3.getSize();

    // 3. Embed a font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    


    // 4. Draw text fields at positions matching your template
   // First, ensure you have the logo image added to your PDF
// (Assuming you've loaded the logo image as 'logoImage')
const logoHeight = 40;
const margin = 50;
let currentY = height - margin - logoHeight;



// Add title
// Space after logo
page.drawText('AmbulanciasTVR - Reporte Médico', {
  x: margin,
  y: currentY,
  size: 24,
  font: helveticaFont,
  color: rgb(0, 0.2, 0.4), // Dark blue color
});

// Add decorative line under title
currentY -= 20;
page.drawLine({
  start: { x: margin, y: currentY },
  end: { x: width - margin, y: currentY },
  thickness: 2,
  color: rgb(0, 0.2, 0.4),
});

// Section styles
const sectionTitleStyle = {
  font: helveticaFont,
  size: 14,
  color: rgb(0, 0.2, 0.4),
};
const subsectionTitleStyle = {
  font: helveticaFont,
  size: 12,
};
const normalTextStyle = {
  font: helveticaFont,
  size: 12,
};

// Create helper function for section titles
const addSectionTitle = (text:any, y:any) => {
  page.drawText(text, { ...sectionTitleStyle, x: margin, y });
  return y - 30; // Return new Y position
};

// Create two-column layout helper
interface TwoColumnOptions {
  spacing?: number;
  rightX?: number;
  style?: any; // Replace 'any' with your specific text style type if available
}

const twoColumns = (
  leftText: string,
  rightText: string,
  y: number,
  opts: TwoColumnOptions = {}
) => {
  const rightX = opts.rightX ?? width - margin - 200;
  page.drawText(leftText, { ...opts.style, x: margin, y });
  page.drawText(rightText, { ...opts.style, x: rightX, y });
  return y - (opts.spacing ?? 20);
};
function getDate(): string {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}
const date = getDate()
// Header Information
currentY = addSectionTitle(`Información Básica                                                                                     Folio:${formData.folio}`, currentY - 20);
currentY = twoColumns(`Fecha: ${date}`, `Unidad Nº: ${formData.unit}`, currentY, {
  style: normalTextStyle
});
currentY = twoColumns(`Turno: ${formData.shift}`, `Transporte: ${formData.transport}`, currentY, {
  style: normalTextStyle
});

// Times Section
currentY = addSectionTitle('Horarios', currentY - 20);
let yPos = currentY;
Object.entries(formData.times).forEach(([k, v]) => {
  page.drawText(`• ${k}: ${v}`, { ...normalTextStyle, x: margin + 20, y: yPos });
  yPos -= 20;
});
currentY = yPos - 20;

// Patient Information Section
currentY = addSectionTitle('Detalles del paciente', currentY);
currentY = twoColumns(`Nombre: ${formData.name}`, ``, currentY, {
  style: normalTextStyle
});
currentY = twoColumns(`Edad: ${formData.age}`, `Sexo: ${formData.sex}`, currentY, {
  style: normalTextStyle
});
currentY = twoColumns(`Tipo de Sangre: ${formData.bloodType}
`, ``, currentY, {
  style: normalTextStyle
});
currentY = twoColumns(`Dirección: ${formData.address}`, ``, currentY, {
  style: normalTextStyle
});
currentY = twoColumns(`Ubicación: ${formData.location}`, ``, currentY, {
  style: normalTextStyle
});


// Additional Data Section with grid layout
currentY = addSectionTitle('Información Adicional', currentY - 20);
const additionalData = [
  [`Tipo de llamada: ${formData.callType}`, `Estado Civil: ${formData.civilStatus}`],
  [`Derechohabiente: ${formData.beneficiary}`, `Profesión: ${formData.profession}`],
  [`Teléfono: ${formData.phone}`, `Relación: ${formData.relationship}`],
  [`Adulto responsable: ${formData.responsibleAdult}`, "" ],
];


additionalData.forEach(([left, right]) => {
  currentY = twoColumns(left, right, currentY, { style: normalTextStyle });
});


currentY = addSectionTitle('Signos Vitales', currentY - 20);
const additionalDato = [
  [`Presión Arterial: ${formData.arterialPress}`, `Pulso: ${formData.pulse} LPM`],
    [`Oximetría: ${formData.oxi}%`, `Temperatura: ${formData.temperature}°C`],
  [`Alergias: ${formData.alergies}`, `Respiración: ${formData.respiration}`],
  [`Dextrostix: ${formData.dex} mg/dl`, ``],
];


additionalDato.forEach(([left, right]) => {
  currentY = twoColumns(left, right, currentY, { style: normalTextStyle });
});

// Continue with other sections using similar pattern...

// Add footer

page.drawText('Documento Médico Confidencial', {
  x: margin,
  y: 20,
  size: 10,
  font: helveticaFont,
  color: rgb(0.5, 0.5, 0.5),
});










// page 2
const logoHeight2 = 40;
const margin2 = 50;
let currentY2 = h2 - margin - logoHeight;



// Add title
page2.drawText('AmbulanciasTVR - Reporte Médico', {
  x: margin,
  y: currentY2,
  size: 24,
  font: helveticaFont,
  color: rgb(0, 0.2, 0.4), // Dark blue color
});

// Add decorative line under title
currentY2 -= 20;
page2.drawLine({
  start: { x: margin, y: currentY2 },
  end: { x: w2 - margin, y: currentY2 },
  thickness: 2,
  color: rgb(0, 0.2, 0.4),
});

// Section styles
const sectionTitleStyle2 = {
  font: helveticaFont,
  size: 14,
  color: rgb(0, 0.2, 0.4),
};
const subsectionTitleStyle2 = {
  font: helveticaFont,
  size: 12,
};
const normalTextStyle2 = {
  font: helveticaFont,
  size: 12,
};

// Create helper function for section titles
const addSectionTitle2 = (text:any, y:any) => {
  page2.drawText(text, { ...sectionTitleStyle2, x: margin, y });
  return y - 30; // Return new Y position
};

// Create two-column layout helper
interface TwoColumnOptions {
  spacing?: number;
  rightX?: number;
  style?: any; // Replace 'any' with your specific text style type if available
}

const twoColumns2 = (
  leftText: string,
  rightText: string,
  y: number,
  opts: TwoColumnOptions = {}
) => {
  const rightX = opts.rightX ?? w2 - margin - 200;
  page2.drawText(leftText, { ...opts.style, x: margin, y });
  page2.drawText(rightText, { ...opts.style, x: rightX, y });
  return y - (opts.spacing ?? 20);
};

// Additional Data Section with grid layout

const glas = formData.ao + formData.rm + formData.rv;

function splitTextByLength(text: string): string[] {
  const length = text.length;

  let parts: string[] = [];
  let chunkSize = 0;

  if (length <= 120) {
    return [text];
  } else if (length <= 180) {
    chunkSize = Math.ceil(length / 2);
  } else {
    chunkSize = Math.ceil(length / 3);
  }

  let remaining = text.trim();

  while (remaining.length > 0) {
    if (remaining.length <= chunkSize) {
      parts.push(remaining);
      break;
    }

    // Cortar lo más cerca posible de un espacio
    let splitIndex = remaining.lastIndexOf(" ", chunkSize);
    if (splitIndex === -1 || splitIndex < chunkSize * 0.5) {
      // Si no hay espacio cerca, forzar corte
      splitIndex = chunkSize;
    }

    parts.push(remaining.slice(0, splitIndex).trim());
    remaining = remaining.slice(splitIndex).trim();
  }

  return parts;
}


const molestiaLines = splitTextByLength(formData.principal);
const descLines = splitTextByLength(formData.description);

currentY2 = addSectionTitle2('Estado del Paciente', currentY2 - 20);

const additionalDatas = [
  [`Piel: ${formData.skin}`, `Respiración: ${formData.respiration}`],
  [`Hemorragias: ${formData.bleeding}`, `Dolor: ${formData.pain}`],
  [`Prioridad: ${formData.priority}`, `Glasgow: ${glas}`],
   [`Molestia Principal:`, ``],
  ...molestiaLines.map(line => [`${line}`, ""]),
  [`Descripción:`, ``],
  ...descLines.map(line => [`${line}`, ""]),
];


additionalDatas.forEach(([left, right]) => {
  currentY2 = twoColumns2(left, right, currentY2, { style: normalTextStyle });
});

  const ante = splitTextByLength(formData.ante);

currentY2 = addSectionTitle2('Primeros Auxilios', currentY2 - 20);
const parte2 = [
  [`Nivel de Conciencia: ${formData.conLevel}`, `Ruidos Respiratorios: ${formData.respiratoryNoise}`],
  [`Pupilas: ${formData.pupile}`, `O2: ${formData.o2}`],
  [`R.C.P: ${formData.rcp}`, `Vendajes: ${formData.ven}`],
  [`Bolsa de Hielo: ${formData.ice}`, `Enferulado: ${formData.enfe}`],
  [`Puntas: ${formData.puntas}`, `Tabla para Columna: ${formData.tabla}`],
  [`Mascarilla: ${formData.mask}`, ``],
  [`Otros: ${formData.aux}`, ``],
  [`Medicamentos: ${formData.medicine}`, ``],
  [`Dosis: ${formData.medicineDosis}` ,`Hora: ${formData.medicineHour}` ],
  [`Antecedentes:`, ``],
  ...ante.map(line => [`${line}`, ""]),
];


parte2.forEach(([left, right]) => {
  currentY2 = twoColumns2(left, right, currentY2, { style: normalTextStyle });
});




// Continue with other sections using similar pattern...

// Add footer


page2.drawText('Documento Médico Confidencial', {
  x: margin,
  y: 20,
  size: 10,
  font: helveticaFont,
  color: rgb(0.5, 0.5, 0.5),
});







// page 3
const logoHeight3 = 40;
const margin3 = 50;
let currentY3 = h3 - margin3 - logoHeight3;



// Add title
page3.drawText('AmbulanciasTVR - Reporte Médico', {
  x: margin3,
  y: currentY3,
  size: 24,
  font: helveticaFont,
  color: rgb(0, 0.2, 0.4), // Dark blue color
});

// Add decorative line under title
currentY3 -= 20;
page3.drawLine({
  start: { x: margin3, y: currentY3 },
  end: { x: w3 - margin3, y: currentY3 },
  thickness: 2,
  color: rgb(0, 0.2, 0.4),
});

// Section styles
const sectionTitleStyle3 = {
  font: helveticaFont,
  size: 14,
  color: rgb(0, 0.2, 0.4),
};
const subsectionTitleStyle3 = {
  font: helveticaFont,
  size: 12,
};
const normalTextStyle3 = {
  font: helveticaFont,
  size: 12,
};

// Create helper function for section titles
const addSectionTitle3 = (text:any, y:any) => {
  page3.drawText(text, { ...sectionTitleStyle3, x: margin, y });
  return y - 30; // Return new Y position
};

// Create two-column layout helper
interface TwoColumnOptions {
  spacing?: number;
  rightX?: number;
  style?: any; // Replace 'any' with your specific text style type if available
}

const twoColumns3 = (
  leftText: string,
  rightText: string,
  y: number,
  opts: TwoColumnOptions = {}
) => {
  const rightX = opts.rightX ?? w3 - margin - 200;
  page3.drawText(leftText, { ...opts.style, x: margin, y });
  page3.drawText(rightText, { ...opts.style, x: rightX, y });
  return y - (opts.spacing ?? 20);
};

// Additional Data Section with grid layout


currentY3 = addSectionTitle3('Hospital', currentY3 - 20);
const hospital = [
  [`Hospital: ${formData.other ? formData.other : formData.hospital}`, ``],
  [`Código de Traslado: ${formData.codeTras}`, ``],
  [`Médico Receptor: ${formData.medRec}`, ``],
  
];




hospital.forEach(([left, right]) => {
  currentY3 = twoColumns3(left, right, currentY3, { style: normalTextStyle });
});

currentY3 = addSectionTitle3('Personal', currentY3 - 20);
const personal = [
  [`Jefe de Servicios: ${formData.serviceC}`, ``],
  [`T.U.M: ${formData.serviceC}`, ``],
  [`T.U.M: ${formData.tUM2}`, ``],
  [`Médico: ${formData.serviceM}`, ``],
  [`Operador: ${formData.medicineDosis}` ,`` ],

];


personal.forEach(([left, right]) => {
  currentY3 = twoColumns3(left, right, currentY3, { style: normalTextStyle });
});

// Continue with other sections using similar pattern...

// Add footer


page3.drawText('Documento Médico Confidencial', {
  x: margin,
  y: 20,
  size: 10,
  font: helveticaFont,
  color: rgb(0.5, 0.5, 0.5),
});





currentY3 = addSectionTitle3('Evidencia', currentY3 - 20);



    if (selectedFile) {
  // Cargamos los bytes de la imagen
  const imgBytes = await selectedFile.arrayBuffer();
  let embeddedImage: PDFImage;
  
  // Seleccionamos el método de embed según el tipo real
  if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg') {
    embeddedImage = await pdfDoc.embedJpg(imgBytes);
  } else if (selectedFile.type === 'image/png') {
    embeddedImage = await pdfDoc.embedPng(imgBytes);
  } else {
    throw new Error(`Tipo de imagen no soportado: ${selectedFile.type}`);
  }

  // Escalamos la imagen para que ocupe un 20% de su tamaño original
  const scaleFactor = 0.2;
  const { width, height } = embeddedImage.size();
  const imgDims = {
    width: width * scaleFactor,
    height: height * scaleFactor,
  };

  // La dibujamos en la página (ajusta x, y según tus necesidades)
  page3.drawImage(embeddedImage, {
    x: 40,
    y: 200,
    width: imgDims.width,
    height: imgDims.height,
  });
}
























    // 5. Embed signature image if exists
    const canvas = sigCanvasRef.current;
    if (canvas && !canvas.isEmpty()) {
      const sigDataUrl = canvas.getCanvas().toDataURL('image/png');
      const sigBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigDims = sigImage.scale(0.5);
      page3.drawImage(sigImage, {
        x: width - sigDims.width - 400,
        y: 50,
        width: sigDims.width,
        height: sigDims.height,
      });
    }

    const canvas2 = sigCanvasRef2.current;
    if (canvas2 && !canvas2.isEmpty()) {
      const sigDataUrl = canvas2.getCanvas().toDataURL('image2/png');
      const sigBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigDims = sigImage.scale(0.5);
      page3.drawImage(sigImage, {
        x: width - sigDims.width - 80,
        y: 50,
        width: sigDims.width,
        height: sigDims.height,
      });
    }



    // 6. Serialize and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${formData.name || 'paciente'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

      window.location.reload()


  };

 const maxScores = glasgowData.map(row => Math.max(...row.scores.map(s => s.score)));
  const highest = Math.max(...maxScores);


  return (
    <motion.div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-2xl font-bold mb-4">Formulario de Paciente - Ambulancias TVR</h1>

      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <label className="flex flex-col"><span>Folio</span><input type="number" inputMode="numeric" pattern="[0-9]*" name="folio" onChange={handleChange} className="p-2 border rounded" /></label>

        
        <label className="flex flex-col">
          <span className="flex items-center mb-1"><Hash className="mr-1" size={16}/> Unidad Nº</span>
           <label className="flex flex-col"><select name="unit" onChange={handleChange} className="p-2 border rounded"><option value="01">01</option><option value="02">02</option><option value="03">03</option>
            <option value="04">04</option>
           <option value="05">05</option>
           <option value="06">06</option>
           <option value="07">07</option>
           <option value="08">08</option>
           <option value="09">09</option>
           <option value="10">10</option>
           <option value="11">11</option>
           </select></label>
        </label>
        <label className="flex flex-col">
          <span className="mb-1">Turno</span>
           <label className="flex flex-col"><select name="shift" onChange={handleChange} className="p-2 border rounded"><option value="Mañana">Mañana</option><option value="Tarde">Tarde</option><option value="Tarde">Noche</option></select></label>
        </label>
      </div>

      {/* Horarios */}
      <fieldset className="mb-4 border p-4 rounded">
        <legend className="font-semibold">Horarios</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Llamada','En Ruta','En Lugar','En Hospital','Unidad Libre'].map(opt => (
            <label key={opt} className="flex flex-col">
              <span className="flex items-center mb-1"><Clock className="mr-1" size={16}/> H. {opt}</span>
              <input type="time" name={`time_${opt}`} onChange={handleChange} className="p-2 border rounded" />
            </label>
          ))}
        </div>
      </fieldset>

      {/* Transporte */}
      <fieldset className="mb-4">
        <legend className="font-semibold">Transporte</legend>
        <div className="flex flex-wrap gap-4">
          {['Solo paciente','Varios pacientes','Ayuda sola, no traslado','No se ayudó','Otro'].map(opt => (
            <label key={opt} className="flex items-center">
              <input type="radio" name="transport" value={opt} onChange={handleChange} className="mr-2" />{opt}
            </label>
          ))}
        </div>
      </fieldset>




      {/* Datos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col"><span>Ubicación</span><input type="text" name="location" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Nombre</span><input type="text" name="name" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col md:col-span-2"><span>Dirección</span><input type="text" name="address" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Edad</span><input type="number" inputMode="numeric" pattern="[0-9]*" name="age" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Sexo</span><select name="sex" onChange={handleChange} className="p-2 border rounded"><option value="M">M</option><option value="F">F</option></select></label>
      </div>{/* (igual que antes: date, unit, shift, horarios, transporte, datos) */}

          <fieldset className="mb-4">
        <legend className="font-semibold">Estado Civil</legend>
        <div className="flex flex-wrap gap-4">
          {['Soltero','Casado','Divorciado','Viudo', 'Union Libre '].map(opt => (
            <label key={opt} className="flex items-center">
              <input type="radio" name="civilStatus" value={opt} onChange={handleChange} className="mr-2" />{opt}
            </label>
          ))}
        </div>
      </fieldset>

          {/* Datos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className="flex flex-col"><span>Tipo de llamada</span><select name="callType" onChange={handleChange} className="p-2 border rounded"><option value="Consulta">Consulta</option><option value="Traslado">Traslado</option>
                <option value="Urgencia">Urgencia</option>
                <option value="Emergencia">Emergencia</option>
                
                </select></label>

        <label className="flex flex-col"><span>Profesión</span><input type="text" name="profession" onChange={handleChange} className="p-2 border rounded" /></label>
      </div>{/* (igual que antes: date, unit, shift, horarios, transporte, datos) */}



          <fieldset className="mb-4">
        <legend className="font-semibold">Tipo de Sangre</legend>
        <div className="flex flex-wrap gap-4">
          {['A+','A-','O+','O-','B+','B-','AB+','AB-'].map(opt => (
            <label key={opt} className="flex items-center">
              <input type="radio" name="bloodType" value={opt} onChange={handleChange} className="mr-2" />{opt}
            </label>
          ))}
        </div>
      </fieldset>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col"><span>Adulto Responsable</span><input type="text" name="responsibleAdult" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Relación</span><input type="text" name="relationship" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Teléfono</span><input type="tel" inputMode="numeric" pattern="[0-9]*" name="phone" onChange={handleChange} className="p-2 border rounded" /></label>
      </div>{/* (igual que antes: date, unit, shift, horarios, transporte, datos) */}

   <fieldset className="mb-4">
        <legend className="font-semibold">Derechohabiente</legend>
        <div className="flex flex-wrap gap-4">
          {['MediChihuahua','Imss','Issste','Pensiones del estado','Pensiones Municipales','Militar',' Privado'].map(opt => (
            <label key={opt} className="flex items-center">
              <input type="radio" name="beneficiary" value={opt} onChange={handleChange} className="mr-2" />{opt}
            </label>
          ))}
        </div>
      </fieldset>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col"><span>Presión Arterial</span><input type="text" name="arterialPress" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Pulso</span><input type="number" inputMode="numeric" pattern="[0-9]*" name='pulse' onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Oximetría</span><input type="number" inputMode="numeric" pattern="[0-9]*" name='oxi'  onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Temperatura</span><input type="number" inputMode="numeric" pattern="[0-9]*" name="temperature" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Dextrostix</span><input type="number" inputMode="numeric" pattern="[0-9]*" name="dex" onChange={handleChange} className="p-2 border rounded" /></label>
        
        <label className="flex flex-col "><span>Alergias</span><input type="text" name="alergies" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col md:col-span-2 "><span>Antecedentes</span><input type="text" name="ante" onChange={handleChange} className="p-2 border rounded" /></label>
       
       </div>
       
        <fieldset className="mb-4">
        <legend className="font-semibold">Piel</legend>
        <div className="flex flex-wrap gap-4">
          {['Normal','Caliente','Fría','Pálida','Ruborizada','Cianótica'].map(opt => (
            <label key={opt} className="flex items-center">
              <input type="radio" name="skin" value={opt} onChange={handleChange} className="mr-2" />{opt}
            </label>
          ))}
        </div>
      </fieldset>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col"><span>Respiración</span><select name="respiration" onChange={handleChange} className="p-2 border rounded"><option value="Normal">Normal</option><option value="Superficial">Superficial</option></select></label>
        <label className="flex flex-col"><span>Hemorragias</span><select name="bleeding" onChange={handleChange} className="p-2 border rounded"><option value="Ninguna">Ninguna</option><option value="Min.">Min.</option><option value="Mod.">Mod.</option><option value="Sev.">Sev.</option></select></label>
        <label className="flex flex-col"><span>Dolor</span><select name="pain" onChange={handleChange} className="p-2 border rounded"><option value="Ninguno">Ninguno</option><option value="Min.">Min.</option><option value="Mod.">Mod.</option><option value="Sev.">Sev.</option></select></label>
      
        <label className="flex flex-col "><span>Prioridad</span><select name="priority" onChange={handleChange} className="p-2 border rounded"><option value="Rojo">Rojo</option><option value="Amarillo">Amarillo</option><option value="Verde">Verde</option><option value="Negro">Negro</option></select></label>
          <label className="flex flex-col  md:col-span-2"><span>Molestia Principal</span><input type="text" name="principal" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col  md:col-span-2"><span>Descripción de la lesión</span><input type="text" name="description" onChange={handleChange} className="p-2 border rounded" /></label>
        
      </div>{/* (igual que antes: date, unit, shift, horarios, transporte, datos) */}

         
   <fieldset className="mb-4">
        <legend className="font-semibold">Nivel de Conciencia</legend>
        <div className="flex flex-wrap gap-4">
          {['Alerta','Responde al estimulo verbal','Respondo al estimulo doloroso','No responde'].map(opt => (
            <label key={opt} className="flex items-center">
              <input type="radio" name="conLevel" value={opt} onChange={handleChange} className="mr-2" />{opt}
            </label>
          ))}
        </div>
      </fieldset>

   <div className="overflow-x-auto">
      <legend className="font-semibold">Escala de Glasgow</legend>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Parámetro</th>
            {Array.from({ length: highest }, (_, i) => highest - i).map(score => (
              <th key={score} className="border px-4 py-2">
                {score}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {glasgowData.map(({ parameter, scores }) => (
            <tr key={parameter} className="even:bg-gray-50">
              <td className="border px-4 py-2 font-medium">{parameter}</td>
              {Array.from({ length: highest }, (_, idx) => {
                const scoreValue = highest - idx;
                const item = scores.find(s => s.score === scoreValue);
                return (
                  <td key={idx} className="border px-4 py-2 text-center">
                    {item ? item.description : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        <label className="flex flex-col"><span>Apertura Ocular</span><select name="ao" onChange={handleChange} className="p-2 border rounded">
          <option value={4}>4</option><option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
          </select></label>
          <label className="flex flex-col"><span>Respuesta Verbal</span><select name="rv" onChange={handleChange} className="p-2 border rounded">
          <option value={5}>5</option>
          <option value={4}>4</option><option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
          </select></label>
           <label className="flex flex-col"><span>Respuesta Motora</span><select name="rm" onChange={handleChange} className="p-2 border rounded">
          <option value={6}>6</option>
          <option value={5}>5</option>
          <option value={4}>4</option><option value={4}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
          </select></label>
     
  
</div>


<fieldset className="mb-4">
        <legend className="font-semibold">Nivel de Conciencia</legend>
        <div className="flex flex-wrap gap-4">
          {['Sí', 'No'].map(opt => (
            <label key={opt} className="flex items-center">
              <input type="radio" name="conLevel" value={opt} onChange={handleChange} className="mr-2" />{opt}
            </label>
          ))}
        </div>
      </fieldset>



<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col"><span>Ruidos Respiratorios</span><select name="respiratoryNoise" onChange={handleChange} className="p-2 border rounded"><option value="Normales">Normales</option><option value="Estertores">Estertores</option><option value="Estridor">Estridor</option><option value="Roncus">Roncus</option><option value="Sibilancias">Sibilancias</option></select></label>
        <label className="flex flex-col"><span>Pupilas</span><select name="pupile" onChange={handleChange} className="p-2 border rounded"><option value="Normales">Normales</option><option value="Dilatadas">Dilatadas</option><option value="Contraidas">Contraidas</option><option value="Asimétricas">Asimétricas</option></select></label>

   <label className="flex flex-col"><span>R.C.P</span><select name="rcp" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
   <label className="flex flex-col"><span>Vendajes</span><select name="ven" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
   <label className="flex flex-col"><span>Collar Vertical</span><select name="collar" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
   <label className="flex flex-col"><span>Bolsa de Hielo</span><select name="ice" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
   <label className="flex flex-col"><span>Enferulado</span><select name="enfe" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
   <label className="flex flex-col"><span>Tabla Para Columna</span><select name="tabla" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
   <label className="flex flex-col"><span>Puntas</span><select name="puntas" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
   <label className="flex flex-col"><span>Mascarilla</span><select name="mask" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
<label className="flex flex-col"><span>Otros</span><input type="text" name="aux" onChange={handleChange} className="p-2 border rounded" /></label>




   <label className="flex flex-col"><span>O2</span><select name="o2" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
  <label className="flex flex-col"><span>Medicamentos</span><input type="text" name="medicine" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Dosis</span><input type="text" name="medicineDosis" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Hora</span><input type="time" name="medicineHour" onChange={handleChange} className="p-2 border rounded" /></label>
        
        <label className="flex flex-col"><span>Código de Traslado al Hospital</span><select name="codeTras" onChange={handleChange} className="p-2 border rounded"><option value="01">01</option><option value="02">02</option><option value="03">03</option></select></label>
      

        <label className="flex flex-col"><span>Hospital</span><select name="hospital" onChange={handleChange} className="p-2 border rounded">
          <option value="Morelos">Morelos</option><option value="Central">Central</option>
          <option value="General">General</option>
          <option value="Infantil">Infantil</option>
          <option value="Militar">Militar</option>
          <option value="Issste">Issste</option>
          <option value="Impe">Impe</option>
           <option value="Otro">Otro</option>
          </select></label>
          {formData.hospital === "Otro" && (
        <label className="flex flex-col"><span>Otro</span><input type="text" name="other" onChange={handleChange} className="p-2 border rounded" /></label>
  )
}
</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            
        <label className="flex flex-col"><span>Jefe de Servicios</span><input type="text" name="serviceC" onChange={handleChange} className="p-2 border rounded" /></label>

        <label className="flex flex-col"><span>T.U.M</span><input type="text" name="tUM1" onChange={handleChange} className="p-2 border rounded" /></label>

        <label className="flex flex-col"><span>T.U.M</span><input type="text" name="tUM2" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Médico</span><input type="text" name="serviceM" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Operador</span><input type="text"  name="operator" onChange={handleChange} className="p-2 border rounded" /></label>
      </div>{/* (igual que antes: date, unit, shift, horarios, transporte, datos) */}

      <label className="flex flex-col"><span>Evidencia</span><input type="file"
        accept="image/*"
        onChange={handleFileChange} className="p-2 border rounded" /></label>


       
      {/* Signature pad */}
      <div className="mb-4">
        <span className="block font-semibold mb-1">Firma de Recibido:</span>
        <SignatureCanvas
  penColor="black"
  ref={sigCanvasRef}
  canvasProps={{
    width: 300, // definido en píxeles
    height: 200,
    className: 'border rounded'
  }}
/>
        <button onClick={clearSignature} className="mt-2 px-4 py-2 hover:bg-blue-600  border rounded">Borrar firma</button>
        <span className="block font-semibold mb-1">Firma de Médico que Recibe:</span>
        <SignatureCanvas
  penColor="black"
  ref={sigCanvasRef2}
  canvasProps={{
    width: 300, // definido en píxeles
    height: 200,
    className: 'border rounded'
  }}
/>
        <button onClick={clearSignature2} className="mt-2 px-4 py-2 hover:bg-blue-600  border rounded">Borrar firma</button>
      </div>
     

      {/* Botón para generar PDF */}
    
      <div className="text-right">
        
        <button onClick={handleGeneratePDF} className="px-4 py-2 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 focus:outline-none focus:ring">
          Generar PDF
        </button>
      </div>
    </motion.div>
  );
}

// Nota: Coloca tu plantilla `plantilla.pdf` en la carpeta `/public` de tu PWA.  
