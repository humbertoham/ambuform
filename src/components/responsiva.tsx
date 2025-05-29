'use client'

import React, { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Hash, ArrowLeft } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { PDFDocument, StandardFonts} from 'pdf-lib';
import Link from 'next/link';


export default function ResponsivaForm() {
  

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
    // Handle file input change
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile(null);
        return;
      }
      setSelectedFile(e.target.files[0]);
    };
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  
    // Handle file input change
    const handleFileChange2 = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile2(null);
        return;
      }
      setSelectedFile2(e.target.files[0]);
    };
  const [selectedFile3, setSelectedFile3] = useState<File | null>(null);
  
    // Handle file input change
    const handleFileChange3 = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile3(null);
        return;
      }
      setSelectedFile3(e.target.files[0]);
    };
  
  const [selectedFile4, setSelectedFile4] = useState<File | null>(null);
  
    // Handle file input change
    const handleFileChange4 = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        setSelectedFile4(null);
        return;
      }
      setSelectedFile4(e.target.files[0]);
    };
  





  const [formData, setFormData] = useState({
    unit:'',
    parent:'',
    nameSol:'',
    nameP:'',
    hospital:'',
    hospital2:'',
    other:'',
    other2:'',
    name1:'',
    name2:'',
    name3:'',
    placas:''
  });
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const sigCanvasRef2 = useRef<SignatureCanvas>(null);
  const sigCanvasRef3 = useRef<SignatureCanvas>(null);
// Refs


const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
 
      setFormData(prev => ({ ...prev, [name]: value }));
    

   



  }; 



  const clearSignature = () => sigCanvasRef.current?.clear();
const clearSignature2 = () => sigCanvasRef2.current?.clear();
const clearSignature3 = () => sigCanvasRef3.current?.clear();
  const handleGeneratePDF = async () => {
    // 1. Load your PDF template from public folder
    const templateBytes = await fetch('/plantilla2.pdf').then(res => res.arrayBuffer());

    // 2. Create a PDFDocument
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();

  // Create variables mapping
   const margin = 50;
  const maxWidth = width - margin * 2;
  const fontSize = 12;
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // 3. Prepare your variables

    function escapeRegExp(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}



  const variables: Record<string, string> = {
    '[NOMBRE DE SOLICITANTE DEL TRASLADO]': formData.nameSol,
    '[PARENTESCO]': formData.parent,
    '[NOMBRE DEL PACIENTE]': formData.nameP,
    '[HOSPITAL]': formData.other || formData.hospital,
    '[HOSPITAL_2]': formData.other2 || formData.hospital2,
    '[NOMBRE 1]': formData.name1,
    '[NOMBRE 2]': formData.name2,
    '[NOMBRE 3]': formData.name3,
    '[FECHA automática]': new Date().toLocaleDateString('es-MX'),
    '[opción de 01 a 10]': formData.unit,
    '[Placas]': formData.placas,
  };

  // 4. Build template
  const template = `
Yo [NOMBRE DE SOLICITANTE DEL TRASLADO] [PARENTESCO] de [NOMBRE DEL PACIENTE] autorizo se realice traslado del [HOSPITAL] al [HOSPITAL_2], aceptando las condiciones y riesgos que puedan suceder en el trayecto.

Deslindando de cualquier responsabilidad a la Empresa y al Personal de Ambulancias TVR con nombres: [NOMBRE 1], [NOMBRE 2], [NOMBRE 3]. Que realizará el traslado hoy [FECHA automática] en la unidad [opción de 01 a 10] con placas [Placas].
`.trim();

  // 5. Replace (with escaped keys)
  let filled = template;
  for (const [key, val] of Object.entries(variables)) {
    const re = new RegExp(escapeRegExp(key), 'g');
    filled = filled.replace(re, val);
  }

  // 6. Wrap text into lines
  const lines: string[] = [];
  for (const para of filled.split('\n')) {
    const words = para.split(' ').filter(w => w);
    if (!words.length) { lines.push(''); continue; }

    let line = words[0];
    for (let i = 1; i < words.length; i++) {
      const test = `${line} ${words[i]}`;
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    lines.push(line);
  }

  // 7. Draw onto the PDF
  let y = 570;
  for (const ln of lines) {
    page.drawText(ln, {
      x: margin,
      y,
      size: fontSize,
      font,
    });
    y -= fontSize * 1.5;
  }

    // 4. Draw text fields at positions matching your template
   // First, ensure you have the logo image added to your PDF
// (Assuming you've loaded the logo image as 'logoImage')



if (selectedFile) {
  // Carga la imagen
  const imgUrl = URL.createObjectURL(selectedFile);
  const img = new Image();
  img.src = imgUrl;

  await new Promise((res, rej) => {
    img.onload = () => res(true);
    img.onerror = rej;
  });

  // Fija la altura deseada
  const fixedHeight = 50; // en píxeles
  const aspectRatio = img.width / img.height;
  const fixedWidth = fixedHeight * aspectRatio;

  // Redibuja la imagen redimensionada en un canvas
  const canvas = document.createElement('canvas');
  canvas.width = fixedWidth;
  canvas.height = fixedHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, fixedWidth, fixedHeight);

  // Convierte a blob JPEG (para reducir tamaño real)
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
  );
  const imgBytes = await blob.arrayBuffer();

  // Embebe la imagen redimensionada real (no zoom, no grande)
  const embeddedImage = await pdfDoc.embedJpg(imgBytes);
  const { width, height } = embeddedImage.size();

  // Dibuja en el PDF con las dimensiones reales
  page.drawImage(embeddedImage, {
    x: 250,
    y: 270,
    width,
    height,
  });

  // Limpieza
  URL.revokeObjectURL(imgUrl);
}

