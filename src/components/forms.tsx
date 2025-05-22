'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Hash } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';




export default function ReportForm() {
  const [formData, setFormData] = useState({
    date: '',
    unit: '',
    shift: '',
    times: {} as Record<string, string>,
    transport: '',
    location: '',
    name: '',
    address: '',
    age: '',
    sex: 'M',
    bloodType:'',
    callType:'',
    civilStatus:'',
    profession:'',
    relationship:'',
    beneficiary:'',
    vitals:'',
    phone:'',
    responsibleAdult:'',
    pacientStatus:'',
    respiration:'',
    bleeding:'',
    pain:'',
    priority:'',
    principal:'',
    description:'',
    temperature:'',
    pulse:'',
    autoAccident:'',
    arterialPress:'',
    alergies:'',
    conLevel:'',
    respiratoryNoise:'',
    aux:'',
    medicine:'',
    pupile:'',
    medicineHour:'',
    medicineDosis:'',
    oxi:'',
    codeTras:'',
    hospital:'',
    medRec:'',
    o2:'',
    serviceC:'',
    serviceM:'',
    operator:'',
    tUM1:'',
    tUM2:'',
    skin:''
  });
  const sigCanvasRef = useRef<SignatureCanvas>(null);
// Refs
const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
const [isDrawing, setIsDrawing] = useState(false);








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

  const handleGeneratePDF = async () => {
    // 1. Load your PDF template from public folder
    const templateBytes = await fetch('/plantilla.pdf').then(res => res.arrayBuffer());

    // 2. Create a PDFDocument
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

    const page2 = pdfDoc.getPages()[1];
   const { width:w2, height:h2 } = page2.getSize();

    // 3. Embed a font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 4. Draw text fields at positions matching your template
   // First, ensure you have the logo image added to your PDF
// (Assuming you've loaded the logo image as 'logoImage')
const logoHeight = 50;
const margin = 50;
let currentY = height - margin - logoHeight;



// Add title
currentY -= 15; // Space after logo
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

// Header Information
currentY = addSectionTitle('Información Básica', currentY - 20);
currentY = twoColumns(`Fecha: ${formData.date}`, `Unidad Nº: ${formData.unit}`, currentY, {
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
currentY = twoColumns(`Nombre: ${formData.name}`, `Edad: ${formData.age}`, currentY, {
  style: normalTextStyle
});
currentY = twoColumns(`Dirección: ${formData.address}`, `Sexo: ${formData.sex}`, currentY, {
  style: normalTextStyle
});
currentY = twoColumns(`Ubicación: ${formData.location}`, `Tipo de Sangre: ${formData.bloodType}`, currentY, {
  style: normalTextStyle
});

// Additional Data Section with grid layout
currentY = addSectionTitle('Información Adicional', currentY - 20);
const additionalData = [
  [`Tipo de llamada: ${formData.callType}`, `Estado Civil: ${formData.civilStatus}`],
  [`Derechohabiente: ${formData.beneficiary}`, `Profesión: ${formData.profession}`],
  [`Adulto responsable: ${formData.responsibleAdult}`, `Relación: ${formData.relationship}`],
  [`Teléfono: ${formData.phone}`, "" ],
];


additionalData.forEach(([left, right]) => {
  currentY = twoColumns(left, right, currentY, { style: normalTextStyle });
});


currentY = addSectionTitle('Signos Vitales', currentY - 20);
const additionalDato = [
  [`Presión Arterial: ${formData.arterialPress}`, `Pulso: ${formData.pulse}`],
  [`Oximetría: ${formData.oxi}%`, `Temperatura: ${formData.temperature}`],
  [`Alergias: ${formData.alergies}`, `Respiración: ${formData.respiration}`],
];


additionalDato.forEach(([left, right]) => {
  currentY = twoColumns(left, right, currentY, { style: normalTextStyle });
});

// Continue with other sections using similar pattern...

// Add footer
page.drawText('Documento Médico Confidencial', {
  x: margin,
  y: 40,
  size: 10,
  font: helveticaFont,
  color: rgb(0.5, 0.5, 0.5),
});











// page 2
const logoHeight2 = 50;
const margin2 = 50;
let currentY2 = h2 - margin - logoHeight;



// Add title
currentY2 -= 15; // Space after logo
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
currentY2 = addSectionTitle2('Estado del Paciente', currentY2 - 20);
const additionalDatas = [
  [`Piel: ${formData.skin}`, `Respiración: ${formData.respiration}`],
  [`Hemorragias: ${formData.bleeding}`, `Dolor: ${formData.pain}`],
  [`Prioridad: ${formData.priority}`, ``],
  [`Molestia Principal: ${formData.principal}`, "" ],
  [`Descripción: ${formData.description}`, "" ],
];


additionalDatas.forEach(([left, right]) => {
  currentY2 = twoColumns2(left, right, currentY2, { style: normalTextStyle });
});
currentY2 = addSectionTitle2('Primeros Auxilios', currentY2 - 20);
const parte2 = [
  [`Nivel de Conciencia: ${formData.conLevel}`, `Ruidos Respiratorios: ${formData.respiratoryNoise}`],
  [`Pupilas: ${formData.pupile}`, `O2: ${formData.o2}`],
  [`Dosis: ${formData.medicineDosis}` ,`Hora: ${formData.medicineHour}` ],
  [`Medicamentos: ${formData.medicine}`, ``],
  [`Primeros Auxilios: ${formData.aux}`, ``],
];


parte2.forEach(([left, right]) => {
  currentY2 = twoColumns2(left, right, currentY2, { style: normalTextStyle });
});

currentY2 = addSectionTitle2('Hospital', currentY2 - 20);
const hospital = [
  [`Hospital: ${formData.hospital}`, `Médico Receptor: ${formData.medRec}`],
  [`Código de Traslado: ${formData.codeTras}`, ``],
  
  
];


hospital.forEach(([left, right]) => {
  currentY2 = twoColumns2(left, right, currentY2, { style: normalTextStyle });
});

currentY2 = addSectionTitle2('Personal', currentY2 - 20);
const personal = [
  [`Jefe de Servicios: ${formData.serviceC}`, `T.UM: ${formData.tUM1}`],
  [`T.UM: ${formData.tUM2}`, `Médico: ${formData.serviceM}`],
  [`Operador: ${formData.medicineDosis}` ,`` ],

];


personal.forEach(([left, right]) => {
  currentY2 = twoColumns2(left, right, currentY2, { style: normalTextStyle });
});

// Continue with other sections using similar pattern...

// Add footer
page2.drawText('Documento Médico Confidencial', {
  x: margin,
  y: 40,
  size: 10,
  font: helveticaFont,
  color: rgb(0.5, 0.5, 0.5),
});
































    // 5. Embed signature image if exists
    const canvas = sigCanvasRef.current;
    if (canvas && !canvas.isEmpty()) {
      const sigDataUrl = canvas.getCanvas().toDataURL('image/png');
      const sigBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigDims = sigImage.scale(0.5);
      page2.drawImage(sigImage, {
        x: width - sigDims.width - 120,
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
  };

  return (
    <motion.div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-2xl font-bold mb-4">Formulario de Paciente - Ambulancias TVR</h1>

      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <label className="flex flex-col">
          <span className="flex items-center mb-1"><Calendar className="mr-1" size={16}/> Fecha</span>
          <input type="date" name="date" onChange={handleChange} className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="flex items-center mb-1"><Hash className="mr-1" size={16}/> Unidad Nº</span>
          <input type="number" inputMode="numeric" pattern="[0-9]*" name="unit" onChange={handleChange} className="p-2 border rounded" />
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
        <label className="flex flex-col"><span>Tipo de llamada</span><input type="text" name="callType" onChange={handleChange} className="p-2 border rounded" /></label>
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
        <label className="flex flex-col "><span>Alergias</span><input type="text" name="alergies" onChange={handleChange} className="p-2 border rounded" /></label>
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
        <label className="flex flex-col"><span>Hemorragias</span><select name="bleeding" onChange={handleChange} className="p-2 border rounded"><option value="Normal">Ninguna</option><option value="Min.">Min.</option><option value="Mod.">Mod.</option><option value="Sev.">Sev.</option></select></label>
        <label className="flex flex-col"><span>Dolor</span><select name="pain" onChange={handleChange} className="p-2 border rounded"><option value="Normal">Ninguna</option><option value="Min.">Min.</option><option value="Mod.">Mod.</option><option value="Sev.">Sev.</option></select></label>
      
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

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col"><span>Ruidos Respiratorios</span><select name="respiratoryNoise" onChange={handleChange} className="p-2 border rounded"><option value="Normales">Normales</option><option value="Estertores">Estertores</option><option value="Estridor">Estridor</option><option value="Roncus">Roncus</option><option value="Sibilancias">Sibilancias</option></select></label>
        <label className="flex flex-col"><span>Pupilas</span><select name="pupile" onChange={handleChange} className="p-2 border rounded"><option value="Normales">Normales</option><option value="Dilatadas">Dilatadas</option><option value="Contraidas">Contraidas</option><option value="Asimétricas">Asimétricas</option></select></label>

   <label className="flex flex-col md:col-span-2"><span>Primeros Auxilios</span><input type="text" placeholder='R.C.P, Vendajes, ETC...' name="aux" onChange={handleChange} className="p-2 border rounded" /></label>
   <label className="flex flex-col"><span>O2</span><select name="o2" onChange={handleChange} className="p-2 border rounded"><option value="No">No</option><option value="Sí">Sí</option></select></label>
  <label className="flex flex-col"><span>Medicamentos</span><input type="text" name="medicine" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Dosis</span><input type="text" name="medicineDosis" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Hora</span><input type="time" name="medicineHour" onChange={handleChange} className="p-2 border rounded" /></label>
        
        <label className="flex flex-col"><span>Código de traslado al Hospital</span><input type="number" inputMode="numeric" pattern="[0-9]*" name="codeTras" onChange={handleChange} className="p-2 border rounded" /></label>

<label className="flex flex-col"><span>Hospital</span><input type="text" name="hospital" onChange={handleChange} className="p-2 border rounded" /></label>

</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            
        <label className="flex flex-col"><span>Jefe de Servicios</span><input type="text" name="serviceC" onChange={handleChange} className="p-2 border rounded" /></label>

        <label className="flex flex-col"><span>T. UM</span><input type="text" name="tUM1" onChange={handleChange} className="p-2 border rounded" /></label>

        <label className="flex flex-col"><span>T. UM</span><input type="text" name="tUM2" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Médico</span><input type="text" name="serviceM" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Operador</span><input type="text"  name="operator" onChange={handleChange} className="p-2 border rounded" /></label>
      </div>{/* (igual que antes: date, unit, shift, horarios, transporte, datos) */}




       
      {/* Signature pad */}
      <div className="mb-4">
        <span className="block font-semibold mb-1">Firma:</span>
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
