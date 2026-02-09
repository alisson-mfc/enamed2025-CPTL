import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, ReferenceLine, ComposedChart, Line, Area } from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────
const TL = {
  nome: "UFMS — Três Lagoas",
  n: 49, inscritos: 53, presenca: 92.5,
  media: 74.5, mediana: 75.9, dp: 7.6,
  prof: 100.0, profLabel: "100%", // PCP
  rankNT: 19, rankProf: 1, totalCursos: 350,
  percentilNT: 94.6, percentilProf: 100.0,
  rankFedNT: 7, rankFedProf: 1, totalFed: 80, enare: 65.3,
  areas: { "Clínica Médica": 12.7, "Pediatria": 13.2, "Cirurgia Geral": 12.1, "Ginecologia e Obstetrícia": 12.7, "MFC / Saúde Coletiva": 14.6 },
};
const CG = {
  nome: "UFMS — Campo Grande", n: 82, media: 73.6, rankNT: 26, rankProf: null, prof: 92.7,
  areas: { "Clínica Médica": 12.4, "Pediatria": 12.8, "Cirurgia Geral": 11.5, "Ginecologia e Obstetrícia": 12.2, "MFC / Saúde Coletiva": 14.0 },
};
const NAC = {
  n: 39256, media: 65.0, mediana: 64.8, dp: 10.8,
  prof: 67.3, // PCP
  areas: { "Clínica Médica": 11.1, "Pediatria": 11.4, "Cirurgia Geral": 9.8, "Ginecologia e Obstetrícia": 11.2, "MFC / Saúde Coletiva": 12.2 },
};
const FED = {
  n: 6501, media: 69.8, nCursos: 80,
  areas: { "Clínica Médica": 12.1, "Pediatria": 12.3, "Cirurgia Geral": 10.8, "Ginecologia e Obstetrícia": 12.1, "MFC / Saúde Coletiva": 13.3 },
};
const CO = {
  n: 3573, media: 63.5,
  areas: { "Clínica Médica": 10.7, "Pediatria": 10.9, "Cirurgia Geral": 9.4, "Ginecologia e Obstetrícia": 10.8, "MFC / Saúde Coletiva": 11.7 },
};

const porCategoria = [
  { label: "Pública Estadual", media: 71.7 },
  { label: "Pública Federal", media: 69.8 },
  { label: "Comunitária", media: 66.6 },
  { label: "Privada s/ fins", media: 65.0 },
  { label: "Privada c/ fins", media: 62.1 },
  { label: "Especial", media: 61.7 },
  { label: "Pública Municipal", media: 60.5 },
];

const porRegiao = [
  { label: "Sul", media: 67.0 },
  { label: "Nordeste", media: 65.2 },
  { label: "Sudeste", media: 65.2 },
  { label: "Centro-Oeste", media: 63.5 },
  { label: "Norte", media: 61.8 },
];

const porUF = [
  {label:"DF",media:72.3},{label:"RS",media:69.1},{label:"SC",media:68.7},{label:"SP",media:68.4},{label:"PR",media:67.1},
  {label:"PB",media:66.2},{label:"PE",media:66.1},{label:"MG",media:65.9},{label:"CE",media:65.2},{label:"BA",media:64.4},
  {label:"PI",media:64.3},{label:"RJ",media:63.9},{label:"SE",media:63.7},{label:"MS",media:63.2},{label:"MT",media:62.9},
  {label:"GO",media:62.8},{label:"RN",media:62.7},{label:"ES",media:62.2},{label:"MA",media:62.0},{label:"AL",media:61.5},
  {label:"PA",media:61.3},{label:"AM",media:61.2},{label:"TO",media:60.8},{label:"AP",media:59.0},{label:"RO",media:58.3},
  {label:"RR",media:56.3},{label:"AC",media:54.1},
];

