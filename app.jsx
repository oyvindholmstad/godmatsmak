// ---------- seo ----------
const GM_BASE_URL = 'https://godmatsmak.no';

function tidTilISO(tid) {
  const t = tid.toLowerCase();
  const h = t.match(/(\d+)\s*t/)?.[1];
  const m = t.match(/(\d+)\s*min/)?.[1];
  if (!h && !m) return undefined;
  return `PT${h ? h + 'H' : ''}${m ? m + 'M' : ''}`;
}

// ---------- data ----------
async function lastOppskrifter() {
  const manifest = await fetch('recipes/index.json').then(r => r.json());
  const recipes = await Promise.all(
    manifest.map(id => fetch(`recipes/${id}.json`).then(r => r.json()))
  );
  return recipes;
}

async function lastFilosofi() {
  return fetch('kjokkenfilosofi.json').then(r => r.json());
}

function dagensIndeks(antall) {
  if (!antall) return 0;
  const d = new Date();
  const dager = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  return ((dager % antall) + antall) % antall;
}

function velgIllustrasjon(r) {
  if (r.illustrasjon === 'bolle') return IllBolle;
  return IllTallerken;
}

function webpFra(p) {
  return p ? p.replace(/\.(jpe?g|png)$/i, '.webp') : p;
}

function GMBilde({ src, alt, width, height, eager, style }) {
  return (
    <picture>
      <source type="image/webp" srcSet={webpFra(src)} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : undefined}
        style={style}
      />
    </picture>
  );
}

function RecipeBilde({ r, size, runde }) {
  if (r.bilde) {
    return (
      <GMBilde
        src={r.bilde}
        alt={r.navn}
        width={size}
        height={size}
        style={{
          width: size, height: size, objectFit: 'cover', display: 'block',
          borderRadius: runde ? '50%' : 0,
        }}
      />
    );
  }
  const Ill = velgIllustrasjon(r);
  return <Ill size={size} />;
}

// ---------- responsive ----------
function useIsMobile(bp = 760) {
  const [m, setM] = React.useState(() => typeof window !== 'undefined' && window.innerWidth < bp);
  React.useEffect(() => {
    const onR = () => setM(window.innerWidth < bp);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, [bp]);
  return m;
}

// ---------- palette ----------
const GM = {
  cream: '#EFE8DA',
  paper: '#F5EFE0',
  dark: '#3C2A1E',
  ink: '#2A1D14',
  rust: '#8B2D1F',
  rustDark: '#6B1F13',
  mute: '#8A7A6B',
};

// ---------- illustrations ----------
function IllTallerken({ size = 260, label = 'kjøttkaker' }) {
  const rust = '#8B2D1F';
  const dark = '#3C2A1E';
  const cream = '#EFE8DA';
  const warm = '#D9B384';
  return (
    <div style={{ position: 'relative', width: size, height: size }} aria-label={label}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: cream, border: `2px solid ${dark}` }} />
      <div style={{ position: 'absolute', inset: '8%', borderRadius: '50%', border: `1px solid ${dark}`, opacity: 0.35 }} />
      <div style={{ position: 'absolute', left: '22%', top: '30%', width: '28%', height: '28%', borderRadius: '50%', background: dark, boxShadow: `inset -6px -6px 0 ${rust}` }} />
      <div style={{ position: 'absolute', left: '50%', top: '25%', width: '28%', height: '28%', borderRadius: '50%', background: dark, boxShadow: `inset -6px -6px 0 ${rust}` }} />
      <div style={{ position: 'absolute', left: '35%', top: '50%', width: '28%', height: '28%', borderRadius: '50%', background: dark, boxShadow: `inset -6px -6px 0 ${rust}` }} />
      <div style={{ position: 'absolute', left: '20%', top: '28%', width: '62%', height: '42%', borderRadius: '50%', background: `radial-gradient(ellipse at 40% 40%, ${warm} 0%, transparent 65%)`, mixBlendMode: 'multiply', opacity: 0.6 }} />
    </div>
  );
}

function IllBolle({ size = 260, label = 'fiskegrateng' }) {
  const rust = '#8B2D1F';
  const dark = '#3C2A1E';
  const gyllen = '#D9A441';
  const topp = '#E8C57A';
  const topper = [
    { l: '18%', t: '28%', s: 22 },
    { l: '32%', t: '24%', s: 28 },
    { l: '50%', t: '26%', s: 24 },
    { l: '66%', t: '23%', s: 30 },
    { l: '78%', t: '30%', s: 20 },
    { l: '22%', t: '42%', s: 26 },
    { l: '42%', t: '40%', s: 30 },
    { l: '62%', t: '44%', s: 24 },
    { l: '78%', t: '48%', s: 22 },
    { l: '28%', t: '58%', s: 22 },
    { l: '48%', t: '60%', s: 26 },
    { l: '68%', t: '62%', s: 20 },
  ];
  return (
    <div style={{ position: 'relative', width: size, height: size }} aria-label={label}>
      <div style={{ position: 'absolute', left: '6%', right: '6%', top: '18%', bottom: '14%', borderRadius: '14px', background: dark }} />
      <div style={{ position: 'absolute', left: '10%', right: '10%', top: '22%', bottom: '18%', borderRadius: '10px', background: gyllen }} />
      <div style={{ position: 'absolute', left: '2%', top: '38%', width: '8%', height: '22%', background: dark, borderRadius: '4px 0 0 4px' }} />
      <div style={{ position: 'absolute', right: '2%', top: '38%', width: '8%', height: '22%', background: dark, borderRadius: '0 4px 4px 0' }} />
      {topper.map((k, i) => (
        <div key={i} style={{ position: 'absolute', left: k.l, top: k.t, width: k.s, height: k.s, borderRadius: '50%', background: topp, boxShadow: `inset -3px -3px 0 ${rust}44` }} />
      ))}
      <div style={{ position: 'absolute', left: '38%', top: '34%', width: 14, height: 10, borderRadius: '50%', background: rust, opacity: 0.7 }} />
      <div style={{ position: 'absolute', left: '58%', top: '54%', width: 12, height: 8, borderRadius: '50%', background: rust, opacity: 0.7 }} />
      <div style={{ position: 'absolute', left: '30%', top: '6%', fontSize: 18, color: dark, opacity: 0.4, fontFamily: 'serif' }}>∼</div>
      <div style={{ position: 'absolute', left: '52%', top: '3%', fontSize: 22, color: dark, opacity: 0.35, fontFamily: 'serif' }}>∼</div>
    </div>
  );
}

