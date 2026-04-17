"use client";

import { useEffect, useRef } from "react";

const VS = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;

const FS = `
precision highp float;
uniform float t;
uniform vec2 r;
uniform vec2 m;

float hash(float n){return fract(sin(n)*43758.5453);}
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

float noise(float x){
  float i=floor(x);
  float f=fract(x);
  f=f*f*(3.0-2.0*f);
  return mix(hash(i),hash(i+1.0),f);
}

float noise2(vec2 p){
  vec2 i=floor(p);
  vec2 f=fract(p);
  f=f*f*(3.0-2.0*f);
  float a=hash2(i);
  float b=hash2(i+vec2(1,0));
  float c=hash2(i+vec2(0,1));
  float d=hash2(i+vec2(1,1));
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

float fbm2(vec2 p){
  float f=0.0,a=0.5;
  for(int i=0;i<5;i++){f+=a*noise2(p);p*=2.1;a*=0.47;}
  return f;
}

float fbm1(float x){
  float f=0.0,a=0.5;
  for(int i=0;i<4;i++){f+=a*noise(x);x*=2.1;a*=0.48;}
  return f;
}

float halftone(vec2 uv, float size, float brightness){
  vec2 grid=fract(uv*size)-0.5;
  float d=length(grid);
  float radius=0.45*clamp(brightness,0.0,1.0);
  return smoothstep(radius+0.03,radius-0.03,d);
}

void main(){
  vec2 uv=gl_FragCoord.xy/r;
  float aspect=r.x/r.y;
  float T=t;

  float zone1=smoothstep(0.0,0.33,uv.x);
  float zone2=smoothstep(0.33,0.66,uv.x);
  float zone3=smoothstep(0.66,1.0,uv.x);

  vec3 oxDark=vec3(0.035,0.035,0.035);
  vec3 oxMid=vec3(0.05,0.05,0.05);
  vec3 oxLight=vec3(0.08,0.08,0.08);
  vec3 carbon=vec3(0.035,0.035,0.035);
  vec3 safetyOrange=vec3(0.576,0.094,0.094);

  vec3 col=mix(oxDark,oxMid,uv.x*0.6);

  float htBright=fbm2(uv*vec2(3.0,4.0)+vec2(T*0.02,0.0))*0.6;
  float dots=halftone(uv*vec2(aspect,1.0),28.0,htBright);
  float dots2=halftone(uv*vec2(aspect,1.0)+0.25,42.0,htBright*0.7);
  vec3 dotCol=mix(oxDark*1.5,oxLight*0.5,htBright);
  float dotMask=(1.0-zone1)*0.9;
  dotMask*=smoothstep(0.0,0.05,uv.x);
  col+=dotCol*(dots*0.12+dots2*0.06)*dotMask;

  float gridX=smoothstep(0.01,0.0,abs(fract(uv.x*20.0)-0.5)-0.48);
  float gridY=smoothstep(0.01,0.0,abs(fract(uv.y*15.0)-0.5)-0.48);
  float grid=(gridX+gridY)*0.03*(1.0-zone1);
  col+=vec3(0.05,0.1,0.18)*grid;

  float z2mask=smoothstep(0.2,0.4,uv.x)*smoothstep(0.8,0.55,uv.x);
  float staticN=hash2(floor(gl_FragCoord.xy*0.5)+fract(T*30.0)*100.0);
  float scanline=sin(uv.y*r.y*0.5)*0.5+0.5;
  scanline=pow(scanline,8.0)*0.15;
  float noiseThreshold=0.55+0.1*sin(T*0.5);
  float staticDots=step(noiseThreshold,staticN);
  float distortedNoise=fbm2(uv*vec2(8.0,12.0)+vec2(0.0,T*0.3));
  float dissolution=staticDots*0.08+distortedNoise*0.04;
  vec3 staticCol=mix(oxDark,vec3(0.12,0.14,0.2),staticN*0.5);
  col+=staticCol*dissolution*z2mask;
  col+=vec3(0.04,0.06,0.1)*scanline*z2mask;

  float caOffset=0.003*z2mask;
  float nR=hash2(floor(gl_FragCoord.xy*0.5+vec2(caOffset*r.x,0.0))+fract(T*30.0)*100.0);
  float nB=hash2(floor(gl_FragCoord.xy*0.5-vec2(caOffset*r.x,0.0))+fract(T*30.0)*100.0);
  float caSplit=step(noiseThreshold,nR)-step(noiseThreshold,nB);
  col.r+=caSplit*0.015*z2mask;
  col.b-=caSplit*0.015*z2mask;

  for(int i=0;i<8;i++){
    float fi=float(i);
    float seed=fi*13.7+200.0;
    float bandY=hash(seed)*1.1-0.05;
    float thickness=0.01+0.04*hash(seed+1.0);
    float dist=abs(uv.y-bandY);
    float band=exp(-dist*dist/(thickness*thickness));
    float speed=1.0+2.0*hash(seed+10.0);
    float xFlow=uv.x+T*speed;
    float hVar=0.5+0.5*fbm1(xFlow*2.5+fi*9.0);
    band*=hVar;
    vec3 bandCol=mix(oxLight,safetyOrange,hash(seed+5.0)*0.4+zone3*0.3);
    float bright=0.2+0.3*hash(seed+3.0);
    col+=bandCol*band*bright*zone3;
  }

  for(int i=0;i<5;i++){
    float fi=float(i);
    float seed=fi*23.3+300.0;
    float bandY=hash(seed)*0.8+0.1;
    float thickness=0.002+0.006*hash(seed+1.0);
    float dist=abs(uv.y-bandY);
    float band=exp(-dist*dist/(thickness*thickness));
    float speed=2.0+3.0*hash(seed+10.0);
    float xFlow=uv.x+T*speed;
    float hVar=noise(xFlow*4.0+fi*11.0);
    vec3 sCol=mix(oxLight*1.5,safetyOrange,zone3*0.5);
    sCol=mix(sCol,vec3(0.8,0.5,0.3),hVar*0.2);
    col+=sCol*band*hVar*0.3*zone3;
  }

  float rightGlow=zone3*zone3*0.06;
  col+=safetyOrange*rightGlow;

  float pulseY=0.55;
  float pulseSpeed=0.1;
  float pulseX=fract(T*pulseSpeed);
  float trailLen=0.06;
  float pDx=uv.x-pulseX;
  float pDy=uv.y-pulseY;
  float pulseCore=exp(-(pDy*pDy)*1000.0)*exp(-pDx*pDx*300.0);
  float trailStrength=pulseX;
  float trail=exp(-(pDy*pDy)*500.0)*smoothstep(-trailLen*(1.0+trailStrength*3.0),0.0,pDx)*exp(-max(pDx,0.0)*(20.0-trailStrength*10.0));
  trail*=smoothstep(pulseX-trailLen*4.0,pulseX,uv.x);
  vec3 pulseCol=mix(
    vec3(0.2,0.3,0.45),
    mix(oxLight*2.0,safetyOrange,0.5),
    pulseX
  );
  col+=pulseCol*pulseCore*0.5;
  col+=pulseCol*trail*0.15*trailStrength;

  float p2X=fract(T*pulseSpeed+0.5);
  float p2Dx=uv.x-p2X;
  float p2Dy=uv.y-pulseY;
  float p2Core=exp(-(p2Dy*p2Dy)*800.0)*exp(-p2Dx*p2Dx*250.0);
  float p2Trail=exp(-(p2Dy*p2Dy)*400.0)*smoothstep(-trailLen*(1.0+p2X*2.0),0.0,p2Dx)*exp(-max(p2Dx,0.0)*(22.0-p2X*8.0));
  p2Trail*=smoothstep(p2X-trailLen*3.0,p2X,uv.x);
  vec3 p2Col=mix(vec3(0.15,0.22,0.35),safetyOrange*0.7,p2X);
  col+=p2Col*p2Core*0.3;
  col+=p2Col*p2Trail*0.08*p2X;

  float border1=exp(-pow(uv.x-0.33,2.0)*800.0)*0.04;
  col+=vec3(0.1,0.12,0.18)*border1;
  float border2=exp(-pow(uv.x-0.66,2.0)*800.0)*0.04;
  col+=mix(oxLight,safetyOrange,0.3)*border2;

  float fadeBot=smoothstep(0.0,0.12,uv.y);
  col=mix(carbon,col,fadeBot);

  float grain=(hash2(gl_FragCoord.xy+fract(T*73.0))-0.5)*0.02;
  col+=grain;

  col=clamp(col,0.0,1.0);
  gl_FragColor=vec4(col,1.0);
}
`;

export default function TimelineBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1.0 - e.clientY / window.innerHeight;
    };
    document.addEventListener("mousemove", onMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, VS)!);
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, FS)!);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pLoc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, "t");
    const uR = gl.getUniformLocation(prog, "r");
    const uM = gl.getUniformLocation(prog, "m");

    const t0 = performance.now();

    const render = () => {
      const elapsed = (performance.now() - t0) / 1000;
      smx += (mx - smx) * 0.03;
      smy += (my - smy) * 0.03;
      gl.uniform1f(uT, elapsed);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform2f(uM, smx, smy);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        zIndex: 0,
              }}
    />
  );
}
