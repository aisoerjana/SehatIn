const FRONT_PARTS = [
  { m: "trap", paths: [
    "M104 84 Q120 77 136 84 L150 100 Q120 92 90 100 Z"
  ], nodes: [[120, 91]] },
  { m: "shoulder", paths: [
    "M84 98 Q70 100 66 116 Q64 129 77 131 Q90 127 92 110 Q92 100 84 98 Z",
    "M156 98 Q170 100 174 116 Q176 129 163 131 Q150 127 148 110 Q148 100 156 98 Z"
  ], nodes: [[78, 114], [162, 114]] },
  { m: "chest", paths: [
    "M92 102 Q108 100 118 107 L118 134 Q104 141 94 132 Q86 119 92 102 Z",
    "M148 102 Q132 100 122 107 L122 134 Q136 141 146 132 Q154 119 148 102 Z"
  ], nodes: [[105, 119], [135, 119]] },
  { m: "bicep", paths: [
    "M64 120 Q56 122 56 140 L60 166 Q72 168 74 150 L74 126 Q72 120 64 120 Z",
    "M176 120 Q184 122 184 140 L180 166 Q168 168 166 150 L166 126 Q168 120 176 120 Z"
  ], nodes: [[65, 144], [175, 144]] },
  { m: "forearm", paths: [
    "M58 169 Q52 171 52 189 L57 222 Q70 226 72 205 L70 173 Q68 169 58 169 Z",
    "M182 169 Q188 171 188 189 L183 222 Q170 226 168 205 L170 173 Q172 169 182 169 Z"
  ], nodes: [[62, 196], [178, 196]] },
  { m: "abs", paths: [
    "M104 138 Q120 136 136 138 L138 206 Q120 214 102 206 Z"
  ], nodes: [[120, 172]] },
  { m: "quad", paths: [
    "M100 215 Q88 219 88 245 L94 322 Q106 330 112 320 L116 245 Q116 219 108 215 Q104 214 100 215 Z",
    "M140 215 Q152 219 152 245 L146 322 Q134 330 128 320 L124 245 Q124 219 132 215 Q136 214 140 215 Z"
  ], nodes: [[102, 268], [138, 268]] },
  { m: "calf", paths: [
    "M98 360 Q92 362 92 384 L96 438 Q106 444 110 436 L112 384 Q112 362 106 360 Z",
    "M142 360 Q148 362 148 384 L144 438 Q134 444 130 436 L128 384 Q128 362 134 360 Z"
  ], nodes: [[101, 400], [139, 400]] },
];

const BACK_PARTS = [
  { m: "trap", paths: [
    "M120 80 L150 102 Q140 120 124 126 L116 126 Q100 120 90 102 Z"
  ], nodes: [[120, 104]] },
  { m: "shoulder", paths: [
    "M84 100 Q70 102 66 118 Q64 131 77 133 Q90 129 92 112 Q92 102 84 100 Z",
    "M156 100 Q170 102 174 118 Q176 131 163 133 Q150 129 148 112 Q148 102 156 100 Z"
  ], nodes: [[78, 116], [162, 116]] },
  { m: "back", paths: [
    "M92 122 Q78 128 80 162 L113 186 L117 132 Q105 124 92 122 Z",
    "M148 122 Q162 128 160 162 L127 186 L123 132 Q135 124 148 122 Z",
    "M108 150 L132 150 L129 198 Q120 202 111 198 Z"
  ], nodes: [[98, 152], [142, 152]] },
  { m: "tricep", paths: [
    "M64 120 Q56 122 56 140 L60 166 Q72 168 74 150 L74 126 Q72 120 64 120 Z",
    "M176 120 Q184 122 184 140 L180 166 Q168 168 166 150 L166 126 Q168 120 176 120 Z"
  ], nodes: [[65, 144], [175, 144]] },
  { m: "forearm", paths: [
    "M58 169 Q52 171 52 189 L57 222 Q70 226 72 205 L70 173 Q68 169 58 169 Z",
    "M182 169 Q188 171 188 189 L183 222 Q170 226 168 205 L170 173 Q172 169 182 169 Z"
  ], nodes: [[62, 196], [178, 196]] },
  { m: "glute", paths: [
    "M100 200 Q88 202 88 220 Q90 238 106 238 Q118 236 118 218 L116 204 Q108 200 100 200 Z",
    "M140 200 Q152 202 152 220 Q150 238 134 238 Q122 236 122 218 L124 204 Q132 200 140 200 Z"
  ], nodes: [[104, 220], [136, 220]] },
  { m: "hamstring", paths: [
    "M100 242 Q90 244 90 266 L96 330 Q108 338 112 328 L114 266 Q114 244 106 242 Z",
    "M140 242 Q150 244 150 266 L144 330 Q132 338 128 328 L126 266 Q126 244 134 242 Z"
  ], nodes: [[102, 288], [138, 288]] },
  { m: "calf", paths: [
    "M98 360 Q90 362 90 388 Q92 414 102 420 Q108 422 110 414 L112 388 Q112 362 106 360 Z",
    "M142 360 Q150 362 150 388 Q148 414 138 420 Q132 422 130 414 L128 388 Q128 362 134 360 Z"
  ], nodes: [[101, 392], [139, 392]] },
];