if (selectedFile2) {
  // Carga la imagen
  const imgUrl = URL.createObjectURL(selectedFile2);
  const img = new Image();
  img.src = imgUrl;

  await new Promise((res, rej) => {
    img.onload = () => res(true);
    img.onerror = rej;
  });

  // Fija la altura deseada
  const fixedHeight = 50; // en píxeles
  const aspectRatio = img.width / img.height;
  const fixedWidth = fixedHeight * aspectRatio;

  // Redibuja la imagen redimensionada en un canvas
  const canvas = document.createElement('canvas');
  canvas.width = fixedWidth;
  canvas.height = fixedHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, fixedWidth, fixedHeight);

  // Convierte a blob JPEG (para reducir tamaño real)
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
  );
  const imgBytes = await blob.arrayBuffer();

  // Embebe la imagen redimensionada real (no zoom, no grande)
  const embeddedImage = await pdfDoc.embedJpg(imgBytes);
  const { width, height } = embeddedImage.size();

  // Dibuja en el PDF con las dimensiones reales
  page.drawImage(embeddedImage, {
    x: 250,
    y: 200,
    width,
    height,
  });

  // Limpieza
  URL.revokeObjectURL(imgUrl);
}

if (selectedFile3) {
  // Carga la imagen
  const imgUrl = URL.createObjectURL(selectedFile3);
  const img = new Image();
  img.src = imgUrl;

  await new Promise((res, rej) => {
    img.onload = () => res(true);
    img.onerror = rej;
  });

  // Fija la altura deseada
  const fixedHeight = 50; // en píxeles
  const aspectRatio = img.width / img.height;
  const fixedWidth = fixedHeight * aspectRatio;

  // Redibuja la imagen redimensionada en un canvas
  const canvas = document.createElement('canvas');
  canvas.width = fixedWidth;
  canvas.height = fixedHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, fixedWidth, fixedHeight);

  // Convierte a blob JPEG (para reducir tamaño real)
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
  );
  const imgBytes = await blob.arrayBuffer();

  // Embebe la imagen redimensionada real (no zoom, no grande)
  const embeddedImage = await pdfDoc.embedJpg(imgBytes);
  const { width, height } = embeddedImage.size();

  // Dibuja en el PDF con las dimensiones reales
  page.drawImage(embeddedImage, {
    x: 250,
    y: 120,
    width,
    height,
  });

  // Limpieza
  URL.revokeObjectURL(imgUrl);
}

