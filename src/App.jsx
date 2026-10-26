import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, BookOpenText, BriefcaseBusiness,
  CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Download, Eye, EyeOff, FileSearch, Fingerprint,
  Gavel, Landmark, LockKeyhole, LogOut, Mail, MapPin, Menu, MessageCircle,
  Phone, Scale, Search, Send, ShieldCheck, Sparkles, Trash2, UsersRound, X
} from 'lucide-react';
import { api } from './api.js';
import { AREAS, BUSINESS_LEGAL_NAME, BUSINESS_NAME, CONTACT, MODALIDADES } from './config.js';

const SERVICE_DATA = [
  {
    title: AREAS[0], short: 'Defensa y procedimiento penal', icon: Gavel,
    text: 'Orientación y acompañamiento en actuaciones e investigaciones penales, elaboración de estrategias de defensa y revisión procesal.',
    tags: ['Investigación', 'Defensa', 'Proceso penal']
  },
  {
    title: AREAS[1], short: 'Análisis técnico especializado', icon: Fingerprint,
    text: 'Asesoría en el análisis de elementos técnicos y periciales, revisión documental y apoyo estratégico en controversias que requieren enfoque forense.',
    tags: ['Análisis pericial', 'Revisión técnica', 'Asesoría']
  },
  {
    title: AREAS[2], short: 'Solución de controversias civiles', icon: Landmark,
    text: 'Asesoramiento en obligaciones, contratos, responsabilidad civil y resolución de conflictos patrimoniales.',
    tags: ['Contratos', 'Obligaciones', 'Patrimonio']
  },
  {
    title: AREAS[3], short: 'Protección de derechos familiares', icon: UsersRound,
    text: 'Orientación en asuntos vinculados con alimentos, tenencia, régimen de visitas y otras materias del ámbito familiar.',
    tags: ['Alimentos', 'Tenencia', 'Visitas']
  },
  {
    title: AREAS[4], short: 'Relaciones y derechos laborales', icon: BriefcaseBusiness,
    text: 'Asesoría en derechos y obligaciones laborales, controversias derivadas del empleo y revisión de documentación de trabajo.',
    tags: ['Contratos', 'Derechos laborales', 'Conflictos']
  },
  {
    title: AREAS[5], short: 'Protección de derechos fundamentales', icon: BookOpenText,
    text: 'Evaluación de situaciones relacionadas con derechos fundamentales y mecanismos jurídicos de protección constitucional.',
    tags: ['Garantías', 'Derechos', 'Protección']
  }
];

const FAQS = [
  { q: '¿Cómo solicito una consulta?', a: 'Completa el formulario con tus datos de contacto, selecciona el área legal y describe brevemente tu situación. El equipo podrá revisar tu solicitud y contactarte para coordinar la atención.' },
  { q: '¿Ofrecen consultas virtuales?', a: 'Puedes elegir atención virtual, presencial o por coordinar al enviar tu solicitud. La modalidad y disponibilidad se confirman directamente al establecer contacto.' },
  { q: '¿Qué debo preparar antes de una consulta?', a: 'Es útil contar con fechas importantes, documentos relevantes y una descripción clara de lo sucedido. No envíes información extremadamente sensible en el formulario inicial.' },
  { q: '¿El formulario inicia automáticamente una representación legal?', a: 'No. El envío del formulario permite registrar una solicitud de contacto, pero no implica aceptación de patrocinio ni establece por sí solo una relación abogado-cliente.' }
];

const STATUS = ['Nueva', 'En revisión', 'Contactada', 'Cerrada'];
const initialForm = { nombre: '', email: '', telefono: '', area: '', modalidad: 'Por coordinar', mensaje: '', acepta_datos: false, website: '' };

function Brand({ light = false }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href="/#inicio" aria-label="NEXUSFORENSE, ir al inicio">
    <span className="brand-emblem" aria-hidden="true">
      <svg viewBox="0 0 54 54" fill="none" role="img">
        <path d="M7 44V10l12 8v26H7Z" fill="#FF283E"/>
        <path d="M19 18 41 44H28L7 20V10l12 8Z" fill="#FFFFFF"/>
        <path d="M33 10h12v34h-8V25L25 10h8Z" fill="#FF283E"/>
      </svg>
    </span>
    <span className="brand-copy"><strong><span>NEXUS</span><span>FORENSE</span></strong><small>{BUSINESS_LEGAL_NAME}</small></span>
  </a>;
}

