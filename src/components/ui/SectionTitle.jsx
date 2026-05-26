const SectionTitle = ({ eyebrow, title, subtitle, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    {eyebrow && (
      <p className="text-[#C9A96E] text-xs font-bold tracking-[0.28em] uppercase mb-3">{eyebrow}</p>
    )}
    <div className={`gold-line ${!center ? 'ml-0' : ''}`} />
    <h2 className="font-display leading-tight mt-3" style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 'clamp(2rem, 3vw, 2.8rem)',
      fontWeight: 800,
      color: '#1A1714',
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    }}>
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-sm leading-relaxed max-w-xl mx-auto" style={{
        fontFamily: "'Jost', sans-serif",
        fontWeight: 600,
        color: '#5a5048',
        fontSize: '0.86rem',
      }}>{subtitle}</p>
    )}
  </div>
);

export default SectionTitle;