function IllStempel({ tall = '01', tekst = 'MATSMAK', size = 140 }) {
  const rust = '#8B2D1F';
  const dark = '#3C2A1E';
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${dark}` }} />
      <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: `1px solid ${rust}`, opacity: 0.5 }} />
      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: size * 0.32, color: dark, fontStyle: 'italic' }}>{tall}</div>
        <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: size * 0.09, letterSpacing: '0.2em', color: rust, marginTop: 6, fontWeight: 500 }}>{tekst}</div>
      </div>
    </div>
  );
}

// ---------- shared components ----------
function GMRule({ thick = 2, mt = 0, mb = 0, color }) {
  return <div style={{ height: thick, background: color || GM.ink, marginTop: mt, marginBottom: mb }} />;
}

function GMLabel({ nr, children, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: color || GM.ink }}>
      {nr && <span style={{ color: GM.rust }}>{nr}</span>}
      <span>{children}</span>
    </div>
  );
}

function GMSok({ recipes, onOpen, onLukk }) {
  const [q, setQ] = React.useState('');
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onLukk(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const treff = React.useMemo(() => {
    if (!recipes) return [];
    const s = q.trim().toLowerCase();
    if (!s) return recipes;
    return recipes.filter(r => {
      const hay = [
        r.navn, r.undertittel, r.kategori, r.smak, r.ingress,
        ...r.ingredienser.flatMap(g => [g.gruppe, ...g.rader.map(x => x.n)]),
      ].join(' ').toLowerCase();
      return hay.includes(s);
    });
  }, [q, recipes]);

  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 1px)', right: 0,
      width: 'min(480px, calc(100vw - 32px))',
      background: GM.cream, border: `2px solid ${GM.ink}`,
      boxShadow: `6px 6px 0 ${GM.ink}`, zIndex: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${GM.ink}22` }}>
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Søk i navn, smak eller ingrediens…"
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            padding: '16px 18px', fontFamily: '"Libre Caslon Text", serif',
            fontStyle: 'italic', fontSize: 20, color: GM.ink,
          }}
        />
        <button onClick={onLukk} aria-label="Lukk søk" style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '0 18px', fontSize: 22, color: GM.ink,
        }}>×</button>
      </div>
      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        {treff.length === 0 ? (
          <div style={{ padding: '22px 18px', fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 18, color: GM.ink, opacity: 0.7 }}>
            Ingen treff. Prøv «fiskesaus», «saus» eller «mormor».
          </div>
        ) : treff.map(r => {
          const Ill = velgIllustrasjon(r);
          return (
            <button key={r.id} onClick={() => onOpen(r.id)} style={{
              display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 14,
              alignItems: 'center', width: '100%', textAlign: 'left',
              padding: '14px 18px', background: 'transparent', border: 'none',
              borderBottom: `1px solid ${GM.ink}14`, cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.background = GM.paper}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 48, height: 48, background: GM.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${GM.ink}15`, overflow: 'hidden' }}>
                <RecipeBilde r={r} size={48} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: 18, color: GM.ink, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.navn}</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', color: GM.rust, marginTop: 4 }}>
                  {r.kategori.toUpperCase()} · {r.tid.toUpperCase()}
                </div>
              </div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', color: GM.rust }}>→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GMNav({ onNav, aktiv = 'forside', recipes, onOpenOppskrift }) {
  const mobil = useIsMobile();
  const [sokOpen, setSokOpen] = React.useState(false);
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    if (!sokOpen) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setSokOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [sokOpen]);

  const lenker = [
    { id: 'forside', n: 'Forside' },
    { id: 'oppskrifter', n: 'Oppskrifter' },
  ];

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: mobil ? '12px 16px' : '18px 40px', borderBottom: `1px solid ${GM.ink}22`, background: GM.cream, position: 'sticky', top: 0, zIndex: 10 }}>
      <div onClick={() => onNav('forside')} style={{ cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', fontSize: mobil ? 9 : 11, letterSpacing: mobil ? '0.18em' : '0.28em', color: GM.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {mobil ? 'GOD MATSMAK' : <>GOD&nbsp;MATSMAK &nbsp;·&nbsp; EST.&nbsp;2026 &nbsp;·&nbsp; HAFJELL</>}
      </div>
      {!mobil && (
        <div style={{ display: 'flex', gap: 28 }}>
          {lenker.map(l => (
            <button key={l.id} onClick={() => onNav(l.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, color: GM.ink,
              fontWeight: aktiv === l.id ? 600 : 400,
              borderBottom: aktiv === l.id ? `2px solid ${GM.rust}` : '2px solid transparent',
              paddingBottom: 3,
            }}>{l.n}</button>
          ))}
        </div>
      )}
      <div ref={wrapRef} style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
        {mobil && (
          <button onClick={() => onNav(aktiv === 'forside' ? 'oppskrifter' : 'forside')} style={{
            background: 'none', color: GM.ink, border: `1px solid ${GM.ink}`, cursor: 'pointer',
            padding: '6px 12px', borderRadius: 999,
            fontFamily: '"Space Grotesk", sans-serif', fontSize: 12,
          }}>{aktiv === 'forside' ? 'Oppskrifter' : 'Forside'}</button>
        )}
        <button onClick={() => setSokOpen(o => !o)} aria-label="Søk oppskrift" style={{
          background: sokOpen ? GM.ink : 'none', color: sokOpen ? GM.cream : GM.ink,
          border: `1px solid ${GM.ink}`, cursor: 'pointer',
          padding: mobil ? '6px 12px' : '6px 14px', borderRadius: 999,
          fontFamily: '"Space Grotesk", sans-serif', fontSize: 12,
        }}>{mobil ? 'Søk' : 'Søk oppskrift'}</button>
        {sokOpen && (
          <GMSok
            recipes={recipes}
            onOpen={(id) => { setSokOpen(false); onOpenOppskrift(id); }}
            onLukk={() => setSokOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}

function GMFooter({ onNav }) {
  const mobil = useIsMobile();
  const lenker = [
    { id: 'forside', n: 'Forside' },
    { id: 'oppskrifter', n: 'Oppskrifter' },
  ];
  return (
    <footer style={{ background: GM.ink, color: GM.cream, padding: mobil ? '40px 16px 28px' : '60px 40px 40px', marginTop: mobil ? 50 : 80 }}>
      <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '3fr 1fr', gap: mobil ? 28 : 40 }}>
        <div>
          <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: mobil ? 28 : 36, fontStyle: 'italic', lineHeight: 1 }}>God Matsmak.</div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.2em', marginTop: 10, color: GM.cream, opacity: 0.7 }}>SMAK SOM SMAKER. INGENTING ANNET.</div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.2em', marginBottom: 14, opacity: 0.6 }}>LES</div>
          {lenker.map(l => (
            <button key={l.id} onClick={() => onNav(l.id)} style={{
              display: 'block', background: 'none', border: 'none', padding: 0,
              color: GM.cream, cursor: 'pointer', textAlign: 'left',
              fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, marginBottom: 6,
            }}>{l.n}</button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: mobil ? 36 : 60, paddingTop: 20, borderTop: `1px solid ${GM.cream}22`, display: 'flex', flexDirection: mobil ? 'column' : 'row', gap: mobil ? 8 : 0, justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em', opacity: 0.6 }}>
        <span>© 2026 GOD MATSMAK — ALLE RETTER RESERVERT</span>
        <span>«MAT SOM SMAKER. FOOD WHICH TASTES.»</span>
      </div>
    </footer>
  );
}

// ---------- recipe cards ----------
function GMKortMinimal({ r, onClick }) {
  const mobil = useIsMobile();
  const bSize = mobil ? 88 : 140;
  return (
    <article onClick={onClick} style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: mobil ? `${bSize}px 1fr` : '140px 1fr auto', gap: mobil ? 16 : 24, alignItems: 'center', padding: mobil ? '18px 0' : '24px 0', borderBottom: `1px solid ${GM.ink}20` }}>
      <div style={{ width: bSize, height: bSize, background: GM.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${GM.ink}15`, overflow: 'hidden' }}>
        <RecipeBilde r={r} size={r.bilde ? bSize : Math.round(bSize * 0.78)} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', color: GM.rust }}>{r.nr} &nbsp;·&nbsp; {r.kategori.toUpperCase()}</div>
        <h3 style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: mobil ? 22 : 28, lineHeight: 1.05, margin: '6px 0 8px', color: GM.ink }}>{r.navn}</h3>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 14, color: GM.ink, opacity: 0.7, margin: 0 }}>{r.undertittel}</p>
        {mobil && (
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.18em', color: GM.ink, opacity: 0.6, marginTop: 8 }}>
            {r.tid.toUpperCase()} · {r.smaker} SMAKER <span style={{ color: GM.rust, opacity: 1 }}>· LES →</span>
          </div>
        )}
      </div>
      {!mobil && (
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em', color: GM.ink, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span>{r.tid.toUpperCase()}</span>
          <span style={{ opacity: 0.5 }}>{r.smaker} SMAKER</span>
          <span style={{ marginTop: 10, color: GM.rust }}>LES →</span>
        </div>
      )}
    </article>
  );
}

