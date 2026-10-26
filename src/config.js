export const BUSINESS_NAME = 'NEXUSFORENSE';
export const BUSINESS_LEGAL_NAME = 'CONSULTARIA LEGAL S.R.L.';
export const CONTACT = {
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, ''),
  email: (import.meta.env.VITE_CONTACT_EMAIL || '').trim(),
  address: (import.meta.env.VITE_OFFICE_ADDRESS || '').trim(),
  hours: (import.meta.env.VITE_OFFICE_HOURS || '').trim()
};
export const AREAS = [
  'Derecho Penal y Procesal Penal',
  'Peritajes y asesoría forense',
  'Derecho Civil',
  'Derecho de Familia',
  'Derecho Laboral',
  'Derecho Constitucional'
];
export const MODALIDADES = ['Virtual', 'Presencial', 'Por coordinar'];