if (selectedFile4) {
  // Carga la imagen
  const imgUrl = URL.createObjectURL(selectedFile4);
  const img = new Image();
  img.src = imgUrl;

  await new Promise((res, rej) => {
    img.onload = () => res(true);
    img.onerror = rej;
  });

  // Fija la altura deseada
  const fixedHeight = 50; // en píxeles
  const aspectRatio = img.width / img.height;
  const fixedWidth = fixedHeight * aspectRatio;

  // Redibuja la imagen redimensionada en un canvas
  const canvas = document.createElement('canvas');
  canvas.width = fixedWidth;
  canvas.height = fixedHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, fixedWidth, fixedHeight);

  // Convierte a blob JPEG (para reducir tamaño real)
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.8)
  );
  const imgBytes = await blob.arrayBuffer();

  // Embebe la imagen redimensionada real (no zoom, no grande)
  const embeddedImage = await pdfDoc.embedJpg(imgBytes);
  const { width, height } = embeddedImage.size();

  // Dibuja en el PDF con las dimensiones reales
  page.drawImage(embeddedImage, {
    x: 250,
    y: 50,
    width,
    height,
  });

  // Limpieza
  URL.revokeObjectURL(imgUrl);
}




















    // 5. Embed signature image if exists
    const canvas = sigCanvasRef.current;
    if (canvas && !canvas.isEmpty()) {
      const sigDataUrl = canvas.getCanvas().toDataURL('image/png');
      const sigBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigDims = sigImage.scale(0.5);
      page.drawImage(sigImage, {
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
      page.drawImage(sigImage, {
        x: width - sigDims.width - 80,
        y: 50,
        width: sigDims.width,
        height: sigDims.height,
      });
    }
     const canvas3 = sigCanvasRef3.current;
    if (canvas3 && !canvas3.isEmpty()) {
      const sigDataUrl = canvas3.getCanvas().toDataURL('image3/png');
      const sigBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());
      const sigImage = await pdfDoc.embedPng(sigBytes);
      const sigDims = sigImage.scale(0.5);
      page.drawImage(sigImage, {
        x: width - sigDims.width - 420,
        y: 180,
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
    a.download = `reporte_${formData.nameP || 'paciente'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

     


  };






  return (
    <motion.div className="p-4 max-w-3xl pb-6 mx-auto bg-white shadow-md rounded-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Link href='/' className='underline text-blue-600'><ArrowLeft className='mr-2 inline' /> Formulario del paciente </Link>

      <h1 className="text-2xl font-bold mb-4">Responsiva- Ambulancias TVR</h1>

      {/* Campos del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

        
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
        <label className="flex flex-col"><span>Nombre del Solicitante</span><input type="text" name="nameSol" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Parentesco</span><input type="text" name="parent" onChange={handleChange} className="p-2 border rounded" /></label>
        <label className="flex flex-col"><span>Nombre del Paciente</span><input type="text" name="nameP" onChange={handleChange} className="p-2 border rounded" /></label>
           <label className="flex flex-col"><span>Del Hospital</span><select name="hospital" onChange={handleChange} className="p-2 border rounded">
          <option value="Morelos">Morelos</option><option value="Central">Central</option>
          <option value="General">General</option>
          <option value="Infantil">Infantil</option>
          <option value="Militar">Militar</option>
          <option value="Issste">Issste</option>
          <option value="Impe">Impe</option>
           <option value="Otro">Otro</option>
          </select></label>
          {formData.hospital === "Otro" && (
        <label className="flex flex-col"><span>Del Otro</span><input type="text" name="other" onChange={handleChange} className="p-2 border rounded" /></label>
  )
}
  <label className="flex flex-col"><span>Al Hospital</span><select name="hospital2" onChange={handleChange} className="p-2 border rounded">
          <option value="Morelos">Morelos</option><option value="Central">Central</option>
          <option value="General">General</option>
          <option value="Infantil">Infantil</option>
          <option value="Militar">Militar</option>
          <option value="Issste">Issste</option>
          <option value="Impe">Impe</option>
           <option value="Otro">Otro</option>
          </select></label>
          {formData.hospital2 === "Otro" && (
        <label className="flex flex-col"><span>Al Otro</span><input type="text" name="other2" onChange={handleChange} className="p-2 border rounded" /></label>
  )
}

 <label className="flex flex-col"><span>Nombre 1:</span><input type="text" name="name1" onChange={handleChange} className="p-2 border rounded" /></label>
    <label className="flex flex-col"><span>Nombre 2:</span><input type="text" name="name2" onChange={handleChange} className="p-2 border rounded" /></label>    
<label className="flex flex-col"><span>Nombre 3:</span><input type="text" name="name3" onChange={handleChange} className="p-2 border rounded" /></label>

 <label className="flex flex-col"><span>Placas</span><input type="text" name="placas" onChange={handleChange} className="p-2 border rounded" /></label>

       
      </div>

       <label className="flex flex-col"><span>Ine 1 por enfrente</span><input type="file"
        accept="image/*"
        onChange={handleFileChange} className="p-2 border rounded" /></label>
         <label className="flex flex-col"><span>Ine 1 por atrás</span><input type="file"
        accept="image/*"
        onChange={handleFileChange2} className="p-2 border rounded" /></label>
         <label className="flex flex-col"><span>Ine 2 por enfrente</span><input type="file"
        accept="image/*"
        onChange={handleFileChange3} className="p-2 border rounded" /></label>
         <label className="flex flex-col"><span>Ine 2 por atrás</span><input type="file"
        accept="image/*"
        onChange={handleFileChange4} className="p-2 border rounded" /></label>



       
      {/* Signature pad */}
      <div className="mb-4">
        <span className="block font-semibold mb-1">Firma de Responsable:</span>
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
        <span className="block font-semibold mb-1">Firma de Jefe de Turno:</span>
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

<span className="block font-semibold mb-1">Firma de Testigo:</span>
        <SignatureCanvas
  penColor="black"
  ref={sigCanvasRef3}
  canvasProps={{
    width: 300, // definido en píxeles
    height: 200,
    className: 'border rounded'
  }}
/>
        <button onClick={clearSignature3} className="mt-2 px-4 py-2 hover:bg-blue-600  border rounded">Borrar firma</button>

      </div>
     

      {/* Botón para generar PDF */}
    
      <div className="text-right">
        <button onClick={() => window.location.reload()} className="px-4 mr-4 py-2 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 focus:outline-none focus:ring">
          Resetear PDF
        </button>
        <button onClick={handleGeneratePDF} className="px-4 py-2 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 focus:outline-none focus:ring">
          Generar PDF
        </button>
      </div>
    </motion.div>
  );
}

// Nota: Coloca tu plantilla `plantilla.pdf` en la carpeta `/public` de tu PWA.  