function SectionHeading({ eyebrow, title, subtitle, center = false }) {
  return <div className={`section-heading ${center ? 'text-center' : ''}`}>
    <span className="eyebrow"><span className="eyebrow-line" />{eyebrow}</span>
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('inicio');
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
      const ids = ['inicio', 'nosotros', 'especialidades', 'proceso', 'preguntas', 'contacto'];
      const currently = [...ids].reverse().find(id => document.getElementById(id)?.getBoundingClientRect().top <= 165);
      setActive(currently || 'inicio');
    };
    onScroll();window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open && window.innerWidth <= 850 ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  const navItems = [['Inicio','#inicio'],['Nosotros','#nosotros'],['Especialidades','#especialidades'],['Metodología','#proceso'],['Preguntas','#preguntas'],['Contacto','#contacto']];
  const close = () => setOpen(false);
  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="container header-inner">
      <Brand light />
      <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Navegación principal" id="menu-principal">
        {navItems.map(([label, href]) => <a key={href} href={href} aria-current={active===href.slice(1) ? 'location':undefined} onClick={close}>{label}</a>)}
        <a className="mobile-contact" href="#consulta" onClick={close}>Solicitar consulta <ArrowUpRight size={17}/></a>
      </nav>
      <a className="header-cta" href="#consulta"><CalendarDays size={16}/> Solicitar consulta <ArrowRight size={17}/></a>
      <button type="button" className="menu-button" aria-controls="menu-principal" aria-expanded={open} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(v => !v)}>{open ? <X size={24}/> : <Menu size={24}/>}</button>
    </div>
  </header>;
}

function Hero() {
  return <section className="hero" id="inicio" aria-labelledby="hero-title">
    <div className="hero-gridlines" aria-hidden="true"/>
    <div className="container hero-content">
      <div className="hero-copy">
        <div className="hero-kicker">CRITERIO JURÍDICO <span>·</span> VISIÓN ESTRATÉGICA <span>·</span> RIGOR TÉCNICO</div>
        <h1 id="hero-title">Defensa legal estratégica <em>con enfoque forense.</em></h1>
        <p>Asesoría y acompañamiento jurídico para personas y empresas. Analizamos cada situación con método, confidencialidad y una estrategia orientada a tus necesidades.</p>
        <div className="hero-buttons"><a href="#consulta" className="button button-gold"><CalendarDays size={19}/> Solicitar consulta <ArrowRight size={18}/></a><a href="#especialidades" className="button button-outline">Explorar especialidades <ArrowRight size={18}/></a></div>
        <div className="hero-foot"><span className="hero-foot-mark"><ShieldCheck size={19}/></span><span>Atención individual · Información reservada<br/><strong>Tu caso merece ser escuchado.</strong></span></div>
      </div>
      <div className="hero-side-stamp" aria-hidden="true"><span className="hero-side-rule"/><span>ASESORÍA JURÍDICA<br/>CON VISIÓN Y<br/><strong>COMPROMISO</strong></span></div>
    </div>
    <a className="scroll-indicator" href="#especialidades" aria-label="Ver nuestras especialidades"><span>CONOCE NUESTROS SERVICIOS</span><ArrowDown size={17}/></a>
  </section>;
}

function PrinciplesStrip() {
  const data = [
    [<BookOpenText size={28} key="i"/>, '06', 'Áreas de especialidad'],
    [<FileSearch size={28} key="i"/>, 'Análisis técnico', 'Enfoque jurídico y forense'],
    [<ShieldCheck size={28} key="i"/>, 'Confidencialidad', 'Tratamiento responsable'],
    [<MessageCircle size={28} key="i"/>, 'Atención cercana', 'Comunicación clara']
  ];
  return <div className="principles"><div className="container principles-inner">{data.map(([icon, label, detail]) => <div className="principle" key={label}><span className="principle-icon">{icon}</span><span><strong>{label}</strong><small>{detail}</small></span></div>)}</div></div>;
}

