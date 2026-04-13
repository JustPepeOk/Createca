"use client";

import { useRef, useEffect } from "react";

const VS = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;

const FS = `
precision highp float;
uniform float t;
uniform vec2 r;
uniform vec2 m;

#define PI 3.14159265

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

float sdLine(vec2 p,vec2 a,vec2 b){
  vec2 pa=p-a,ba=b-a;
  float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
  return length(pa-ba*h);
}

vec3 spectrum(float t){
  vec3 c;
  t=fract(t);
  if(t<0.17) c=mix(vec3(0.8,0.0,0.1),vec3(1.0,0.2,0.0),t/0.17);
  else if(t<0.33) c=mix(vec3(1.0,0.2,0.0),vec3(1.0,0.7,0.0),(t-0.17)/0.16);
  else if(t<0.5) c=mix(vec3(1.0,0.7,0.0),vec3(0.1,0.9,0.2),(t-0.33)/0.17);
  else if(t<0.67) c=mix(vec3(0.1,0.9,0.2),vec3(0.0,0.7,0.9),(t-0.5)/0.17);
  else if(t<0.83) c=mix(vec3(0.0,0.7,0.9),vec3(0.2,0.1,0.9),(t-0.67)/0.16);
  else c=mix(vec3(0.2,0.1,0.9),vec3(0.8,0.0,0.3),(t-0.83)/0.17);
  return c;
}

void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 st=uv*2.0-1.0;
  float aspect=r.x/r.y;
  st.x*=aspect;

  float T=t*0.08;
  vec2 mOff=(m-0.5)*0.4;
  mOff.x*=aspect;

  vec3 col=vec3(0.0);

  vec2 origin1=vec2(-0.8,0.6)+mOff*0.3;
  vec2 origin2=vec2(0.9,-0.5)-mOff*0.2;
  vec2 origin3=vec2(-0.4,-0.2)+mOff*0.15;

  for(int i=0;i<8;i++){
    float fi=float(i);
    float baseAngle=-0.6+fi*0.07+sin(T*0.5+fi*0.3)*0.02;
    float len=3.5;
    vec2 dir=vec2(cos(baseAngle),sin(baseAngle));
    vec2 endP=origin1+dir*len;
    float specT=fi/8.0+T*0.05;
    vec3 beamCol=spectrum(specT)*1.4;
    float thickness=0.008+0.006*sin(fi*1.7+T);
    float d=sdLine(st,origin1,endP);
    float core=smoothstep(thickness,thickness*0.3,d);
    float glow=smoothstep(thickness*8.0,0.0,d)*0.15;
    float bloom=smoothstep(thickness*25.0,0.0,d)*0.04;
    float fromOrigin=length(st-origin1)/len;
    float intensity=smoothstep(0.0,0.15,fromOrigin)*smoothstep(1.0,0.3,fromOrigin);
    col+=beamCol*(core*0.9+glow+bloom)*intensity;
  }

  for(int i=0;i<6;i++){
    float fi=float(i);
    float baseAngle=PI-0.5+fi*0.06+sin(T*0.4+fi*0.5)*0.015;
    float len=3.0;
    vec2 dir=vec2(cos(baseAngle),sin(baseAngle));
    vec2 endP=origin2+dir*len;
    float specT=fi/6.0*0.35+T*0.03;
    vec3 beamCol=spectrum(specT)*1.2;
    float thickness=0.006+0.005*sin(fi*2.1+T*0.7);
    float d=sdLine(st,origin2,endP);
    float core=smoothstep(thickness,thickness*0.3,d);
    float glow=smoothstep(thickness*7.0,0.0,d)*0.12;
    float bloom=smoothstep(thickness*20.0,0.0,d)*0.03;
    float fromOrigin=length(st-origin2)/len;
    float intensity=smoothstep(0.0,0.1,fromOrigin)*smoothstep(1.0,0.3,fromOrigin);
    col+=beamCol*(core*0.7+glow+bloom)*intensity;
  }

  for(int i=0;i<4;i++){
    float fi=float(i);
    float baseAngle=-0.15+fi*0.09+sin(T*0.6+fi)*0.025;
    float len=2.8;
    vec2 dir=vec2(cos(baseAngle),sin(baseAngle));
    vec2 endP=origin3+dir*len;
    float specT=0.4+fi/4.0*0.25+T*0.04;
    vec3 beamCol=spectrum(specT)*1.0;
    float thickness=0.005+0.003*sin(fi*3.0+T*0.9);
    float d=sdLine(st,origin3,endP);
    float core=smoothstep(thickness,thickness*0.3,d);
    float glow=smoothstep(thickness*6.0,0.0,d)*0.1;
    float fromOrigin=length(st-origin3)/len;
    float intensity=smoothstep(0.0,0.12,fromOrigin)*smoothstep(1.0,0.35,fromOrigin);
    col+=beamCol*(core*0.5+glow)*intensity;
  }

  vec2 cst=st*1.5+mOff*0.5;
  float c1=sin(cst.x*4.0+cst.y*3.0+T*1.2);
  float c2=sin(cst.x*3.0-cst.y*5.0-T*0.9);
  float c3=sin(cst.x*6.0+cst.y*2.0+T*1.5);
  float caustic=c1*c2*c3;
  caustic=smoothstep(0.7,0.95,caustic);
  float existingLight=dot(col,vec3(0.33));
  col+=vec3(0.95,0.92,0.88)*caustic*0.12*smoothstep(0.01,0.15,existingLight);

  for(int i=0;i<3;i++){
    float fi=float(i);
    float edgeAngle=0.3+fi*1.0+T*0.03;
    vec2 n=vec2(cos(edgeAngle),sin(edgeAngle));
    float d=abs(dot(st-vec2(0.0),n)-0.2*fi+0.1);
    float edge=smoothstep(0.015,0.0,d)*0.06;
    col+=vec3(0.7,0.75,0.8)*edge*smoothstep(0.0,0.5,length(st));
  }

  float cx=smoothstep(0.1,0.45,abs(st.x*0.6));
  float cy=smoothstep(0.08,0.4,abs(st.y*0.75));
  col*=mix(0.15,1.0,max(cx,cy));

  float grain=(hash(gl_FragCoord.xy+fract(T*73.0))-0.5)*0.025;
  col+=grain;

  float vig=1.0-smoothstep(0.8,1.8,length(st))*0.3;
  col*=vig;

  col=clamp(col,0.0,1.0);
  col=col*0.97+0.003;
  col=pow(col,vec3(0.96));

  gl_FragColor=vec4(col,1.0);
}
`;

export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouseMove);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
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

    const uT = gl.getUniformLocation(prog, "t");
    const uR = gl.getUniformLocation(prog, "r");
    const uM = gl.getUniformLocation(prog, "m");
    const t0 = performance.now();

    const render = () => {
      const elapsed = (performance.now() - t0) / 1000;
      smx += (mx - smx) * 0.025;
      smy += (my - smy) * 0.025;
      gl.uniform1f(uT, elapsed);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform2f(uM, smx, smy);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