const FrameFront = () => (
  <>
    <ellipse cx="120" cy="46" rx="23" ry="27" className="frame-fill" />
    <path d="M108 70 h24 v16 h-24 z" className="frame-fill" />
    <ellipse cx="56" cy="232" rx="11" ry="13" className="frame-fill" />
    <ellipse cx="184" cy="232" rx="11" ry="13" className="frame-fill" />
    <path d="M88 196 q32 8 64 0 l5 22 q-37 9 -74 0 z" className="frame-fill" />
    <ellipse cx="101" cy="346" rx="13" ry="9" className="frame-fill" />
    <ellipse cx="139" cy="346" rx="13" ry="9" className="frame-fill" />
    <ellipse cx="101" cy="446" rx="14" ry="9" className="frame-fill" />
    <ellipse cx="139" cy="446" rx="14" ry="9" className="frame-fill" />
  </>
);

const FrameBack = () => (
  <>
    <ellipse cx="120" cy="46" rx="23" ry="27" className="frame-fill" />
    <path d="M108 70 h24 v14 h-24 z" className="frame-fill" />
    <ellipse cx="56" cy="232" rx="11" ry="13" className="frame-fill" />
    <ellipse cx="184" cy="232" rx="11" ry="13" className="frame-fill" />
    <ellipse cx="101" cy="346" rx="13" ry="9" className="frame-fill" />
    <ellipse cx="139" cy="346" rx="13" ry="9" className="frame-fill" />
    <ellipse cx="101" cy="446" rx="14" ry="9" className="frame-fill" />
    <ellipse cx="139" cy="446" rx="14" ry="9" className="frame-fill" />
  </>
);

function Figure({ parts, Frame, active, onSelect }) {
  return (
    <svg viewBox="0 0 240 540" xmlns="http://www.w3.org/2000/svg" className={`w-full h-auto block ${active ? "has-sel" : ""}`}>
      <defs>
        <linearGradient id="msIdle" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#DBEAFE" />
          <stop offset="0.5" stopColor="#BFDBFE" />
          <stop offset="1" stopColor="#93C5FD" />
        </linearGradient>
        <linearGradient id="msHover" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#93C5FD" />
          <stop offset="0.5" stopColor="#60A5FA" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="msOn" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#38BDF8" />
          <stop offset="0.4" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
        <radialGradient id="msGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#2563EB" stopOpacity="0.25" />
          <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Frame />
      {parts.map((p) => (
        <g key={p.m} className={`ms ${active === p.m ? "on" : ""}`} onClick={() => onSelect(p.m)}>
          {p.paths.map((d, i) => <path key={i} className="seg" d={d} />)}
          {p.nodes.map(([cx, cy], i) => <circle key={i} className="node" cx={cx} cy={cy} r="2.4" />)}
        </g>
      ))}
    </svg>
  );
}

export default function AnatomyFigure({ view, activeMuscle, onSelectMuscle }) {
  return (
    <>
      <style>{`
        .frame-fill{fill:rgba(219,234,254,.35);stroke:rgba(37,99,235,.12);stroke-width:.7;}
        .ms{cursor:pointer;transition:opacity .35s,filter .35s;}
        .ms .seg{fill:url(#msIdle);stroke:rgba(37,99,235,.2);stroke-width:1;transition:fill .35s,stroke .35s,filter .35s;}
        .ms .node{fill:rgba(37,99,235,.4);transition:.35s;}
        .ms:hover .seg{fill:url(#msHover);stroke:rgba(37,99,235,.5);filter:brightness(1.05);}
        svg.has-sel .ms{opacity:.25;}
        svg.has-sel .ms:hover{opacity:.45;}
        svg.has-sel .ms.on{opacity:1;}
        .ms.on .seg{fill:url(#msOn);stroke:#93C5FD;stroke-width:1.5;}
        .ms.on{filter:drop-shadow(0 0 6px rgba(37,99,235,.65)) drop-shadow(0 0 20px rgba(37,99,235,.3));}
        .ms.on .node{fill:#DBEAFE;animation:nodePulse 1.4s ease-in-out infinite;}
        @keyframes nodePulse{0%,100%{r:2.4;opacity:1;}50%{r:3.8;opacity:.5;}}
        @media (prefers-reduced-motion: reduce){
          .ms.on .node{animation:none;}
        }
      `}</style>
      {view === "front" ? (
        <Figure parts={FRONT_PARTS} Frame={FrameFront} active={activeMuscle} onSelect={onSelectMuscle} />
      ) : (
        <Figure parts={BACK_PARTS} Frame={FrameBack} active={activeMuscle} onSelect={onSelectMuscle} />
      )}
    </>
  );
}