const likertData = [
  {v:"QE_I29",l:"Quantidade professores/preceptores",tl:2.71,nac:4.97},
  {v:"QE_I42",l:"Simulação alta fidelidade",tl:3.53,nac:4.89},
  {v:"QE_I32",l:"Coordenação disponível",tl:3.65,nac:4.76},
  {v:"QE_I27",l:"Devolutivas das avaliações",tl:3.86,nac:4.83},
  {v:"QE_I41",l:"Lab. habilidades e simulação",tl:3.94,nac:5.09},
  {v:"QE_I22",l:"Planos de ensino discutidos",tl:4.10,nac:5.03},
  {v:"QE_I30",l:"Equipamentos para prática",tl:4.14,nac:4.91},
  {v:"QE_I49",l:"Estágios redes privadas",tl:4.14,nac:5.10},
  {v:"QE_I24",l:"Avaliações compatíveis",tl:4.18,nac:5.11},
  {v:"QE_I31",l:"Superar dificuldades",tl:4.18,nac:4.78},
  {v:"QE_I40",l:"Ambientes/equipamentos práticos",tl:4.24,nac:4.98},
  {v:"QE_I37",l:"Avaliações periódicas do curso",tl:4.35,nac:5.22},
  {v:"QE_I28",l:"Participação ativa estudantes",tl:4.49,nac:5.17},
  {v:"QE_I33",l:"Articulação teoria-prática",tl:4.49,nac:5.18},
  {v:"QE_I21",l:"Relação professor-aluno",tl:4.53,nac:5.12},
  {v:"QE_I47",l:"Metodologias ativas (PBL)",tl:4.55,nac:5.19},
  {v:"QE_I19",l:"Oportunidades de IC",tl:4.61,nac:4.85},
  {v:"QE_I36",l:"Metodologias desafiadoras",tl:4.65,nac:5.27},
  {v:"QE_I53",l:"Liderança e gestão",tl:4.76,nac:5.29},
  {v:"QE_I26",l:"Avaliações diversificadas",tl:4.82,nac:5.38},
  {v:"QE_I39",l:"Salas adequadas",tl:4.84,nac:5.22},
  {v:"QE_I18",l:"Oportunidades de extensão",tl:4.98,nac:5.08},
  {v:"QE_I23",l:"Referências bibliográficas",tl:4.98,nac:5.34},
  {v:"QE_I34",l:"Conhecimento atualizado",tl:4.98,nac:5.36},
  {v:"QE_I38",l:"Acesso a bibliografias",tl:5.00,nac:5.42},
  {v:"QE_I51",l:"Atuação multiprofissional",tl:5.02,nac:5.52},
  {v:"QE_I43",l:"Integração ensino-serviço",tl:5.06,nac:5.38},
  {v:"QE_I54",l:"Formação reflexiva contínua",tl:5.16,nac:5.57},
  {v:"QE_I25",l:"Domínio conteúdo professores",tl:5.20,nac:5.40},
  {v:"QE_I35",l:"Disciplinas contribuíram",tl:5.20,nac:5.54},
  {v:"QE_I52",l:"Recursos tecnológicos saúde",tl:5.20,nac:5.46},
  {v:"QE_I46",l:"Evidências científicas",tl:5.22,nac:5.58},
  {v:"QE_I48",l:"Estágios redes públicas",tl:5.31,nac:5.57},
  {v:"QE_I55",l:"Prática contexto local",tl:5.35,nac:5.56},
  {v:"QE_I44",l:"Integrar conhecimentos",tl:5.37,nac:5.62},
  {v:"QE_I56",l:"Competências integrais",tl:5.37,nac:5.58},
  {v:"QE_I45",l:"Cuidado ético e humanizado",tl:5.39,nac:5.68},
  {v:"QE_I50",l:"Comunicação efetiva",tl:5.39,nac:5.63},
  {v:"QE_I20",l:"TCC contribuiu para formação",tl:6.41,nac:5.71},
];

const topVantagem = [
  {q:52,tl:87.0,nac:37.6,diff:49.4,b:0.49},{q:49,tl:83.7,nac:51.2,diff:32.5,b:-0.71},
  {q:7,tl:69.2,nac:39.0,diff:30.3,b:null},{q:18,tl:81.6,nac:53.2,diff:28.5,b:0.63},
  {q:43,tl:57.7,nac:29.7,diff:28.0,b:null},{q:21,tl:67.3,nac:40.6,diff:26.8,b:-0.04},
  {q:6,tl:87.8,nac:61.2,diff:26.6,b:-0.79},{q:48,tl:73.5,nac:47.0,diff:26.5,b:1.77},
  {q:76,tl:80.8,nac:54.3,diff:26.5,b:null},{q:35,tl:85.7,nac:62.2,diff:23.5,b:-0.07},
];
const topDesvantagem = [
  {q:94,tl:36.7,nac:50.7,diff:-13.9,b:0.30},{q:44,tl:32.7,nac:43.5,diff:-10.8,b:-0.05},
  {q:36,tl:59.2,nac:64.2,diff:-5.0,b:-2.33},{q:64,tl:73.5,nac:77.4,diff:-4.0,b:-0.01},
  {q:4,tl:36.7,nac:39.3,diff:-2.6,b:-0.13},
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────
const COLORS = {
  tl: "#0d6efd", nac: "#6c757d", fed: "#198754", cg: "#fd7e14", co: "#6f42c1",
  bg: "#0a0e17", card: "#111827", cardHover: "#1a2332", border: "#1e293b",
  text: "#e2e8f0", textDim: "#94a3b8", accent: "#38bdf8", good: "#34d399", bad: "#f87171",
  gold: "#fbbf24", surface: "#0f172a",
};

const KPI = ({ label, value, sub, color = COLORS.accent, big }) => (
  <div style={{ background: COLORS.card, borderRadius: 12, padding: big ? "24px 20px" : "16px 14px", border: `1px solid ${COLORS.border}`, flex: 1, minWidth: big ? 180 : 140, textAlign: "center" }}>
    <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: big ? 36 : 28, fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, marginTop: 32 }}>
    <span style={{ fontSize: 22 }}>{icon}</span>
    <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: 0, letterSpacing: -0.3 }}>{children}</h2>
  </div>
);

