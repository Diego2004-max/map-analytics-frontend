import { AuthCard } from './AuthCard';
import '../styles/auth-experience.css';

export function AuthExperience({ onAuthenticated, dark }) {
  return <div className="territory-auth">
    <div className="territory-form"><AuthCard onAuthenticated={onAuthenticated} dark={dark}/></div>
    <aside className="territory-scene">
      <div className="territory-copy"><p>MAP ANALYTIC AI</p><h2>Un territorio.<br/>Muchas señales.</h2><p>Observa la actividad sísmica y conecta los reportes de tu comunidad.</p></div>
      <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="400" cy="365" r="65" fill="#ffe6b6"/>
        <path d="M0 540 110 430 220 510 330 400 470 520 600 430V800H0Z" fill="#8b809d"/>
        <path d="M0 610 170 490 310 580 470 495 600 600V800H0Z" fill="#b2a0bc"/>
        <path d="M0 650Q160 540 350 640T600 620V800H0Z" fill="#57506c"/>
        <path d="M430 510Q260 560 410 620T260 800H100Q340 685 285 625T430 510" fill="#d7c5d5"/>
        <g fill="none" stroke="#fff1df" opacity=".4"><ellipse cx="360" cy="580" rx="90" ry="34"/><ellipse cx="360" cy="580" rx="150" ry="57"/><ellipse cx="360" cy="580" rx="210" ry="80"/></g>
        <circle cx="360" cy="580" r="6" fill="#ffe6b6"/>
        <path d="M0 760Q120 690 200 750T600 730V800H0Z" fill="#332f47"/>
      </svg>
      <div className="territory-caption">Del dato a la acción.<small>Monitoreo sísmico · Evidencia comunitaria</small></div>
    </aside>
  </div>;
}
