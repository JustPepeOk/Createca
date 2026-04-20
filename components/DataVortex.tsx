"use client";

import { useRef, useEffect } from "react";

const VS = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
uniform float t;
uniform vec2 r;
uniform vec2 m;
uniform float uInnerR;
uniform float uOuterR;
uniform float uGenIn;
uniform float uGenOut;
uniform float uSpeed;
uniform float uMouse;

#define PI 3.14159265
#define TAU 6.28318530

float hash2(vec2 p){p=mod(p,289.0);return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float hash3(vec2 p){p=mod(p,289.0);return fract(sin(dot(p,vec2(269.5,183.3)))*43758.5453);}
float hash4(vec2 p){p=mod(p,289.0);return fract(sin(dot(p,vec2(419.2,371.9)))*43758.5453);}

float noise2(vec2 p){
  vec2 i=floor(p);
  vec2 f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(
    mix(hash2(i),hash2(i+vec2(1,0)),f.x),
    mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),f.x),f.y);
}

void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 st=uv*2.0-1.0;
  st.x*=r.x/r.y;
  st+=(m-0.5)*uMouse;

  float dist=length(st);
  float angle=atan(st.y,st.x)+PI;

  float T=t*uSpeed;

  float innerR=uInnerR;
  float outerR=uOuterR;
  float range=outerR-innerR;

  float genInner=innerR-uGenIn;
  float genOuter=outerR+uGenOut;
  float genRange=genOuter-genInner;

  float rNorm=(dist-innerR)/range;

  vec3 col=vec3(0.0);

  for(int layer=0;layer<3;layer++){
    float fl=float(layer);
    float numRings=55.0+fl*20.0;
    float extRings=numRings*genRange/range;
    float ringWidth=genRange/extRings;
    float layerRot=fl*0.7+T*(0.3+fl*0.15);
    float ringF=(dist-genInner)/ringWidth;
    float ringId=floor(ringF);
    float ringFrac=fract(ringF);
    if(ringId<0.0||ringId>=extRings) continue;
    float ringNorm=ringId/extRings;
    float mainRingNorm=(dist-innerR)/range;
    float ringRot=layerRot*(2.0-ringNorm*1.5);
    float ringDir=hash2(vec2(ringId,fl*100.0))>0.35?1.0:-1.0;
    float rotAngle=angle+ringRot*ringDir+hash2(vec2(ringId,fl*50.0))*TAU;
    float numSegs=floor(40.0+180.0*ringNorm+hash2(vec2(ringId,fl*30.0))*40.0);
    float segF=rotAngle/TAU*numSegs;
    float segId=floor(segF);
    float segFrac=fract(segF);
    vec2 cellId=vec2(segId,ringId+fl*1000.0);
    float presence=hash2(cellId);
    float densityThreshold=0.1+0.45*clamp(mainRingNorm,0.0,1.0);
    densityThreshold+=noise2(vec2(segId*0.02+fl*3.0,ringId*0.05))*0.15;
    if(mainRingNorm<0.0) densityThreshold=0.75+mainRingNorm*(-2.0);
    if(mainRingNorm>1.0) densityThreshold=0.7+(mainRingNorm-1.0)*3.0;
    if(mainRingNorm<0.0||mainRingNorm>1.0){
      densityThreshold-=noise2(vec2(angle*6.0+fl*5.0,ringId*0.1))*0.2;
    }
    if(mainRingNorm>0.5){
      float sectorId=floor(angle/TAU*24.0);
      float sectorHealth=hash2(vec2(sectorId,fl*50.0+3.0));
      bool depleted=sectorHealth<0.3;
      if(depleted){
        float depthFactor=1.0-sectorHealth/0.3;
        float removeFrom=1.0-depthFactor*0.5;
        if(mainRingNorm>removeFrom){
          float thinning=(mainRingNorm-removeFrom)/(1.0-removeFrom);
          densityThreshold+=thinning*0.35;
        }
      }
      if(!depleted && mainRingNorm>0.85){
        float sectorVar=hash2(vec2(sectorId,fl*50.0+7.0));
        if(sectorVar<0.3) densityThreshold+=(mainRingNorm-0.85)*0.5;
      }
    }
    if(presence<densityThreshold) continue;
    float rGap=0.12+0.08*hash2(cellId+10.0);
    float rMask=step(rGap*0.5,ringFrac)*step(ringFrac,1.0-rGap*0.5);
    float aGap=0.06+0.08*hash2(cellId+20.0);
    float aMask=step(aGap*0.5,segFrac)*step(segFrac,1.0-aGap*0.5);
    float cellMask=rMask*aMask;
    if(cellMask<0.01) continue;
    float bright=0.3+0.7*hash2(cellId+30.0);
    bright+=step(0.85,hash2(cellId+40.0))*1.5;
    bright*=1.0+smoothstep(0.2,0.0,clamp(mainRingNorm,0.0,1.0))*2.0;
    bright*=smoothstep(1.3,0.7,mainRingNorm);
    if(mainRingNorm<0.0) bright*=0.6+0.4*smoothstep(-0.15,0.0,mainRingNorm);
    if(mainRingNorm>1.0) bright*=0.5+0.5*smoothstep(1.25,1.0,mainRingNorm);
    float flicker=0.9+0.1*sin(t*0.25+hash2(cellId)*TAU);
    float h=hash2(cellId+50.0);
    float h2=hash3(cellId);
    float h3=hash4(cellId);
    float cRN=clamp(mainRingNorm,0.0,1.0);
    float pWarm=smoothstep(0.7,0.0,cRN)*0.7+0.1;
    float pCool=smoothstep(0.2,0.9,cRN)*0.7+0.1;
    float pMid=0.2;
    float pTotal=pWarm+pCool+pMid;
    pWarm/=pTotal; pCool/=pTotal; pMid/=pTotal;
    vec3 fragCol;
    if(h<pWarm){
      if(h2<0.15)      fragCol=vec3(1.0,0.95,0.78);
      else if(h2<0.3)  fragCol=vec3(1.0,0.85,0.4);
      else if(h2<0.5)  fragCol=vec3(1.0,0.58,0.12);
      else if(h2<0.65) fragCol=vec3(0.95,0.38,0.08);
      else if(h2<0.8)  fragCol=vec3(0.88,0.15,0.06);
      else             fragCol=vec3(0.78,0.1,0.1);
    }
    else if(h<pWarm+pMid){
      if(h2<0.25)      fragCol=vec3(0.8,0.12,0.18);
      else if(h2<0.45) fragCol=vec3(0.62,0.08,0.3);
      else if(h2<0.6)  fragCol=vec3(0.4,0.08,0.38);
      else if(h2<0.75) fragCol=vec3(0.85,0.3,0.1);
      else             fragCol=vec3(0.2,0.2,0.55);
    }
    else{
      if(h2<0.2)       fragCol=vec3(0.15,0.4,0.85);
      else if(h2<0.4)  fragCol=vec3(0.08,0.28,0.68);
      else if(h2<0.55) fragCol=vec3(0.05,0.2,0.52);
      else if(h2<0.7)  fragCol=vec3(0.12,0.5,0.65);
      else if(h2<0.82) fragCol=vec3(0.08,0.35,0.55);
      else if(h2<0.92) fragCol=vec3(0.04,0.15,0.4);
      else             fragCol=vec3(0.75,0.2,0.1);
    }
    fragCol*=0.85+0.3*h3;
    col+=fragCol*cellMask*bright*flicker*0.35;
  }

  float outerScatter=smoothstep(outerR-0.1,outerR+0.05,dist)*smoothstep(outerR+0.2,outerR,dist);
  float scatterNoise=noise2(vec2(angle*15.0+T,dist*20.0));
  float scatter=outerScatter*step(0.7,scatterNoise)*0.15;
  vec3 scatterCol=mix(vec3(0.06,0.18,0.45),vec3(0.12,0.35,0.55),scatterNoise);
  col+=scatterCol*scatter;

  for(int i=0;i<10;i++){
    float fi=float(i);
    float pA=TAU*hash2(vec2(fi,0.0))+T*(0.8+hash2(vec2(fi,1.0))*0.6);
    float pR=innerR+range*(0.05+0.9*hash2(vec2(fi,2.0)));
    vec2 pp=vec2(cos(pA-PI),sin(pA-PI))*pR;
    float pd=length(st-pp);
    float glow=0.0003/(pd*pd+0.0001);
    float prn=(pR-innerR)/range;
    vec3 pCol=prn<0.3?vec3(1.0,0.75,0.3):vec3(0.15,0.35,0.7);
    col+=pCol*glow*0.015;
  }

  col*=smoothstep(genInner-0.01,genInner+0.02,dist);
  col*=smoothstep(genOuter+0.05,genOuter-0.03,dist);

  {
    float rawAng=atan(st.y,st.x);
    float leftness=smoothstep(0.15,0.7,abs(rawAng)/PI);
    if(leftness>0.01){
      float colFrac=fract(uv.x*100.0);
      float slitWidth=mix(0.85,0.06,leftness);
      float inSlit=step(0.5-slitWidth*0.5,colFrac)*step(colFrac,0.5+slitWidth*0.5);
      col*=mix(1.0,inSlit,leftness);
    }
  }

  col+=(hash2(gl_FragCoord.xy+fract(t*73.0))-0.5)*0.006;
  col=pow(clamp(col,0.0,1.0),vec3(0.85));
  gl_FragColor=vec4(col,1.0);
}
`;

export type VortexParams = {
  innerR: number; outerR: number; genIn: number;
  genOut: number; speed: number; mouse: number;
};

export const VORTEX_DEFAULTS: VortexParams = {
  innerR: 0.62, outerR: 1.15, genIn: 0.1, genOut: 0.25, speed: 0.08, mouse: 0.03,
};

export default function DataVortex({ paramsRef }: { paramsRef: React.RefObject<VortexParams> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl2", { antialias: false, alpha: false }) ||
                canvas.getContext("webgl",  { antialias: false, alpha: false })) as WebGLRenderingContext | null;
    if (!gl) return;

    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouseMove);

    const resize = () => {
      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio, isMobile ? 1 : 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const compileShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const pLoc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);

    const uT      = gl.getUniformLocation(prog, "t");
    const uR      = gl.getUniformLocation(prog, "r");
    const uM      = gl.getUniformLocation(prog, "m");
    const uInnerR = gl.getUniformLocation(prog, "uInnerR");
    const uOuterR = gl.getUniformLocation(prog, "uOuterR");
    const uGenIn  = gl.getUniformLocation(prog, "uGenIn");
    const uGenOut = gl.getUniformLocation(prog, "uGenOut");
    const uSpeed  = gl.getUniformLocation(prog, "uSpeed");
    const uMouse  = gl.getUniformLocation(prog, "uMouse");
    const t0 = performance.now();

    const render = () => {
      const elapsed = (performance.now() - t0) / 1000;
      const p = paramsRef.current ?? VORTEX_DEFAULTS;
      smx += (mx - smx) * 0.03;
      smy += (my - smy) * 0.03;
      gl.uniform1f(uT, elapsed);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform2f(uM, smx, smy);
      gl.uniform1f(uInnerR, p.innerR);
      gl.uniform1f(uOuterR, p.outerR);
      gl.uniform1f(uGenIn,  p.genIn);
      gl.uniform1f(uGenOut, p.genOut);
      gl.uniform1f(uSpeed,  p.speed);
      gl.uniform1f(uMouse,  p.mouse);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [paramsRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
