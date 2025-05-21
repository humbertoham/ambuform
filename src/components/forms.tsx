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

    // 3. Embed a font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 4. Draw text fields at positions matching your template
    page.drawText(`Fecha: ${formData.date}`, { x: 50, y: height - 100, size: 12, font: helveticaFont, color: rgb(0, 0, 0) });
    page.drawText(`Unidad Nº: ${formData.unit}`, { x: 50, y: height - 120, size: 12, font: helveticaFont });
    page.drawText(`Turno: ${formData.shift}`, { x: 50, y: height - 140, size: 12, font: helveticaFont });

    // Horarios
    let yPos = height - 180;
    Object.entries(formData.times).forEach(([k, v]) => {
      page.drawText(`H. ${k}: ${v}`, { x: 70, y: yPos, size: 12, font: helveticaFont });
      yPos -= 20;
    });

    // Transporte y datos básicos
    page.drawText(`Transporte: ${formData.transport}`, { x: 50, y: yPos - 10, size: 12, font: helveticaFont });
    page.drawText(`Ubicación: ${formData.location}`, { x: 50, y: yPos - 40, size: 12, font: helveticaFont });
    page.drawText(`Nombre: ${formData.name}`, { x: 50, y: yPos - 60, size: 12, font: helveticaFont });
    page.drawText(`Dirección: ${formData.address}`, { x: 50, y: yPos - 80, size: 12, font: helveticaFont });
    page.drawText(`Edad: ${formData.age}`, { x: 50, y: yPos - 100, size: 12, font: helveticaFont });
    page.drawText(`Sexo: ${formData.sex}`, { x: 50, y: yPos - 120, size: 12, font: helveticaFont });

    // 5. Embed signature image if exists
    const canvas = sigCanvasRef.current;
    if (canvas && !canvas.isEmpty()) {
      const sigDataUrl = canvas.getTrimmedCanvas().toDataURL('image/png');
      const sigBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigDims = sigImage.scale(0.5);
      page.drawImage(sigImage, {
        x: width - sigDims.width - 50,
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
          <input type="number" name="unit" onChange={handleChange} className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="mb-1">Turno</span>
           <label className="flex flex-col"><select name="shift" onChange={handleChange} className="p-2 border rounded"><option value="Mañana">Mañana</option><option value="Tarde">Tarde</option><option value="Noche">Noche</option></select></label>
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
        <label className="flex flex-col"><span>Edad</span><input type="number" name="age" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Sexo</span><select name="sex" onChange={handleChange} className="p-2 border rounded"><option value="M">M</option><option value="F">F</option></select></label>
      </div>{/* (igual que antes: date, unit, shift, horarios, transporte, datos) */}

        <div className="mb-6">
  <span className="block font-semibold mb-1">Señalamiento de Heridas:</span>
  <div className="relative border rounded overflow-hidden" style={{width: '650px', height: '650px'}}>
 
    <canvas
      ref={drawingCanvasRef}
      width={650}
      height={650}
      className="w-full z-20 h-full"
      onMouseDown={(e) => {
        const canvas = drawingCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calcular escala correcta
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const startX = (e.clientX - rect.left) * scaleX;
        const startY = (e.clientY - rect.top) * scaleY;

        // Configurar estilo del pincel
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        const draw = (moveEvent: MouseEvent) => {
          const moveX = (moveEvent.clientX - rect.left) * scaleX;
          const moveY = (moveEvent.clientY - rect.top) * scaleY;
          
          ctx.lineTo(moveX, moveY);
          ctx.stroke();
        };

        const stopDrawing = () => {
          window.removeEventListener('mousemove', draw);
          window.removeEventListener('mouseup', stopDrawing);
        };

        window.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);
      }}
    />
     
  </div>
  <button
    onClick={() => {
      const canvas = drawingCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }}
    className="mt-2 px-4 py-2 border hover:bg-blue-600 rounded"
  >
    Borrar dibujo
  </button>
</div>
      {/* Signature pad */}
      <div className="mb-4">
        <span className="block font-semibold mb-1">Firma:</span>
        <SignatureCanvas penColor="black" canvasProps={{ className: 'border rounded w-full', style: { height: 200 } }} ref={sigCanvasRef} />
        <button onClick={clearSignature} className="mt-2 px-4 py-2 hover:bg-blue-600  border rounded">Borrar firma</button>
      </div>

      {/* Botón para generar PDF */}
      <div className="text-right">
        <button onClick={handleGeneratePDF} className="px-4 py-2 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 focus:outline-none focus:ring">
          Generar PDF desde plantilla
        </button>
      </div>
    </motion.div>
  );
}

// Nota: Coloca tu plantilla `plantilla.pdf` en la carpeta `/public` de tu PWA.  