function GMKortStempel({ r, onClick }) {
  return (
    <article onClick={onClick} style={{ cursor: 'pointer', background: GM.paper, border: `2px solid ${GM.ink}`, padding: 28, position: 'relative', display: 'flex', flexDirection: 'column', gap: 20, aspectRatio: '4/5' }}>
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <IllStempel tall={r.nr.replace('№ ', '')} tekst="GOD SMAK" size={86} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 20, overflow: 'hidden' }}>
        <RecipeBilde r={r} size={220} />
      </div>
      <div>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', color: GM.rust, marginBottom: 6 }}>{r.kategori.toUpperCase()} &nbsp;·&nbsp; {r.tid.toUpperCase()}</div>
        <h3 style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 28, lineHeight: 1, margin: 0, color: GM.ink, fontStyle: 'italic' }}>{r.navn}</h3>
      </div>
    </article>
  );
}

// ---------- forside ----------
function GMKjenningsmelodi() {
  const audioRef = React.useRef(null);
  const [spiller, setSpiller] = React.useState(false);

  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => setSpiller(false);
    a.addEventListener('ended', onEnd);
    return () => a.removeEventListener('ended', onEnd);
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (spiller) { a.pause(); setSpiller(false); }
    else { a.play(); setSpiller(true); }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 28, border: `2px solid ${GM.ink}`, padding: '10px 16px 10px 10px', background: GM.paper }}>
      <button onClick={toggle} aria-label={spiller ? 'Pause kjenningsmelodi' : 'Spill kjenningsmelodi'} style={{
        width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: GM.rust, color: GM.cream,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, paddingLeft: spiller ? 0 : 3,
      }}>
        {spiller ? (
          <span style={{ display: 'inline-flex', gap: 3 }}>
            <span style={{ width: 4, height: 14, background: GM.cream }} />
            <span style={{ width: 4, height: 14, background: GM.cream }} />
          </span>
        ) : (
          <span style={{
            width: 0, height: 0,
            borderLeft: `10px solid ${GM.cream}`,
            borderTop: '7px solid transparent',
            borderBottom: '7px solid transparent',
          }} />
        )}
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', color: GM.rust }}>KJENNINGSMELODI</span>
        <span style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 18, color: GM.ink, marginTop: 4 }}>
          {spiller ? 'Spiller nå…' : 'Trykk for å smake'}
        </span>
      </div>
      <audio ref={audioRef} src="god-matsmak.mp3" preload="none" />
    </div>
  );
}