function Services({ onService }) {
  return <section className="services-section section-pad" id="especialidades"><div className="container">
    <div className="services-layout">
      <div className="services-intro"><SectionHeading eyebrow="NUESTRAS ÁREAS DE PRÁCTICA" title={<>Nuestras <em>especialidades</em></>} subtitle="Asesoramiento jurídico integral que combina análisis, estrategia y atención personalizada."/><a className="services-explore" href="#consulta">¿No sabes qué área necesitas? <ArrowRight size={17}/></a></div>
      <div className="services-grid">{SERVICE_DATA.map((service) => {
        const Icon=service.icon;
        return <article className="service-card" key={service.title}>
          <span className="service-icon"><Icon size={30} strokeWidth={1.7}/></span>
          <div className="service-body"><h3>{service.title}</h3><p>{service.text}</p><span className="service-short">{service.short}</span></div>
          <button type="button" className="service-link" onClick={() => onService(service.title)} aria-label={`Consultar sobre ${service.title}`}><ArrowUpRight size={19}/></button>
        </article>;
      })}</div>
    </div>
  </div></section>;
}

function About() {
  return <section className="about-section section-pad" id="nosotros"><div className="container about-grid">
    <div className="about-visual">
      <div className="about-watermark"><Scale size={156} strokeWidth={.65}/></div>
      <div className="about-visual-content"><span className="about-mini">NEXUSFORENSE · CONSULTORÍA LEGAL</span><div className="about-big">La mejor defensa<br/>comienza con<br/><em>una estrategia.</em></div><div className="about-divider"/><p>ANÁLISIS · RIGOR · COMPROMISO</p></div>
      <div className="about-floating"><Fingerprint size={22}/><span>ENFOQUE TÉCNICO<br/><strong>Y JURÍDICO</strong></span></div>
    </div>
    <div className="about-copy"><SectionHeading eyebrow="QUIÉNES SOMOS" title={<>Tu tranquilidad,<br/>nuestra <em>prioridad.</em></>} />
      <p className="about-lead">En NEXUSFORENSE creemos que una defensa sólida empieza por comprender los hechos, identificar las opciones legales y comunicar cada paso con claridad.</p>
      <p>Ofrecemos consultoría legal con una mirada estratégica y orientación técnica, procurando que cada persona o empresa reciba una evaluación adecuada a las particularidades de su situación.</p>
      <div className="about-checks"><div><CheckCircle2 size={18}/> Escucha y evaluación individual</div><div><CheckCircle2 size={18}/> Estrategia jurídica adaptada al caso</div><div><CheckCircle2 size={18}/> Trato profesional y comunicación clara</div></div>
      <a href="#consulta" className="text-link">Hablemos sobre tu caso <ArrowRight size={19}/></a>
    </div>
  </div></section>;
}

