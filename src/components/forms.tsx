'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Hash, User } from 'lucide-react';

const ReportForm = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-2xl print:p-0 print:shadow-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Formulario de Paciente - Ambulancias TVR</h1>

      {/* Fecha y Turno */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <label className="flex flex-col">
          <span className="flex items-center mb-1"><Calendar className="mr-1" size={16}/> Fecha</span>
          <input type="date" className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="flex items-center mb-1"><Hash className="mr-1" size={16}/> Unidad Nº</span>
          <input type="number" inputMode="numeric" className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="mb-1">Turno</span>
          <input type="text" className="p-2 border rounded" placeholder="Mañana/Tarde/Noche" />
        </label>
      </div>

      {/* Horarios */}
      <fieldset className="mb-4 border p-4 rounded">
        <legend className="font-semibold">Horarios</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Llamada','En Ruta','En Lugar','En Hospital','Unidad Libre'].map(label => (
            <label key={label} className="flex flex-col">
              <span className="flex items-center mb-1"><Clock className="mr-1" size={16}/> H. {label}</span>
              <input type="time" className="p-2 border rounded" />
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
              <input type="radio" name="transporte" className="mr-2" />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Datos básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col">
          <span>Ubicación</span>
          <input type="text" className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span>Nombre</span>
          <input type="text" className="p-2 border rounded" />
        </label>
        <label className="flex flex-col md:col-span-2">
          <span>Dirección</span>
          <input type="text" className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span>Edad</span>
          <input type="number" inputMode="numeric" className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span>Sexo</span>
          <select className="p-2 border rounded">
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </label>
      </div>

      {/* Botón de impresión */}
      <div className="text-right">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 focus:outline-none focus:ring"
        >
          Imprimir PDF
        </button>
      </div>
    </motion.div>
  );
};

export default ReportForm;