function GMHero({ antall, hovedIll }) {
  const Hoved = hovedIll || IllTallerken;
  const mobil = useIsMobile();
  return (
    <section style={{ padding: mobil ? '32px 16px 24px' : '60px 40px 40px', position: 'relative' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobil ? '1fr' : '1fr auto 1fr',
        gap: mobil ? 32 : 40,
        alignItems: 'center',
      }}>
        <div>
          <GMLabel>Oppskrifter som smaker</GMLabel>
          <div style={{ height: mobil ? 18 : 30 }} />
          <h1 style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 'clamp(56px, 14vw, 128px)', lineHeight: 0.88, margin: 0, color: GM.ink, letterSpacing: '-0.03em' }}>
            God<br/>
            <span style={{ fontStyle: 'italic', color: GM.rust }}>Matsmak.</span>
          </h1>
          <div style={{ height: mobil ? 18 : 26 }} />
          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: mobil ? 16 : 17, color: GM.ink, opacity: 0.75, lineHeight: 1.55, maxWidth: 440, margin: 0 }}>
            Her finnes ingen dårlige smaker. Bare god mat.
            Som smaker mat. Mat som smaker. Du skjønner tegninga.
          </p>
          <GMKjenningsmelodi />
        </div>
        {!mobil && <div style={{ width: 1, alignSelf: 'stretch', background: GM.ink, opacity: 0.2 }} />}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: mobil ? -10 : -20, right: mobil ? 0 : -10, transform: 'rotate(12deg)', zIndex: 1 }}>
            <IllStempel tall="✓" tekst="GOD SMAK" size={mobil ? 84 : 120} />
          </div>
          <Hoved size={mobil ? 240 : 340} />
        </div>
      </div>
      <GMRule mt={mobil ? 30 : 50} thick={2} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
        {[
          { k: 'Dårlige smaker', v: '0' },
          { k: 'Gode smaker', v: String(antall) },
        ].map((s, i) => (
          <div key={s.k} style={{ padding: mobil ? '16px 14px' : '20px 24px', borderRight: i < 1 ? `1px solid ${GM.ink}22` : 'none' }}>
            <div style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: mobil ? 28 : 36, color: GM.ink, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', color: GM.ink, opacity: 0.6, marginTop: 8 }}>{s.k.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <GMRule thick={2} />
    </section>
  );
}

function GMSeksjonTittel({ nr, tittel, undertittel }) {
  const mobil = useIsMobile();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 2fr', gap: mobil ? 16 : 40, padding: mobil ? '40px 16px 20px' : '60px 40px 30px', alignItems: 'end' }}>
      <div>
        <GMLabel nr={nr}>Oppskrifter</GMLabel>
      </div>
      <div>
        <h2 style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 'clamp(36px, 7vw, 72px)', lineHeight: 1, margin: 0, color: GM.ink, letterSpacing: '-0.02em' }}>{tittel}</h2>
        {undertittel && (
          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 16, color: GM.ink, opacity: 0.7, marginTop: 14, maxWidth: 560 }}>{undertittel}</p>
        )}
      </div>
    </div>
  );
}

function GMSitat({ sitat, nr }) {
  const mobil = useIsMobile();
  if (!sitat) return null;
  const nrStr = String(nr ?? 1).padStart(2, '0');
  return (
    <section style={{ background: GM.ink, color: GM.cream, padding: mobil ? '60px 20px' : '100px 40px', textAlign: 'center', margin: mobil ? '40px 0' : '60px 0', position: 'relative' }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.3em', opacity: 0.5, marginBottom: 30 }}>KJØKKENFILOSOFI №{nrStr}</div>
      <blockquote style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.15, maxWidth: 1000, margin: '0 auto', fontStyle: 'italic', letterSpacing: '-0.01em' }}>
        <span style={{ color: GM.rust, fontSize: '1.2em' }}>«</span>
        {sitat.tekst}
        <span style={{ color: GM.rust, fontSize: '1.2em' }}>»</span>
      </blockquote>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.3em', opacity: 0.6, marginTop: 30 }}>— {sitat.av.toUpperCase()}</div>
    </section>
  );
}