function TrustSection() {
  const values=[
    {icon:BadgeCheck,title:'Trabajo especializado',text:'Rigor en el estudio de los hechos y la normativa aplicable.'},
    {icon:FileSearch,title:'Estrategia personalizada',text:'Cada situación merece una evaluación de sus propias circunstancias.'},
    {icon:LockKeyhole,title:'Reserva profesional',text:'Cuidado y discreción desde el primer contacto.'},
    {icon:UsersRound,title:'Acompañamiento cercano',text:'Información comprensible sobre los siguientes pasos.'},
  ];
  return <section className="trust-section"><div className="container trust-grid"><div className="trust-heading"><span className="eyebrow"><span className="eyebrow-line"/>NUESTRO COMPROMISO</span><h2>Tu caso en manos<br/>de un equipo <em>comprometido.</em></h2></div>{values.map(({icon:Icon,title,text})=><div key={title} className="trust-item"><Icon size={27} strokeWidth={1.6}/><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>;
}

function Process() {
  const steps=[
    {n:'01',title:'Cuéntanos tu situación',detail:'Registra una descripción general y selecciona el área jurídica.'},
    {n:'02',title:'Evaluación preliminar',detail:'Revisamos tu solicitud y determinamos la información necesaria.'},
    {n:'03',title:'Coordinación de asesoría',detail:'Te contactamos para establecer modalidad y condiciones de atención.'},
    {n:'04',title:'Siguientes pasos',detail:'Con una evaluación profesional, se definen alternativas y acciones.'}
  ];
  return <section className="process-section section-pad" id="proceso"><div className="container process-layout"><div className="process-intro"><SectionHeading eyebrow="NUESTRA METODOLOGÍA" title={<>Un proceso claro,<br/><em>de principio a fin.</em></>} subtitle="Una atención ordenada para que sepas qué esperar desde el primer contacto."/></div><div className="process-grid">{steps.map(({n,title,detail})=><div className="process-step" key={n}><div className="process-num">{n}</div><h3>{title}</h3><p>{detail}</p></div>)}</div></div></section>;
}

function CallToAction() {
  return <section className="cta-section"><div className="container cta-inner"><div><span className="eyebrow eyebrow-invert"><span className="eyebrow-line"/>HABLEMOS DE TU CASO</span><h2>El primer paso empieza <em>hoy.</em></h2><p>Cuéntanos qué necesitas. Nuestro equipo podrá revisar tu solicitud y coordinar contigo la atención.</p></div><a href="#consulta" className="button button-gold"><CalendarDays size={19}/> Solicitar una consulta <ArrowRight size={19}/></a></div></section>;
}

function ContactSection({ selectedArea }) {
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  useEffect(() => { if (selectedArea) setForm(old => ({ ...old, area: selectedArea })); }, [selectedArea]);
  const update = (key, value) => setForm(old => ({ ...old, [key]: value }));
  const send = async (e) => {
    e.preventDefault();
    setBusy(true); setResult(null);
    try {
      const result = await api('/consultas', { method: 'POST', body: JSON.stringify(form) });
      setResult({ ok: true, text: `${result.message} Número de solicitud: #${result.id || '—'}.` });
      setForm(initialForm);
    } catch (err) { setResult({ ok: false, text: err.message }); }
    finally { setBusy(false); }
  };
  const wplink = CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hola, deseo solicitar información sobre una consulta legal con NEXUSFORENSE.')}` : null;
  return <section className="contact-section section-pad" id="contacto"><div className="container contact-grid">
    <div className="contact-copy"><SectionHeading eyebrow="ESTAMOS PARA ESCUCHARTE" title={<>Comencemos por<br/><em>tu consulta.</em></>} subtitle="Comparte tus datos de contacto y un resumen inicial. Te responderemos para coordinar el siguiente paso." />
      <div className="contact-info">
        <div className="contact-info-item"><span><MessageCircle size={21}/></span><div><strong>Atención personalizada</strong><p>Envía tu solicitud mediante nuestro formulario de contacto.</p></div></div>
        {CONTACT.email && <a className="contact-info-item" href={`mailto:${CONTACT.email}`}><span><Mail size={21}/></span><div><strong>Correo electrónico</strong><p>{CONTACT.email}</p></div></a>}
        {CONTACT.whatsapp && <a className="contact-info-item" href={wplink} target="_blank" rel="noopener noreferrer"><span><Phone size={21}/></span><div><strong>WhatsApp</strong><p>Escríbenos directamente <ArrowUpRight size={13}/></p></div></a>}
        {CONTACT.address && <div className="contact-info-item"><span><MapPin size={21}/></span><div><strong>Dirección</strong><p>{CONTACT.address}</p></div></div>}
        {CONTACT.hours && <div className="contact-info-item"><span><CalendarDays size={21}/></span><div><strong>Horario</strong><p>{CONTACT.hours}</p></div></div>}
      </div>
      <div className="contact-note"><ShieldCheck size={18}/><span>Te recomendamos compartir solo la información necesaria para una primera coordinación.</span></div>
    </div>
    <div className="contact-form-panel" id="consulta"><div className="form-top"><span className="form-symbol"><Scale size={22}/></span><div><span className="form-eyebrow">SOLICITUD DE ATENCIÓN</span><h3>Cuéntanos tu caso</h3></div></div>
      <form onSubmit={send} className="contact-form">
        <input value={form.website} onChange={e=>update('website', e.target.value)} type="text" name="website" tabIndex="-1" autoComplete="off" className="honey" aria-hidden="true" />
        <label>Nombre completo <span>*</span><input required minLength={3} maxLength={120} placeholder="Tu nombre y apellidos" value={form.nombre} onChange={e=>update('nombre',e.target.value)}/></label>
        <div className="form-row"><label>Correo electrónico <span>*</span><input type="email" required maxLength={180} placeholder="correo@ejemplo.com" value={form.email} onChange={e=>update('email',e.target.value)}/></label>
          <label>Teléfono <span>*</span><input type="tel" required pattern="[0-9+()\s-]{7,25}" placeholder="Número de contacto" value={form.telefono} onChange={e=>update('telefono',e.target.value)}/></label></div>
        <div className="form-row"><label>Especialidad legal <span>*</span><span className="select-wrap"><select required value={form.area} onChange={e=>update('area',e.target.value)}><option value="">Selecciona una opción</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select><ChevronDown size={17}/></span></label>
          <label>Modalidad preferida <span>*</span><span className="select-wrap"><select required value={form.modalidad} onChange={e=>update('modalidad',e.target.value)}>{MODALIDADES.map(m=><option key={m}>{m}</option>)}</select><ChevronDown size={17}/></span></label></div>
        <label>Descripción breve <span>*</span><textarea required minLength={15} maxLength={2000} rows={4} placeholder="Describe brevemente tu situación y qué asesoría necesitas..." value={form.mensaje} onChange={e=>update('mensaje',e.target.value)}/></label>
        <label className="consent-label"><input type="checkbox" required checked={form.acepta_datos} onChange={e=>update('acepta_datos',e.target.checked)}/><span>Autorizo el uso de mis datos para gestionar esta solicitud y recibir una respuesta de NEXUSFORENSE.</span></label>
        {result && <div className={`form-alert ${result.ok?'form-alert-success':'form-alert-error'}`} role="status">{result.ok ? <CheckCircle2 size={20}/> : <CircleHelp size={20}/>}<span>{result.text}</span></div>}
        <button className="button button-primary form-submit" type="submit" disabled={busy}>{busy ? 'Enviando solicitud...' : 'Enviar solicitud'} <Send size={17}/></button>
        <p className="form-legal">El formulario no genera automáticamente una relación abogado-cliente ni implica aceptación de patrocinio. La atención queda sujeta a confirmación.</p>
      </form>
    </div>
  </div></section>;
}

function Faq() {
  const [active, setActive] = useState(0);
  return <section className="faq-section section-pad" id="preguntas"><div className="container faq-grid"><div><SectionHeading eyebrow="PREGUNTAS FRECUENTES" title={<>Respuestas a tus<br/><em>primeras dudas.</em></>} /><p className="faq-side">¿Necesitas orientación sobre otro asunto? Podemos revisar tu solicitud desde el formulario de contacto.</p><a href="#consulta" className="text-link">Enviar mi pregunta <ArrowUpRight size={18}/></a></div>
    <div className="faq-list">{FAQS.map(({q,a},i) => <div className={`faq-item ${active===i?'active':''}`} key={q}><button onClick={()=>setActive(active===i?-1:i)} type="button" aria-expanded={active===i}><span>{q}</span><span className="faq-plus">{active===i?'−':'+'}</span></button>{active===i && <p>{a}</p>}</div>)}</div>
  </div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="container footer-main"><div className="footer-brand"><Brand light/><p>Consultoría y asesoramiento legal con enfoque jurídico, análisis responsable y comunicación clara.</p></div>
    <div className="footer-column"><h4>Explorar</h4><a href="#inicio">Inicio</a><a href="#especialidades">Especialidades</a><a href="#nosotros">Nosotros</a><a href="#proceso">Cómo trabajamos</a></div>
    <div className="footer-column"><h4>Especialidades</h4><a href="#especialidades">Derecho penal</a><a href="#especialidades">Asesoría forense</a><a href="#especialidades">Derecho civil</a><a href="#especialidades">Familia, laboral y constitucional</a></div>
    <div className="footer-column"><h4>Contactar</h4><a href="#consulta">Solicitar una consulta</a>{CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}{CONTACT.whatsapp && <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}<a href="/admin">Acceso administrativo</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {BUSINESS_NAME} {BUSINESS_LEGAL_NAME}. Todos los derechos reservados.</span><span>Información general, no constituye asesoría jurídica individualizada.</span></div></footer>;
}

function Website() {
  const [selectedArea, setSelectedArea] = useState('');
  const [scrollPct, setScrollPct] = useState(0);
  const chooseService = (title) => {setSelectedArea(title);document.getElementById('consulta')?.scrollIntoView({behavior:'smooth',block:'center'});};
  useEffect(() => {
    const onScroll=()=>{const d=document.documentElement;setScrollPct(Math.max(0,Math.min(100,100*d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight))));};
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  const whatsapp = CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent('Hola, deseo consultar sobre asesoría legal en NEXUSFORENSE.')}` : null;
  return <div className="public-site">
    <div className="page-progress" role="presentation" style={{transform:`scaleX(${scrollPct/100})`}}/>
    <Header/><main><Hero/><PrinciplesStrip/><Services onService={chooseService}/><About/><TrustSection/><Process/><CallToAction/><ContactSection selectedArea={selectedArea}/><Faq/></main><Footer/>
    {whatsapp && <a className="floating-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp"><MessageCircle size={25}/><span>WhatsApp</span></a>}
  </div>;
}

function downloadCSV(items) {
  const headers = ['ID','Fecha (UTC)','Nombre','Email','Teléfono','Área','Modalidad','Estado','Mensaje'];
  const csvCell = (v) => `"${String(v ?? '').replace(/^[=+@-]/, "'$&").replaceAll('"', '""')}"`;
  const rows = items.map(c => [c.id,c.creada_en,c.nombre,c.email,c.telefono,c.area,c.modalidad,c.estado,c.mensaje].map(csvCell).join(','));
  const blob = new Blob(['\ufeff'+[headers.map(csvCell).join(','), ...rows].join('\r\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='nexusforense_consultas.csv';a.click();URL.revokeObjectURL(url);
}

function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const loadData = async () => {const data=await api('/admin/consultas');setItems(data.items);setTotal(data.total);};
  useEffect(() => {api('/admin/me').then(async d=>{setUser(d.email);await loadData();}).catch(()=>{}).finally(()=>setLoading(false));}, []);
  const submitLogin = async (event) => {event.preventDefault();setError('');setSaving(true);try{const d=await api('/admin/login',{method:'POST',body:JSON.stringify({email,password})});setUser(d.email);setPassword('');await loadData();}catch(e){setError(e.message);}finally{setSaving(false);}};
  const logout = async () => {try{await api('/admin/logout',{method:'POST'});}catch{}setUser(null);setItems([]);setSelected(null);};
  const updateStatus = async (id, status) => {setSaving(true);setNotice('');try{const data=await api(`/admin/consultas/${id}`,{method:'PATCH',body:JSON.stringify({estado:status})});setItems(p=>p.map(x=>x.id===id?data.item:x));setSelected(data.item);setNotice('Estado actualizado.');}catch(e){setNotice(e.message);}finally{setSaving(false);}};
  const deleteItem = async (id) => {if (!window.confirm('¿Eliminar permanentemente esta consulta? Esta acción no se puede deshacer.'))return;setSaving(true);try{await api(`/admin/consultas/${id}`,{method:'DELETE'});setItems(p=>p.filter(x=>x.id!==id));setTotal(t=>t-1);setSelected(null);setNotice('Consulta eliminada.');}catch(e){setNotice(e.message);}finally{setSaving(false);}};
  const visible = useMemo(()=>items.filter(c=>(filter==='Todas'||c.estado===filter)&&[c.nombre,c.email,c.telefono,c.area,String(c.id)].join(' ').toLowerCase().includes(query.toLowerCase())),[items,filter,query]);
  const metrics = STATUS.map(status=>({status,n:items.filter(c=>c.estado===status).length}));
  const fmt = iso => new Date(iso).toLocaleString('es-PE',{dateStyle:'medium',timeStyle:'short'});
  if (loading) return <div className="admin-loading">Cargando panel NEXUSFORENSE...</div>;
  if (!user) return <div className="admin-login-page"><div className="admin-login-brand"><Brand light/><a href="/" className="admin-back"><ChevronLeft size={16}/> Volver al sitio</a></div><div className="admin-login-card"><span className="admin-login-icon"><LockKeyhole size={25}/></span><span className="eyebrow"><span className="eyebrow-line"/>ACCESO RESTRINGIDO</span><h1>Panel administrativo</h1><p>Ingresa tus credenciales para consultar las solicitudes recibidas.</p><form onSubmit={submitLogin} className="admin-login-form"><label>Correo del administrador<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo administrativo"/></label><label>Contraseña<div className="password-field"><input required type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña"/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Ocultar contraseña':'Mostrar contraseña'}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>{error&&<div role="alert" className="form-alert form-alert-error">{error}</div>}<button className="button button-primary" disabled={saving} type="submit">{saving?'Verificando...':'Iniciar sesión'} <ArrowRight size={18}/></button></form><div className="login-hint"><ShieldCheck size={15}/> Acceso solo para personal autorizado</div></div></div>;
  return <div className="dashboard"><aside className="dashboard-sidebar"><Brand light/><div className="dashboard-sidebar-label">GESTIÓN INTERNA</div><div className="dashboard-nav-link active"><MessageCircle size={19}/> Solicitudes</div><a href="/" className="dashboard-nav-link"><ArrowUpRight size={19}/> Ver sitio público</a><div className="sidebar-bottom"><span>Sesión iniciada</span><strong>{user}</strong><button type="button" onClick={logout}><LogOut size={17}/> Cerrar sesión</button></div></aside><main className="dashboard-main"><div className="dashboard-top"><div><span className="dashboard-kicker">NEXUSFORENSE / ADMINISTRACIÓN</span><h1>Panel de consultas</h1><p>Gestiona las solicitudes recibidas desde la página web.</p></div><button className="outline-action" type="button" onClick={()=>downloadCSV(visible)} disabled={!visible.length}><Download size={17}/> Exportar CSV</button></div><div className="dashboard-metrics"><div className="metric-card primary"><span>Total de solicitudes</span><strong>{total}</strong><small>Últimas 500 disponibles en esta vista</small></div>{metrics.map(m=><div className="metric-card" key={m.status}><span>{m.status}</span><strong>{m.n}</strong><small>Solicitudes</small></div>)}</div><div className="dashboard-table-card"><div className="dashboard-table-header"><div><h2>Bandeja de solicitudes</h2><p>Selecciona una fila para ver los detalles.</p></div><button className="refresh-action" onClick={()=>loadData().catch(e=>setNotice(e.message))}>Actualizar <ArrowRight size={15}/></button></div><div className="dashboard-tools"><div className="search-box"><Search size={18}/><input aria-label="Buscar solicitudes" placeholder="Buscar por nombre, correo o especialidad" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="filter-wrap"><select aria-label="Filtrar por estado" value={filter} onChange={e=>setFilter(e.target.value)}><option>Todas</option>{STATUS.map(s=><option key={s}>{s}</option>)}</select><ChevronDown size={16}/></div></div>{notice&&<div className="dashboard-notice" role="status">{notice}</div>}<div className="table-scroll"><table className="requests-table"><thead><tr><th>ID</th><th>Solicitante</th><th>Especialidad</th><th>Fecha</th><th>Estado</th><th></th></tr></thead><tbody>{visible.map(c=><tr key={c.id} onClick={()=>setSelected(c)} tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')setSelected(c);}}><td>#{c.id}</td><td><strong>{c.nombre}</strong><span>{c.email}</span></td><td>{c.area}</td><td>{fmt(c.creada_en)}</td><td><span className={`status-pill status-${STATUS.indexOf(c.estado)}`}>{c.estado}</span></td><td><ChevronRight size={18}/></td></tr>)}</tbody></table>{!visible.length && <div className="empty-state"><FileSearch size={29}/><strong>No hay solicitudes para mostrar</strong><span>Prueba otro filtro o consulta de búsqueda.</span></div>}</div></div></main>{selected&&<div className="detail-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><div className="detail-drawer" role="dialog" aria-modal="true" aria-label="Detalle de consulta"><div className="detail-head"><div><span>CONSULTA #{selected.id}</span><h2>{selected.nombre}</h2></div><button type="button" onClick={()=>setSelected(null)} aria-label="Cerrar detalle"><X size={22}/></button></div><div className="detail-body"><span className={`status-pill status-${STATUS.indexOf(selected.estado)}`}>{selected.estado}</span><div className="detail-item"><small>Especialidad</small><strong>{selected.area}</strong></div><div className="detail-item"><small>Modalidad</small><strong>{selected.modalidad}</strong></div><div className="detail-item"><small>Contacto</small><a href={`mailto:${selected.email}`}>{selected.email}</a><a href={`tel:${selected.telefono}`}>{selected.telefono}</a></div><div className="detail-item"><small>Recibido</small><strong>{fmt(selected.creada_en)}</strong></div><div className="detail-item"><small>Descripción</small><p className="detail-message">{selected.mensaje}</p></div><div className="detail-item"><small>Cambiar estado</small><select disabled={saving} value={selected.estado} onChange={e=>updateStatus(selected.id,e.target.value)}>{STATUS.map(s=><option key={s}>{s}</option>)}</select></div><button className="delete-button" disabled={saving} type="button" onClick={()=>deleteItem(selected.id)}><Trash2 size={17}/> Eliminar consulta</button></div></div></div>}</div>;
}

export default function App() {return window.location.pathname.replace(/\/$/,'')==='/admin'?<Admin/>:<Website/>;}
