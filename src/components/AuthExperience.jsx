import { AuthCard } from './AuthCard';
import '../styles/auth-experience.css';

export function AuthExperience({ onAuthenticated, dark }) {
  return <div className="territory-auth">
    <div className="territory-form"><AuthCard onAuthenticated={onAuthenticated} dark={dark}/></div>
    <aside className="territory-scene">
      <div className="territory-copy"><p>MAP ANALYTIC AI</p><h2>Un territorio.<br/>Muchas señales.</h2><p>Observa la actividad sísmica y conecta los reportes de tu comunidad.</p></div>
      <svg viewBox="0 0 600 800" aria-hidden="true">
        <g fill="none" stroke="currentColor" opacity=".35">
          {[65, 115, 165, 215].map(radius => <circle key={radius} cx="300" cy="490" r={radius}/>)}
          <path d="M60 490h480M300 250v480M130 320l340 340M130 660l340-340"/>
          <path d="m160 470 50-90 90 25 55-55 85 100-20 95-100 40-65-45Z" strokeWidth="2"/>
        </g>
        <path d="M300 490 300 275 A215 215 0 0 1 485 380Z" fill="currentColor" opacity=".1"/>
        <g fill="currentColor"><circle cx="210" cy="420" r="7"/><circle cx="380" cy="540" r="7"/><circle cx="300" cy="490" r="9"/></g>
      </svg>
      <div className="territory-caption">Observa. Reporta. Verifica.<small>Monitoreo sísmico · Evidencia comunitaria</small></div>
    </aside>
  </div>;
}