function GMForside({ recipes, onOpen, onSeAlle, sitat, sitatNr }) {
  const utvalgt = recipes[dagensIndeks(recipes.length)];
  const UtvalgtIll = velgIllustrasjon(utvalgt);
  const mobil = useIsMobile();
  return (
    <>
      <GMHero antall={recipes.length} hovedIll={UtvalgtIll} />
      <GMSeksjonTittel
        nr="§ 01"
        tittel={<>Smaker som <span style={{ fontStyle: 'italic', color: GM.rust }}>faktisk</span> smaker.</>}
        undertittel="Ingen snarveier. Ingen ironi på bekostning av osten. Bare oppskrifter som kommer ut av kjøkkenet og smaker som de lover."
      />
      <section style={{ padding: mobil ? '0 16px' : '0 40px', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '3fr 2fr', gap: mobil ? 24 : 60, alignItems: 'center' }}>
        <div onClick={() => onOpen(utvalgt.id)} style={{
          cursor: 'pointer', background: GM.paper, padding: utvalgt.bilde ? 0 : (mobil ? 30 : 60),
          aspectRatio: '5/4', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${GM.ink}15`, overflow: 'hidden',
        }}>
          {utvalgt.bilde
            ? <GMBilde src={utvalgt.bilde} alt={utvalgt.navn} eager style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <UtvalgtIll size={mobil ? 240 : 400} />}
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', color: GM.rust }}>DAGENS SMAK · {utvalgt.tid.toUpperCase()}</div>
          <h3 onClick={() => onOpen(utvalgt.id)} style={{ cursor: 'pointer', fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 'clamp(34px, 7vw, 68px)', lineHeight: 0.95, margin: '14px 0 18px', color: GM.ink, letterSpacing: '-0.02em' }}>{utvalgt.navn}</h3>
          <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: mobil ? 16 : 17, color: GM.ink, opacity: 0.8, lineHeight: 1.55, maxWidth: 460 }}>{utvalgt.ingress}</p>
          <button onClick={() => onOpen(utvalgt.id)} style={{ marginTop: 28, padding: '12px 22px', cursor: 'pointer', background: GM.ink, color: GM.cream, border: 'none', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em' }}>LES OPPSKRIFTEN →</button>
        </div>
      </section>
      <GMSitat sitat={sitat} nr={sitatNr} />
      <section style={{ padding: mobil ? '50px 16px' : '80px 40px', textAlign: 'center', borderTop: `1px solid ${GM.ink}22`, borderBottom: `1px solid ${GM.ink}22` }}>
        <GMLabel>Alle oppskriftene</GMLabel>
        <h3 style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 'clamp(32px, 7vw, 64px)', lineHeight: 1, margin: '20px auto 16px', color: GM.ink, maxWidth: 900, letterSpacing: '-0.02em' }}>
          {recipes.length} oppskrifter. <span style={{ fontStyle: 'italic', color: GM.rust }}>Null</span> dårlige.
        </h3>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 16, color: GM.ink, opacity: 0.7, maxWidth: 520, margin: '0 auto 30px' }}>
          Bla gjennom hele samlingen. Vi har tørket av tallerkenen for deg.
        </p>
        <button onClick={onSeAlle} style={{ padding: '14px 28px', cursor: 'pointer', background: GM.rust, color: GM.cream, border: 'none', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, letterSpacing: '0.22em' }}>SE ALLE OPPSKRIFTER →</button>
      </section>
    </>
  );
}

// ---------- oppskriftsliste ----------
function GMOppskriftListe({ recipes, onOpen }) {
  const mobil = useIsMobile();
  return (
    <>
      <section style={{ padding: mobil ? '36px 16px 20px' : '60px 40px 30px' }}>
        <GMLabel nr="§ 01">Alle oppskrifter</GMLabel>
        <h1 style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 'clamp(48px, 11vw, 112px)', lineHeight: 0.9, margin: '24px 0 20px', color: GM.ink, letterSpacing: '-0.03em' }}>
          Hele <span style={{ fontStyle: 'italic', color: GM.rust }}>samlingen</span>.
        </h1>
        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: mobil ? 16 : 17, color: GM.ink, opacity: 0.75, lineHeight: 1.55, maxWidth: 560, margin: 0 }}>
          {recipes.length} oppskrifter som er kvalitetssikret, smakt på,
          og godkjent av minst én bestemor.
        </p>
        <GMRule mt={mobil ? 28 : 40} thick={2} />
      </section>
      <div style={{ padding: mobil ? '0 16px' : '0 40px' }}>
        {recipes.map(r => (
          <GMKortMinimal key={r.id} r={r} onClick={() => onOpen(r.id)} />
        ))}
      </div>
      <div style={{ height: 60 }} />
    </>
  );
}

// ---------- oppskrift detaljer ----------
function GMPorsjonJuster({ porsjoner, setPorsjoner }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, border: `1px solid ${GM.ink}` }}>
      <button onClick={() => setPorsjoner(Math.max(1, porsjoner - 1))} style={{ width: 36, height: 36, border: 'none', background: GM.cream, cursor: 'pointer', fontSize: 18, color: GM.ink, borderRight: `1px solid ${GM.ink}` }}>−</button>
      <div style={{ minWidth: 70, textAlign: 'center', padding: '0 12px', fontFamily: '"Libre Caslon Text", serif', fontSize: 20, color: GM.ink, fontStyle: 'italic' }}>{porsjoner} pors.</div>
      <button onClick={() => setPorsjoner(porsjoner + 1)} style={{ width: 36, height: 36, border: 'none', background: GM.cream, cursor: 'pointer', fontSize: 18, color: GM.ink, borderLeft: `1px solid ${GM.ink}` }}>+</button>
    </div>
  );
}

function formaterMengde(m, faktor) {
  const n = m * faktor;
  if (n < 1) {
    const brøker = [[0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.66, '⅔'], [0.75, '¾']];
    const match = brøker.find(b => Math.abs(n - b[0]) < 0.05);
    if (match) return match[1];
    return n.toFixed(2).replace(/\.?0+$/, '');
  }
  return (Math.round(n * 10) / 10).toString().replace('.', ',');
}

function GMDelKnapp({ navn }) {
  const [tilstand, setTilstand] = React.useState('idle');

  const del = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: navn, url });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setTilstand('kopiert');
      setTimeout(() => setTilstand('idle'), 2000);
    } catch {
      setTilstand('feil');
      setTimeout(() => setTilstand('idle'), 2000);
    }
  };

  const etikett = tilstand === 'kopiert' ? 'KOPIERT ✓'
    : tilstand === 'feil' ? 'KUNNE IKKE KOPIERE'
    : 'DEL OPPSKRIFT →';

  return (
    <button onClick={del} style={{
      background: 'none', border: `1px solid ${GM.ink}`, cursor: 'pointer',
      padding: '6px 12px', borderRadius: 999, color: GM.ink,
      fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.18em',
    }}>{etikett}</button>
  );
}

function GMVakenSkjerm() {
  const stottes = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  const [vil, setVil] = React.useState(false);
  const [aktiv, setAktiv] = React.useState(false);
  const lockRef = React.useRef(null);

  React.useEffect(() => {
    if (!stottes) return;

    let cancelled = false;

    const slipp = async () => {
      const l = lockRef.current;
      lockRef.current = null;
      setAktiv(false);
      if (l) { try { await l.release(); } catch {} }
    };

    const skaff = async () => {
      if (lockRef.current || document.visibilityState !== 'visible') return;
      try {
        const l = await navigator.wakeLock.request('screen');
        if (cancelled || !vil) { try { await l.release(); } catch {} return; }
        lockRef.current = l;
        setAktiv(true);
        l.addEventListener('release', () => {
          if (lockRef.current === l) {
            lockRef.current = null;
            setAktiv(false);
          }
        });
      } catch {
        setAktiv(false);
      }
    };

    if (vil) skaff(); else slipp();

    const onVis = () => { if (vil && document.visibilityState === 'visible') skaff(); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVis);
      slipp();
    };
  }, [vil, stottes]);

  if (!stottes) return null;

  return (
    <button
      onClick={() => setVil(v => !v)}
      aria-pressed={aktiv}
      title={aktiv ? 'Skjermen holdes våken' : 'Skjermen kan slukke'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: aktiv ? GM.rust : 'transparent',
        color: aktiv ? GM.cream : GM.ink,
        border: `1px solid ${aktiv ? GM.rust : GM.ink}`,
        cursor: 'pointer', padding: '8px 12px',
        fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em',
      }}
    >
      <span aria-hidden="true" style={{
        width: 8, height: 8, borderRadius: '50%',
        background: aktiv ? GM.cream : 'transparent',
        border: `1px solid ${aktiv ? GM.cream : GM.ink}`,
      }} />
      HOLD SKJERMEN PÅ
    </button>
  );
}

function GMTimer() {
  const mobil = useIsMobile();
  const [sek, setSek] = React.useState(0);
  const [kjor, setKjor] = React.useState(false);
  React.useEffect(() => {
    if (!kjor) return;
    const id = setInterval(() => setSek(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [kjor]);
  const mm = String(Math.floor(sek / 60)).padStart(2, '0');
  const ss = String(sek % 60).padStart(2, '0');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: mobil ? 8 : 12, padding: mobil ? '8px 12px' : '12px 16px', background: GM.ink, color: GM.cream }}>
      {!mobil && <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', opacity: 0.7 }}>TIDTAKER</span>}
      <span style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: mobil ? 22 : 28, fontStyle: 'italic', letterSpacing: '-0.02em' }}>{mm}:{ss}</span>
      <button onClick={() => setKjor(!kjor)} style={{ background: GM.rust, color: GM.cream, border: 'none', cursor: 'pointer', padding: '6px 10px', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em' }}>{kjor ? 'PAUSE' : 'START'}</button>
      <button onClick={() => { setSek(0); setKjor(false); }} style={{ background: 'transparent', color: GM.cream, border: `1px solid ${GM.cream}44`, cursor: 'pointer', padding: '6px 8px', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.2em' }}>NULL</button>
    </div>
  );
}

function GMOppskrift({ recipes, id, onBack }) {
  const mobil = useIsMobile();
  const r = recipes.find(x => x.id === id) || recipes[0];
  const Ill = velgIllustrasjon(r);
  const [porsjoner, setPorsjoner] = React.useState(r.porsjoner);
  const [krysset, setKrysset] = React.useState({});
  const [steg, setSteg] = React.useState({});
  const faktor = porsjoner / r.porsjoner;

  React.useEffect(() => {
    setPorsjoner(r.porsjoner);
    setKrysset({});
    setSteg({});
  }, [id]);

  React.useEffect(() => {
    document.title = `${r.navn} — God Matsmak`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: r.navn,
      description: r.ingress,
      recipeCategory: r.kategori,
      recipeYield: `${r.porsjoner} porsjoner`,
      recipeIngredient: r.ingredienser.flatMap(g => g.rader.map(rd => `${rd.m} ${rd.e} ${rd.n}`)),
      recipeInstructions: r.steg.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.t,
        text: s.d,
      })),
      author: { '@type': 'Organization', name: 'God Matsmak' },
    };
    if (r.bilde) jsonLd.image = `${GM_BASE_URL}/${r.bilde}`;
    const iso = tidTilISO(r.tid);
    if (iso) jsonLd.totalTime = iso;

    let el = document.getElementById('recipe-jsonld');
    if (!el) {
      el = document.createElement('script');
      el.id = 'recipe-jsonld';
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.text = JSON.stringify(jsonLd);

    return () => {
      document.getElementById('recipe-jsonld')?.remove();
      document.title = 'God Matsmak — Mat som smaker';
    };
  }, [r.id]);

  const toggle = (k) => setKrysset(p => ({ ...p, [k]: !p[k] }));
  const toggleSteg = (k) => setSteg(p => ({ ...p, [k]: !p[k] }));
  const neste = recipes.find(x => x.id !== r.id) || r;

  return (
    <article>
      <section style={{ padding: mobil ? '24px 16px 36px' : '40px 40px 60px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: mobil ? 20 : 30 }}>
          <button onClick={() => onBack()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', color: GM.ink }}>← TILBAKE</button>
          <GMDelKnapp navn={r.navn} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.3fr 1fr', gap: mobil ? 28 : 60, alignItems: 'center' }}>
          <div>
            <GMLabel nr={r.nr}>{r.kategori}</GMLabel>
            <div style={{ height: mobil ? 16 : 26 }} />
            <h1 style={{ fontFamily: '"Libre Caslon Text", serif', fontWeight: 400, fontSize: 'clamp(44px, 11vw, 104px)', lineHeight: 0.9, margin: 0, color: GM.ink, letterSpacing: '-0.03em' }}>
              {r.navn.split(' ').map((w, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? (
                    <span style={{ fontStyle: 'italic', color: GM.rust }}>{w}</span>
                  ) : w}
                  {i < arr.length - 1 && ' '}
                </React.Fragment>
              ))}
            </h1>
            <div style={{ height: mobil ? 14 : 20 }} />
            <div style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: mobil ? 18 : 22, color: GM.rust }}>{r.undertittel}.</div>
            <div style={{ height: mobil ? 20 : 30 }} />
            <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: mobil ? 16 : 17, color: GM.ink, opacity: 0.8, lineHeight: 1.55, maxWidth: 520, margin: 0 }}>{r.ingress}</p>
            <GMRule mt={mobil ? 28 : 40} mb={mobil ? 16 : 20} />
            <div style={{ display: 'grid', gridTemplateColumns: mobil ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobil ? 14 : 20 }}>
              {[
                ['Tid', r.tid],
                ['Porsjoner', r.porsjoner + ' stk'],
                ['Smak', r.smak],
                ['Smaker', r.smaker],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', color: GM.ink, opacity: 0.5, marginBottom: 6 }}>{k.toUpperCase()}</div>
                  <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: mobil ? 16 : 18, color: GM.ink, fontStyle: 'italic' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{
            background: GM.paper, padding: r.bilde ? 0 : (mobil ? 24 : 40),
            border: `1px solid ${GM.ink}15`, aspectRatio: '1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {r.bilde
              ? <GMBilde src={r.bilde} alt={r.navn} eager style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <Ill size={mobil ? 240 : 340} />}
            <div style={{ position: 'absolute', bottom: mobil ? -16 : -24, right: mobil ? -16 : -24, transform: 'rotate(-8deg)', zIndex: 1 }}>
              <IllStempel tall={r.nr.replace('№ ', '')} tekst="GOD SMAK" size={mobil ? 80 : 110} />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: mobil ? '40px 16px' : '60px 40px', background: GM.paper, borderTop: `2px solid ${GM.ink}`, borderBottom: `2px solid ${GM.ink}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1.6fr', gap: mobil ? 40 : 60 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              <GMLabel nr="§ A">Ingredienser</GMLabel>
              <GMPorsjonJuster porsjoner={porsjoner} setPorsjoner={setPorsjoner} />
            </div>
            {r.ingredienser.map((grp, gi) => (
              <div key={gi} style={{ marginBottom: 30 }}>
                <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: mobil ? 20 : 24, color: GM.ink, fontStyle: 'italic', marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${GM.ink}33` }}>{grp.gruppe}</div>
                {grp.rader.map((rd, ri) => {
                  const k = `${gi}-${ri}`;
                  const on = !!krysset[k];
                  return (
                    <label key={ri} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 0', cursor: 'pointer', borderBottom: `1px dotted ${GM.ink}22`, opacity: on ? 0.4 : 1 }}>
                      <input type="checkbox" checked={on} onChange={() => toggle(k)} style={{ accentColor: GM.rust, width: 18, height: 18, flexShrink: 0 }} />
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: GM.rust, minWidth: 64, textDecoration: on ? 'line-through' : 'none' }}>{formaterMengde(rd.m, faktor)} {rd.e}</span>
                      <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 15, color: GM.ink, flex: 1, textDecoration: on ? 'line-through' : 'none' }}>{rd.n}</span>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              <GMLabel nr="§ B">Slik gjør du</GMLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <GMVakenSkjerm />
                <GMTimer />
              </div>
            </div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {r.steg.map((s, i) => {
                const on = !!steg[i];
                return (
                  <li key={i} onClick={() => toggleSteg(i)} style={{ display: 'grid', gridTemplateColumns: mobil ? '52px 1fr' : '90px 1fr', gap: mobil ? 14 : 24, padding: mobil ? '18px 0' : '24px 0', cursor: 'pointer', borderBottom: `1px solid ${GM.ink}22`, opacity: on ? 0.35 : 1 }}>
                    <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: mobil ? 44 : 72, lineHeight: 0.9, color: on ? GM.ink : GM.rust, fontStyle: 'italic', textDecoration: on ? 'line-through' : 'none' }}>{String(i + 1).padStart(2, '0')}</div>
                    <div>
                      <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: mobil ? 20 : 26, color: GM.ink, marginBottom: 8, letterSpacing: '-0.01em' }}>{s.t}</div>
                      <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: mobil ? 15 : 16, color: GM.ink, opacity: 0.8, lineHeight: 1.55 }}>{s.d}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section style={{ padding: mobil ? '50px 16px' : '80px 40px', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1fr', gap: mobil ? 36 : 60 }}>
        <div>
          <GMLabel nr="§ C">Servér slik</GMLabel>
          <p style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: mobil ? 22 : 30, lineHeight: 1.3, color: GM.ink, marginTop: 16, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{r.servering}</p>
        </div>
        <div>
          <GMLabel nr="§ D">Drikk til</GMLabel>
          <p style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: mobil ? 22 : 30, lineHeight: 1.3, color: GM.ink, marginTop: 16, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{r.par}</p>
        </div>
      </section>

      <section style={{ padding: mobil ? '36px 16px' : '60px 40px', background: GM.ink, color: GM.cream }}>
        <div style={{ display: 'flex', flexDirection: mobil ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobil ? 'flex-start' : 'center', gap: mobil ? 20 : 0 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.22em', opacity: 0.6 }}>NESTE OPPSKRIFT</div>
            <div style={{ fontFamily: '"Libre Caslon Text", serif', fontSize: mobil ? 30 : 44, marginTop: 12, fontStyle: 'italic' }}>{neste.navn}</div>
          </div>
          <button onClick={() => onBack(neste.id)} style={{ background: GM.rust, color: GM.cream, border: 'none', cursor: 'pointer', padding: mobil ? '14px 22px' : '18px 32px', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, letterSpacing: '0.22em' }}>LES DEN →</button>
        </div>
      </section>
    </article>
  );
}

function GMLaster() {
  return (
    <div style={{ padding: '120px 40px', textAlign: 'center' }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.3em', color: GM.rust }}>KOKER OPP…</div>
      <div style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 28, color: GM.ink, marginTop: 14 }}>Henter oppskriftene.</div>
    </div>
  );
}

function GMFeil({ melding }) {
  return (
    <div style={{ padding: '120px 40px', textAlign: 'center' }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.3em', color: GM.rust }}>NOE BRANT</div>
      <div style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 24, color: GM.ink, marginTop: 14, maxWidth: 560, marginInline: 'auto' }}>{melding}</div>
    </div>
  );
}

// ---------- routing ----------
function parseHash(hash) {
  const h = (hash || '').replace(/^#\/?/, '');
  if (!h) return { side: 'forside', id: null };
  const [seg, id] = h.split('/');
  if (seg === 'oppskrift' && id) return { side: 'oppskrift', id };
  if (seg === 'oppskrifter') return { side: 'oppskrifter', id: null };
  return { side: 'forside', id: null };
}

function lagHash({ side, id }) {
  if (side === 'oppskrift' && id) return `#/oppskrift/${id}`;
  if (side === 'oppskrifter') return `#/oppskrifter`;
  return `#/`;
}

function navigerTil(state, { replace } = {}) {
  const next = lagHash(state);
  if (typeof window === 'undefined') return;
  if (window.location.hash === next) return;
  if (replace) window.history.replaceState(null, '', next);
  else window.history.pushState(null, '', next);
}

// ---------- app shell ----------
function App() {
  const init = parseHash(typeof window !== 'undefined' ? window.location.hash : '');
  const [side, setSide] = React.useState(init.side);
  const [oppskriftId, setOppskriftId] = React.useState(init.id || 'kjottkaker-brun-saus');
  const [recipes, setRecipes] = React.useState(null);
  const [filosofi, setFilosofi] = React.useState(null);
  const [sitatNr, setSitatNr] = React.useState(1);
  const [feil, setFeil] = React.useState(null);

  React.useEffect(() => {
    lastOppskrifter()
      .then(setRecipes)
      .catch(e => setFeil(e.message || 'Kunne ikke laste oppskriftene.'));
    lastFilosofi()
      .then(arr => {
        setFilosofi(arr);
        setSitatNr(Math.floor(Math.random() * arr.length) + 1);
      })
      .catch(() => {});
  }, []);

  // Make sure the address bar reflects the current state on first load
  // (e.g. visiting "/" — normalize to "#/").
  React.useEffect(() => {
    navigerTil({ side, id: oppskriftId }, { replace: true });
  }, []);

  // Back/forward navigation
  React.useEffect(() => {
    const onPop = () => {
      const next = parseHash(window.location.hash);
      setSide(next.side);
      if (next.id) setOppskriftId(next.id);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop);
    };
  }, []);

  React.useEffect(() => {
    if (side === 'forside') document.title = 'God Matsmak — Mat som smaker';
    else if (side === 'oppskrifter') document.title = 'Alle oppskrifter — God Matsmak';
  }, [side]);

  const openOppskrift = (id) => {
    setOppskriftId(id);
    setSide('oppskrift');
    navigerTil({ side: 'oppskrift', id });
    window.scrollTo(0, 0);
  };

  const tilbake = (maybeId) => {
    if (typeof maybeId === 'string') {
      setOppskriftId(maybeId);
      navigerTil({ side: 'oppskrift', id: maybeId });
      window.scrollTo(0, 0);
      return;
    }
    setSide('oppskrifter');
    navigerTil({ side: 'oppskrifter' });
    window.scrollTo(0, 0);
  };

  const onNav = (s) => {
    if (s === 'forside') { setSide('forside'); navigerTil({ side: 'forside' }); window.scrollTo(0, 0); }
    else if (s === 'oppskrifter') { setSide('oppskrifter'); navigerTil({ side: 'oppskrifter' }); window.scrollTo(0, 0); }
  };

  return (
    <div>
      <GMNav onNav={onNav} aktiv={side === 'oppskrift' ? 'oppskrifter' : side} recipes={recipes} onOpenOppskrift={openOppskrift} />
      {feil && <GMFeil melding={feil} />}
      {!feil && !recipes && <GMLaster />}
      {!feil && recipes && side === 'forside' && (
        <GMForside
          recipes={recipes}
          onOpen={openOppskrift}
          onSeAlle={() => onNav('oppskrifter')}
          sitat={filosofi ? filosofi[sitatNr - 1] : null}
          sitatNr={sitatNr}
        />
      )}
      {!feil && recipes && side === 'oppskrifter' && (
        <GMOppskriftListe recipes={recipes} onOpen={openOppskrift} />
      )}
      {!feil && recipes && side === 'oppskrift' && (
        <GMOppskrift recipes={recipes} id={oppskriftId} onBack={tilbake} />
      )}
      <GMFooter onNav={onNav} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