const Badge = ({ children, color = COLORS.accent }) => (
  <span style={{ display: "inline-block", background: `${color}22`, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5 }}>{children}</span>
);

const LegendDot = ({ color, label }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: COLORS.textDim, marginRight: 14 }}>
    <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
    {label}
  </span>
);

const Tab = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    background: active ? COLORS.accent : "transparent", color: active ? COLORS.bg : COLORS.textDim,
    border: `1px solid ${active ? COLORS.accent : COLORS.border}`, borderRadius: 8, padding: "8px 16px",
    fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap",
  }}>{children}</button>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: COLORS.text }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill, display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span>{p.name}</span><span style={{ fontWeight: 700 }}>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── TABS ────────────────────────────────────────────────────────────────
const OverviewTab = () => {
  const radarData = Object.keys(TL.areas).map(k => ({
    area: k.replace("MFC / Saúde Coletiva", "MFC/SC").replace("Ginecologia e Obstetrícia", "GO").replace("Clínica Médica", "Clín. Médica").replace("Cirurgia Geral", "Cir. Geral"),
    tl: (TL.areas[k] / 20) * 100,
    nac: (NAC.areas[k] / 20) * 100,
    fed: (FED.areas[k] / 20) * 100,
  }));

  const areaBar = Object.keys(TL.areas).map(k => ({
    area: k.replace("Ginecologia e Obstetrícia", "GO").replace("MFC / Saúde Coletiva", "MFC/SC").replace("Clínica Médica", "Clín. Méd.").replace("Cirurgia Geral", "Cir. Geral"),
    "Três Lagoas": TL.areas[k],
    "Nacional": NAC.areas[k],
    "Federais": FED.areas[k],
    "UFMS CG": CG.areas[k],
  }));

  return (
    <div>
      {/* Dual ranking panel */}
      <div style={{ background: `${COLORS.accent}08`, border: `1px solid ${COLORS.accent}33`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: COLORS.accent, fontWeight: 700, marginBottom: 10 }}>📐 Dois critérios distintos — Visões Complementares</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Ranking por Média (NT_GER)</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Foco: Desempenho Global / Excelência</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.gold }}>#{TL.rankNT} <span style={{ fontSize: 13, color: COLORS.textDim, fontWeight: 400 }}>de {TL.totalCursos}</span></div>
            <div style={{ fontSize: 12, color: COLORS.textDim }}>TL = {TL.media} · Nacional = {NAC.media}</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Ranking por PCP (% Proficientes)</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 4 }}>Foco: Garantia de Competência Mínima</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.gold }}>#{TL.rankProf} <span style={{ fontSize: 13, color: COLORS.textDim, fontWeight: 400 }}>de {TL.totalCursos}</span></div>
            <div style={{ fontSize: 12, color: COLORS.textDim }}>TL = {TL.profLabel} (empatada c/ UFSCar)</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 10, lineHeight: 1.5, borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>
          💡 <strong>Paradigma do Conceito Enade:</strong> O PCP mede a proporção de alunos que atingiram o corte de competência (NT_GER ≥ 60). Enquanto a média mostra que temos "alunos estrelas", o PCP prova que <strong>nenhum aluno ficou para trás</strong>. Apenas 2 cursos no Brasil atingiram 100% de proficiência.
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <KPI label="Nota Média" value={TL.media} sub={`Nacional: ${NAC.media}`} color={COLORS.good} big />
        <KPI label="PCP (Proficientes)" value={TL.profLabel} sub={`Nacional: ${NAC.prof}%`} color={COLORS.good} big />
        <KPI label="Percentil (Média)" value={`${TL.percentilNT}%`} sub="Top 5,4% nacional" color={COLORS.good} big />
        <KPI label="Entre Federais" value={`#${TL.rankFedNT}`} sub={`de ${TL.totalFed} cursos (Nota)`} color={COLORS.accent} big />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <KPI label="Presentes" value={`${TL.n}/${TL.inscritos}`} sub={`${TL.presenca}%`} />
        <KPI label="Mediana NT" value={TL.mediana} sub={`Nac: ${NAC.mediana}`} />
        <KPI label="% Enare" value={`${TL.enare}%`} sub="Média do curso" />
      </div>

      <SectionTitle icon="🏅">Posição no Top 20 Nacional + UFMS</SectionTitle>
      
      <div style={{ background: `${COLORS.accent}11`, border: `1px solid ${COLORS.accent}44`, borderRadius: 8, padding: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 18 }}>🏆</span>
          <strong style={{ color: COLORS.accent, fontSize: 14 }}>Destaque Nacional: 1º Lugar em Proficiência Garantida (PCP)</strong>
        </div>
        <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>
          No indicador oficial do Conceito Enade (PCP - % de proficientes com nota ≥ 60), a <strong>UFMS Três Lagoas atingiu 100%</strong> — todos os 49 concluintes superaram o ponto de corte de competência mínima.
          <br /><br />
          Apenas <strong>duas instituições no país</strong> alcançaram este feito: <strong>UFMS CPTL</strong> e <strong>UFSCar</strong>.
          Enquanto rankings de média mostram "estrelas", o PCP mostra consistência: nenhum aluno ficou para trás.
        </div>
      </div>

      <p style={{ fontSize: 12, color: COLORS.textDim, margin: "0 0 10px" }}>Ranking abaixo ordenado pela Nota Média (NT_GER). Destaque em PCP (Proficientes) não listado para todos por ausência de dados públicos completos.</p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["# (Média)","Instituição","Cat.","NT_GER","N"].map(h => (
                <th key={h} style={{ padding: "8px 10px", color: COLORS.textDim, fontWeight: 600, textAlign: h.startsWith("#") || h==="Instituição" || h==="Cat." ? "left" : "right", fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {pos:1,nome:"UEL — Londrina/PR",cat:"Pub. Estadual",nt:78.8,n:40},
              {pos:2,nome:"USP — São Paulo/SP",cat:"Pub. Estadual",nt:77.8,n:172},
              {pos:3,nome:"USP — Ribeirão Preto/SP",cat:"Pub. Estadual",nt:77.4,n:95},
              {pos:4,nome:"USP — Bauru/SP",cat:"Pub. Estadual",nt:76.4,n:55},
              {pos:5,nome:"UFV — Viçosa/MG",cat:"Pub. Federal",nt:76.3,n:51},
              {pos:6,nome:"UPE — Serra Talhada/PE",cat:"Pub. Estadual",nt:75.7,n:23},
              {pos:7,nome:"UFJF — Gov. Valadares/MG",cat:"Pub. Federal",nt:75.5,n:41},
              {pos:8,nome:"PUCRS — Porto Alegre/RS",cat:"Comunitária",nt:75.4,n:111},
              {pos:9,nome:"UFRN — Natal/RN",cat:"Pub. Federal",nt:75.3,n:103},
              {pos:10,nome:"UEM — Maringá/PR",cat:"Pub. Estadual",nt:75.2,n:40},
              {pos:"…"},
              {pos:19,nome:"UFMS — Três Lagoas/MS",cat:"Pub. Federal",nt:74.5,n:49,isTL:true},
              {pos:"…"},
              {pos:26,nome:"UFMS — Campo Grande/MS",cat:"Pub. Federal",nt:73.6,n:82,isCG:true},
            ].map((r, i) => (
              r.pos === "…" ? (
                <tr key={i}><td colSpan={5} style={{ padding: "4px 10px", color: COLORS.border, textAlign: "center", fontSize: 11 }}>⋮</td></tr>
              ) : (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}`, background: r.isTL ? `${COLORS.tl}18` : r.isCG ? `${COLORS.cg}12` : "transparent" }}>
                  <td style={{ padding: "6px 10px", fontWeight: 700, color: r.isTL ? COLORS.tl : r.isCG ? COLORS.cg : COLORS.text, minWidth: 32 }}>{r.pos}º</td>
                  <td style={{ padding: "6px 10px", color: r.isTL ? COLORS.tl : r.isCG ? COLORS.cg : COLORS.text, fontWeight: r.isTL || r.isCG ? 700 : 400, whiteSpace: "nowrap" }}>
                    {r.nome}
                    {r.isTL && <Badge color={COLORS.gold} style={{marginLeft: 8}}>#1 em PCP (100%)</Badge>}
                  </td>
                  <td style={{ padding: "6px 10px", color: COLORS.textDim, fontSize: 11, whiteSpace: "nowrap" }}>{r.cat}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: COLORS.text, fontWeight: 600 }}>{r.nt.toFixed(1)}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: COLORS.textDim }}>{r.n}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <SectionTitle icon="🎯">Desempenho por Área (Radar)</SectionTitle>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 8 }}>
        <LegendDot color={COLORS.tl} label="Três Lagoas" />
        <LegendDot color={COLORS.nac} label="Nacional" />
        <LegendDot color={COLORS.fed} label="Federais" />
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke={COLORS.border} />
          <PolarAngleAxis dataKey="area" tick={{ fill: COLORS.textDim, fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: COLORS.textDim, fontSize: 10 }} />
          <Radar name="Três Lagoas" dataKey="tl" stroke={COLORS.tl} fill={COLORS.tl} fillOpacity={0.25} strokeWidth={2} />
          <Radar name="Nacional" dataKey="nac" stroke={COLORS.nac} fill={COLORS.nac} fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
          <Radar name="Federais" dataKey="fed" stroke={COLORS.fed} fill={COLORS.fed} fillOpacity={0.1} strokeWidth={2} strokeDasharray="3 3" />
        </RadarChart>
      </ResponsiveContainer>

      <SectionTitle icon="📊">Acertos por Área — Comparativo (max: 20)</SectionTitle>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 8 }}>
        <LegendDot color={COLORS.tl} label="Três Lagoas" />
        <LegendDot color={COLORS.nac} label="Nacional" />
        <LegendDot color={COLORS.fed} label="Federais" />
        <LegendDot color={COLORS.cg} label="UFMS CG" />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={areaBar} barGap={2} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="area" tick={{ fill: COLORS.textDim, fontSize: 11 }} />
          <YAxis domain={[0, 20]} tick={{ fill: COLORS.textDim, fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Três Lagoas" fill={COLORS.tl} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Nacional" fill={COLORS.nac} radius={[4, 4, 0, 0]} />
          <Bar dataKey="Federais" fill={COLORS.fed} radius={[4, 4, 0, 0]} />
          <Bar dataKey="UFMS CG" fill={COLORS.cg} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const BenchmarkTab = () => {
  const catData = porCategoria.map(c => ({ ...c, isTL: false }));
  catData.push({ label: "→ UFMS TL", media: TL.media, isTL: true });
  catData.sort((a, b) => b.media - a.media);

  const regData = porRegiao.map(r => ({ ...r, isTL: false }));
  regData.push({ label: "→ UFMS TL", media: TL.media, isTL: true });
  regData.sort((a, b) => b.media - a.media);

  return (
    <div>
      <SectionTitle icon="🏆">Nota Média por Categoria Administrativa</SectionTitle>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={catData} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis type="number" domain={[50, 80]} tick={{ fill: COLORS.textDim, fontSize: 11 }} />
          <YAxis type="category" dataKey="label" width={130} tick={{ fill: COLORS.textDim, fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="media" name="Nota Média" radius={[0, 4, 4, 0]}>
            {catData.map((d, i) => <Cell key={i} fill={d.isTL ? COLORS.tl : COLORS.nac} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <SectionTitle icon="🗺️">Nota Média por Região</SectionTitle>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={regData} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis type="number" domain={[55, 80]} tick={{ fill: COLORS.textDim, fontSize: 11 }} />
          <YAxis type="category" dataKey="label" width={110} tick={{ fill: COLORS.textDim, fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="media" name="Nota Média" radius={[0, 4, 4, 0]}>
            {regData.map((d, i) => <Cell key={i} fill={d.isTL ? COLORS.tl : d.label === "Centro-Oeste" ? COLORS.co : COLORS.nac} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <SectionTitle icon="🏛️">Nota Média por UF (média dos cursos)</SectionTitle>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={porUF} layout="vertical" margin={{ left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis type="number" domain={[50, 75]} tick={{ fill: COLORS.textDim, fontSize: 10 }} />
          <YAxis type="category" dataKey="label" width={30} tick={{ fill: COLORS.textDim, fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={TL.media} stroke={COLORS.tl} strokeDasharray="5 5" label={{ value: "TL", fill: COLORS.tl, fontSize: 10 }} />
          <Bar dataKey="media" name="Nota Média" radius={[0, 3, 3, 0]}>
            {porUF.map((d, i) => <Cell key={i} fill={d.label === "MS" ? COLORS.co : COLORS.nac} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ItemTab = () => {
  return (
    <div>
      <SectionTitle icon="✅">Top 10 — Questões com Maior Vantagem sobre o Nacional</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["Questão","% TL","% Nacional","Diferença","Dificuldade (B)"].map(h => (
                <th key={h} style={{ padding: "8px 10px", color: COLORS.textDim, fontWeight: 600, textAlign: "right", fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topVantagem.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: "8px 10px", fontWeight: 700, color: COLORS.text, textAlign: "right" }}>Q{r.q}</td>
                <td style={{ padding: "8px 10px", color: COLORS.tl, fontWeight: 600, textAlign: "right" }}>{r.tl}%</td>
                <td style={{ padding: "8px 10px", color: COLORS.textDim, textAlign: "right" }}>{r.nac}%</td>
                <td style={{ padding: "8px 10px", color: COLORS.good, fontWeight: 700, textAlign: "right" }}>+{r.diff}pp</td>
                <td style={{ padding: "8px 10px", color: COLORS.textDim, textAlign: "right" }}>{r.b !== null ? r.b.toFixed(2) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionTitle icon="⚠️">Questões com Desvantagem (abaixo do nacional)</SectionTitle>
      <p style={{ fontSize: 13, color: COLORS.textDim, margin: "0 0 12px" }}>
        Apenas 5 questões ficaram abaixo da média nacional — e as diferenças são pequenas:
      </p>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["Questão","% TL","% Nacional","Diferença","Dificuldade (B)"].map(h => (
                <th key={h} style={{ padding: "8px 10px", color: COLORS.textDim, fontWeight: 600, textAlign: "right", fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topDesvantagem.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: "8px 10px", fontWeight: 700, color: COLORS.text, textAlign: "right" }}>Q{r.q}</td>
                <td style={{ padding: "8px 10px", color: COLORS.tl, fontWeight: 600, textAlign: "right" }}>{r.tl}%</td>
                <td style={{ padding: "8px 10px", color: COLORS.textDim, textAlign: "right" }}>{r.nac}%</td>
                <td style={{ padding: "8px 10px", color: COLORS.bad, fontWeight: 700, textAlign: "right" }}>{r.diff}pp</td>
                <td style={{ padding: "8px 10px", color: COLORS.textDim, textAlign: "right" }}>{r.b !== null ? r.b.toFixed(2) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: `${COLORS.good}11`, border: `1px solid ${COLORS.good}33`, borderRadius: 10, padding: 16, marginTop: 20 }}>
        <div style={{ fontSize: 13, color: COLORS.good, fontWeight: 700, marginBottom: 6 }}>💡 Destaque</div>
        <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>
          Dos 100 itens da prova, Três Lagoas ficou <strong>acima da média nacional em 95 questões</strong>. 
          As únicas 5 com desempenho inferior têm diferenças pequenas (máximo −13,9pp na Q94). 
          A Q52 merece atenção especial: 87% de acerto em TL contra apenas 37,6% nacional — uma vantagem de quase 50 pontos percentuais.
        </div>
      </div>
    </div>
  );
};

const AvaliacaoTab = () => {
  const gapData = likertData.map(d => ({
    label: d.l,
    gap: +(d.tl - d.nac).toFixed(2),
    tl: d.tl,
    nac: d.nac,
  }));

  const top5Piores = gapData.slice(0, 8);
  const unicoPositivo = gapData.filter(d => d.gap > 0);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <KPI label="NPS Curso" value="8.1" sub={`Nacional: 8.8`} color={COLORS.accent} big />
        <KPI label="NPS IES" value="7.6" sub={`Nacional: 8.4`} color={COLORS.accent} big />
      </div>

      <div style={{ background: `${COLORS.bad}11`, border: `1px solid ${COLORS.bad}33`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: COLORS.bad, fontWeight: 700, marginBottom: 6 }}>⚡ Paradoxo Performance × Satisfação</div>
        <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>
          Apesar do <strong>excelente desempenho (#19 nacional)</strong>, os estudantes avaliam o processo formativo 
          <strong> abaixo da média nacional em 38 de 39 itens</strong>. O único item acima da média é o TCC. 
          Isso sugere que o bom resultado na prova pode decorrer de <strong>esforço individual dos alunos</strong> 
          mais do que de condições institucionais percebidas como adequadas.
        </div>
      </div>

      <SectionTitle icon="🔴">Maiores Gaps Negativos (TL − Nacional)</SectionTitle>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={top5Piores} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis type="number" domain={[-2.5, 0.5]} tick={{ fill: COLORS.textDim, fontSize: 11 }} />
          <YAxis type="category" dataKey="label" width={200} tick={{ fill: COLORS.textDim, fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke={COLORS.textDim} />
          <Bar dataKey="gap" name="Gap (TL − Nacional)" radius={[0, 4, 4, 0]}>
            {top5Piores.map((d, i) => <Cell key={i} fill={d.gap < -1 ? COLORS.bad : d.gap < 0 ? "#fb923c" : COLORS.good} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <SectionTitle icon="📋">Todos os Itens — Gap TL vs. Nacional</SectionTitle>
      <p style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 10 }}>Escala Likert 1-6 (1=discordo totalmente, 6=concordo totalmente). Ordenados do maior gap negativo ao positivo.</p>
      <div style={{ overflowX: "auto", maxHeight: 500, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead style={{ position: "sticky", top: 0, background: COLORS.card }}>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["Item","Três Lagoas","Nacional","Gap"].map(h => (
                <th key={h} style={{ padding: "8px 8px", color: COLORS.textDim, fontWeight: 600, textAlign: h === "Item" ? "left" : "right", fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gapData.map((d, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}`, background: d.gap > 0 ? `${COLORS.good}08` : Math.abs(d.gap) > 1 ? `${COLORS.bad}08` : "transparent" }}>
                <td style={{ padding: "6px 8px", color: COLORS.text, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.label}</td>
                <td style={{ padding: "6px 8px", color: COLORS.tl, fontWeight: 600, textAlign: "right" }}>{d.tl.toFixed(2)}</td>
                <td style={{ padding: "6px 8px", color: COLORS.textDim, textAlign: "right" }}>{d.nac.toFixed(2)}</td>
                <td style={{ padding: "6px 8px", fontWeight: 700, textAlign: "right", color: d.gap > 0 ? COLORS.good : Math.abs(d.gap) > 1 ? COLORS.bad : "#fb923c" }}>
                  {d.gap > 0 ? "+" : ""}{d.gap.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {unicoPositivo.length > 0 && (
        <div style={{ background: `${COLORS.good}11`, border: `1px solid ${COLORS.good}33`, borderRadius: 10, padding: 16, marginTop: 16 }}>
          <div style={{ fontSize: 13, color: COLORS.good, fontWeight: 700, marginBottom: 4 }}>✅ Único item acima da média nacional</div>
          <div style={{ fontSize: 13, color: COLORS.text }}>
            <strong>TCC contribuiu para formação</strong>: TL = 6.41 vs Nacional = 5.71 (+0.70). A nota mais alta de todo o questionário.
          </div>
        </div>
      )}

      <SectionTitle icon="🏗️">Áreas Críticas para Ação Institucional</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {[
          { title: "🚨 Corpo Docente/Preceptores", gap: -2.25, desc: "Gap de −2,25 pontos. É o maior déficit. Estudantes percebem falta de professores e preceptores em número suficiente." },
          { title: "🔬 Simulação e Laboratórios", gap: -1.36, desc: "Simulação de alta fidelidade (−1,36) e laboratórios de habilidades (−1,15) ficam muito abaixo. Infraestrutura de simulação é prioridade." },
          { title: "📋 Coordenação e Gestão", gap: -1.11, desc: "Coordenação indisponível (−1,11) e avaliações periódicas (−0,88) indicam fragilidade na gestão pedagógica percebida." },
          { title: "📝 Avaliação e Feedback", gap: -0.98, desc: "Devolutivas (−0,98), compatibilidade das avaliações (−0,93) e planos de ensino (−0,93) pedem revisão dos processos avaliativos." },
        ].map((c, i) => (
          <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.text, marginBottom: 6 }}>{c.title}</div>
            <Badge color={COLORS.bad}>Gap: {c.gap.toFixed(2)}</Badge>
            <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 8, lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PercepcaoTab = () => {
  const dificData = [
    { opt: "Fácil", tl: 4.1, nac: 4.7 },
    { opt: "Médio", tl: 65.3, nac: 53.6 },
    { opt: "Difícil", tl: 28.6, nac: 33.4 },
    { opt: "Muito difícil", tl: 2.0, nac: 6.8 },
  ];
  const tempoData = [
    { opt: "3-4 horas", tl: 36.7, nac: 36.9 },
    { opt: "4-5 horas", tl: 61.2, nac: 47.9 },
    { opt: "5h+, não terminou", tl: 2.0, nac: 10.5 },
  ];
  const estudoData = [
    { opt: "Não estudou maioria", tl: 0, nac: 2.3 },
    { opt: "Estudou, não aprendeu", tl: 0, nac: 4.2 },
    { opt: "Estudou maioria, não aprendeu", tl: 12.2, nac: 14.3 },
    { opt: "Estudou e aprendeu muitos", tl: 83.7, nac: 67.1 },
    { opt: "Estudou e aprendeu todos", tl: 4.1, nac: 10.7 },
  ];

  return (
    <div>
      <SectionTitle icon="📝">Grau de Dificuldade Percebido</SectionTitle>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={dificData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="opt" tick={{ fill: COLORS.textDim, fontSize: 11 }} />
          <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="tl" name="Três Lagoas" fill={COLORS.tl} radius={[4, 4, 0, 0]} />
          <Bar dataKey="nac" name="Nacional" fill={COLORS.nac} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <SectionTitle icon="⏱️">Tempo Gasto na Prova</SectionTitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={tempoData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="opt" tick={{ fill: COLORS.textDim, fontSize: 11 }} />
          <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="tl" name="Três Lagoas" fill={COLORS.tl} radius={[4, 4, 0, 0]} />
          <Bar dataKey="nac" name="Nacional" fill={COLORS.nac} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <SectionTitle icon="📚">Percepção de Estudo dos Conteúdos</SectionTitle>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={estudoData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="opt" tick={{ fill: COLORS.textDim, fontSize: 10 }} interval={0} angle={-15} />
          <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="tl" name="Três Lagoas" fill={COLORS.tl} radius={[4, 4, 0, 0]} />
          <Bar dataKey="nac" name="Nacional" fill={COLORS.nac} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>📌 Atividades práticas contribuíram?</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.good }}>98%</div>
          <div style={{ fontSize: 12, color: COLORS.textDim }}>responderam SIM (nacional: ~88%)</div>
        </div>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>📌 Clareza dos enunciados</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accent }}>94%</div>
          <div style={{ fontSize: 12, color: COLORS.textDim }}>avaliaram "todos" ou "a maioria" como claros</div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Visão Geral", icon: "📊" },
  { id: "benchmark", label: "Benchmarking", icon: "🏆" },
  { id: "items", label: "Análise por Questão", icon: "🔍" },
  { id: "avaliacao", label: "Avaliação do Curso", icon: "📋" },
  { id: "percepcao", label: "Percepção da Prova", icon: "📝" },
];

export default function Dashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>🏥</span>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>ENAMED 2025 — UFMS Três Lagoas</h1>
          </div>
          <div style={{ fontSize: 13, color: COLORS.textDim }}>
            Análise dos Microdados do Exame Nacional de Avaliação da Formação Médica — Conceito Enade (PCP)
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <Badge color={COLORS.good}>🏅 #1 de 350 (PCP Garantido)</Badge>
            <Badge color={COLORS.accent}>🎓 #7 entre Federais (Média)</Badge>
            <Badge>Percentil 94,6%</Badge>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {TABS.map(t => (
            <Tab key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </Tab>
          ))}
        </div>

        {/* Content */}
        {tab === "overview" && <OverviewTab />}
        {tab === "benchmark" && <BenchmarkTab />}
        {tab === "items" && <ItemTab />}
        {tab === "avaliacao" && <AvaliacaoTab />}
        {tab === "percepcao" && <PercepcaoTab />}

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 40, paddingTop: 16, fontSize: 11, color: COLORS.textDim, textAlign: "center", lineHeight: 1.6 }}>
          Fonte: Microdados ENAMED 2025 — INEP/MEC • N = 49 concluintes presentes (UFMS Três Lagoas) • 39.256 presentes no Brasil<br />
          Análise por CO_CURSO = 1264844 | CO_IES = 694 (UFMS) | Pública Federal | Universidade
        </div>
      </div>
    </div>
  );
}
