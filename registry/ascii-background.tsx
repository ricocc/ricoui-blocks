"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type AsciiBackgroundProps = {
  className?: string;
  style?: CSSProperties;
  paused?: boolean;
  theme?: "light" | "dark";
};

/** Blue ASCII currents, sized to their container. No external dependencies. */
export function AsciiBackground({
  className = "",
  style,
  paused = false,
  theme = "light",
}: AsciiBackgroundProps) {
  const container = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    fallback = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<ReturnType<typeof createBackground> | null>(null);
  useEffect(() => {
    if (!container.current || !canvas.current || !fallback.current) return;
    const instance = createBackground(
      container.current,
      canvas.current,
      fallback.current,
    );
    renderer.current = instance;
    return () => {
      instance.destroy();
      renderer.current = null;
    };
  }, []);
  useEffect(() => {
    renderer.current?.setPaused(paused);
  }, [paused]);
  useEffect(() => { renderer.current?.setTheme(theme); }, [theme]);
  return (
    <div
      ref={container}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 240,
        overflow: "hidden",
        background: theme === "dark" ? "#111824" : "#fff",
        ...style,
      }}
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <canvas
        ref={fallback}
        hidden
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

function createBackground(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  fallbackCanvas: HTMLCanvasElement,
) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  })!;
  let width = 1,
    height = 1,
    dpr = 1,
    count = 0,
    paused = false,
  theme = "light",
    frame = 0,
    elapsed = 0,
    previous = 0;
  let dark = false;
  const trail = new Float32Array(24);
  for (let i = 0; i < 6; i++) trail[i * 4 + 2] = -100;
  let trailIndex = 0,
    lastWake = -1,
    lastPointer: { x: number; y: number; at: number } | null = null;
  let gpu: {
    buffer: WebGLBuffer;
    size: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
    dpr: WebGLUniformLocation | null;
    wake: WebGLUniformLocation | null;
    ink: WebGLUniformLocation | null;
  } | null = null;
  const fallback = fallbackCanvas.getContext("2d", { alpha: false })!;
  const resources: {
    shaders: WebGLShader[];
    program?: WebGLProgram;
    buffer?: WebGLBuffer;
  } = { shaders: [] };
  let fallbackSeeds: number[][] = [];
  const vertex = `
  precision highp float;
  attribute vec2 a_position;
  attribute vec4 a_random;
  uniform vec2 u_size;
  uniform float u_time, u_dpr;
  uniform vec4 u_wake[6];
  varying float v_density, v_type, v_bloom;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  void main(){
    float t=u_time*.52;
    vec2 p=a_position;
    vec2 uv=p/u_size;
    float eddy=.84+.11*sin(uv.x*6.0+uv.y*4.2-t*.8)
                  +.05*cos(uv.y*7.2-uv.x*3.5+t*.6);
    float density=eddy;
    float seed=a_random.x;
    density*=.965+.035*sin(u_time*.85+seed*28.);
    vec2 flow=vec2(sin(uv.y*9.+t*1.4),cos(uv.x*8.-t))*5.;
    vec2 displacement=vec2(0.);
    for(int i=0;i<6;i++){
      vec4 wake=u_wake[i];
      float age=u_time-wake.z;
      if(age>=0. && age<.6){
        vec2 delta=p-wake.xy;
        float distance=length(delta);
        vec2 direction=delta/max(distance,1.);
        // Each wake starts at zero and retires before its slot is reused.
        float envelope=smoothstep(0.,.12,age)*(1.-smoothstep(.32,.6,age))*wake.w;
        float push=exp(-distance*distance/(95.*95.))*exp(-age*3.3)*envelope;
        float band=(distance-age*110.)/25.;
        float ripple=sin(band*2.)*exp(-band*band)*exp(-age*1.8)*envelope;
        displacement+=direction*(push*25.+ripple*9.);
      }
    }
    // Smooth saturation prevents overlapping wakes from throwing glyphs around.
    displacement/=1.+length(displacement)/24.;
    p+=flow+displacement;
    gl_Position=vec4(p/u_size*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);
    gl_PointSize=6.*u_dpr;
    v_density=density;
    // Each location has its own clock. New selections are made only while
    // the accent is invisible, avoiding synchronized swaps or flashing.
    float clock=u_time/(8.+a_random.y*6.)+seed*19.;
    float cycle=floor(clock);
    float phase=fract(clock);
    float selected=step(.94,hash(vec2(a_random.z*913.7,cycle*37.1)));
    v_bloom=selected*smoothstep(.06,.27,phase)*(1.-smoothstep(.63,.91,phase));
    v_type=floor(hash(vec2(a_random.w*871.3,cycle*43.7))*4.);
  }`;
  const fragment = `
  precision mediump float;
  uniform vec3 u_ink;
  varying float v_density, v_type, v_bloom;
  void main(){
    vec2 p=(gl_PointCoord-.5)*6.;
    float dotShape=1.-smoothstep(.52,.95,length(p));
    p/=mix(.38,1.,v_bloom);
    float shape;
    if(v_type<.5){shape=1.-smoothstep(1.05,1.45,length(p));}
    else if(v_type<1.5){shape=1.-smoothstep(.44,.82,length(vec2(p.x,abs(p.y)-1.25)));}
    else {
      float cross=min(max(abs(p.x)-.43,abs(p.y)-1.9),max(abs(p.x)-1.9,abs(p.y)-.43));
      if(v_type>2.5) cross=min(cross,max(abs(abs(p.x)-abs(p.y))-.36,max(abs(p.x),abs(p.y))-1.45));
      shape=1.-smoothstep(0.,.4,cross);
    }
    shape=mix(dotShape,shape,v_bloom);
    float alpha=shape*v_density*.46;
    if(alpha<.015) discard;
    gl_FragColor=vec4(u_ink,alpha);
  }`;
  function shader(type: number, source: string) {
    const s = gl.createShader(type)!;
    resources.shaders.push(s);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw Error(gl.getShaderInfoLog(s) || "Shader compilation failed");
    return s;
  }
  function setup() {
    const program = gl.createProgram()!;
    resources.program = program;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(program) || "Program linking failed");
    gl.useProgram(program);
    const buffer = gl.createBuffer()!;
    resources.buffer = buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 24, 0);
    const random = gl.getAttribLocation(program, "a_random");
    gl.enableVertexAttribArray(random);
    gl.vertexAttribPointer(random, 4, gl.FLOAT, false, 24, 8);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(1, 1, 1, 1);
    gpu = {
      buffer,
      ink: gl.getUniformLocation(program, "u_ink"),
      size: gl.getUniformLocation(program, "u_size"),
      time: gl.getUniformLocation(program, "u_time"),
      dpr: gl.getUniformLocation(program, "u_dpr"),
      wake: gl.getUniformLocation(program, "u_wake[0]"),
    };
  }
  function resize() {
    width = Math.max(1, container.clientWidth);
    height = Math.max(1, container.clientHeight);
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    fallbackCanvas.width = canvas.width;
    fallbackCanvas.height = canvas.height;
    if (gpu) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      const step = Math.max(8, Math.sqrt((width * height) / 22000));
      const data: number[] = [];
      // Independent random attributes are uploaded once, never derived from
      // grid coordinates. This avoids diagonal bands of synchronized accents.
      for (let y = -16; y < height + 16; y += step)
        for (let x = -16; x < width + 16; x += step)
          data.push(
            x,
            y,
            Math.random(),
            Math.random(),
            Math.random(),
            Math.random(),
          );
      count = data.length / 6;
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      gl.uniform2f(gpu.size, width, height);
      gl.uniform1f(gpu.dpr, dpr);
    } else {
      fallback.setTransform(dpr, 0, 0, dpr, 0, 0);
      const step = Math.max(10, Math.sqrt((width * height) / 6500));
      fallbackSeeds = Array.from(
        { length: Math.ceil(width / step) * Math.ceil(height / step) },
        () => [Math.random(), Math.random(), Math.random()],
      );
    }
    render();
  }
  function render() {
    if (gpu) {
      gl.clearColor(...(dark ? [17/255,24/255,36/255,1] : [1,1,1,1]) as [number,number,number,number]);
      gl.uniform3f(gpu.ink, ...(dark ? [143/255,185/255,1] : [45/255,109/255,195/255]) as [number,number,number]);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(gpu.time, elapsed);
      gl.uniform4fv(gpu.wake, trail);
      gl.drawArrays(gl.POINTS, 0, count);
    } else {
      // Lightweight fallback for devices without WebGL: one batched path.
      fallback.fillStyle = dark ? "#111824" : "#fff";
      fallback.fillRect(0, 0, width, height);
      fallback.fillStyle = dark ? "rgba(143,185,255,.6)" : "rgba(45,109,195,.46)";
      fallback.beginPath();
      const step = Math.max(10, Math.sqrt((width * height) / 6500)),
        t = elapsed * 0.52;
      const ease = (value: number) => { const q = Math.max(0, Math.min(1, value)); return q * q * (3 - 2 * q); };
      const wakes = [];
      for (let i = 0; i < 6; i++) {
        const age = elapsed - trail[i * 4 + 2];
        if (age < 0 || age >= 0.6) continue;
        const strength = ease(age / 0.12) * (1 - ease((age - 0.32) / 0.28)) * Math.exp(-age * 3.3) * trail[i * 4 + 3];
        wakes.push({ x: trail[i * 4], y: trail[i * 4 + 1], strength });
      }
      let index = 0;
      for (let y = 0; y < height; y += step)
        for (let x = 0; x < width; x += step) {
          const random = fallbackSeeds[index++];
          const u = x / width,
            v = y / height;
          const density = .84 + .11 * Math.sin(u * 6 + v * 4.2 - t * .8) + .05 * Math.cos(v * 7.2 - u * 3.5 + t * .6);
          let px = x + Math.sin((y / height) * 9 + t * 1.7) * 8,
            py = y + Math.cos((x / width) * 8 - t * 1.3) * 8;
          let displacementX = 0, displacementY = 0;
          for (const wake of wakes) {
            const dx = x - wake.x, dy = y - wake.y, distance = Math.hypot(dx, dy) || 1;
            const push = 25 * Math.exp(-distance * distance / 9025) * wake.strength;
            displacementX += dx / distance * push;
            displacementY += dy / distance * push;
          }
          const saturation = 1 + Math.hypot(displacementX, displacementY) / 24;
          px += displacementX / saturation;
          py += displacementY / saturation;
          const clock = elapsed / (8 + random[1] * 6) + random[0] * 19,
            cycle = Math.floor(clock),
            phase = clock - cycle;
          const selection =
            Math.sin(random[2] * 913.7 * 127.1 + cycle * 37.1 * 311.7) *
            43758.5453;
          const ease = (q: number) => {
            q = Math.max(0, Math.min(1, q));
            return q * q * (3 - 2 * q);
          };
          const bloom =
            (selection - Math.floor(selection) > 0.94 ? 1 : 0) *
            ease((phase - 0.06) / 0.21) *
            (1 - ease((phase - 0.63) / 0.28));
          const radius =
            Math.max(0.2, Math.min(0.7, density * 0.7)) * (1 + bloom * 1.1);
          fallback.moveTo(px + radius, py);
          fallback.arc(px, py, radius, 0, Math.PI * 2);
        }
      fallback.fill();
    }
  }
  function tick(now: number) {
    frame = 0;
    if (paused || reduced.matches || !visible || document.hidden) {
      previous = 0;
      return;
    }
    if (previous) elapsed += Math.min((now - previous) / 1000, 0.05);
    previous = now;
    render();
    frame = requestAnimationFrame(tick);
  }
  function start() {
    if (!frame && !paused && !reduced.matches && visible && !document.hidden)
      frame = requestAnimationFrame(tick);
  }

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    render();
    start();
  }
  function pointer(event: PointerEvent) {
    if (paused || reduced.matches || !visible) return;
    const rect = container.getBoundingClientRect(),
      x = event.clientX - rect.left,
      y = event.clientY - rect.top;
    if (elapsed - lastWake > 0.1) {
      const i = trailIndex * 4;
      trail[i] = x;
      trail[i + 1] = y;
      trail[i + 2] = elapsed;
      const speed = lastPointer
        ? Math.hypot(x - lastPointer.x, y - lastPointer.y) / Math.max(0.016, elapsed - lastPointer.at)
        : 0;
      trail[i + 3] = Math.max(0.35, 1 / (1 + speed / 1400));
      trailIndex = (trailIndex + 1) % 6;
      lastWake = elapsed;
    }
    lastPointer = { x, y, at: elapsed };
  }
  function lost(event: Event) {
    event.preventDefault();
    paused = true;
    sync();
  }
  function restored() {
    try {
      setup();
      resize();
      paused = false;
      sync();
    } catch {
      gpu = null;
      canvas.hidden = true;
      fallbackCanvas.hidden = false;
      resize();
      sync();
    }
  }
  try {
    if (gl) setup();
  } catch {
    gpu = null;
  }
  canvas.hidden = !gpu;
  fallbackCanvas.hidden = Boolean(gpu);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    sync();
  });
  intersectionObserver.observe(container);
  container.addEventListener("pointermove", pointer, { passive: true });
  document.addEventListener("visibilitychange", sync);
  reduced.addEventListener("change", sync);
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  resize();
  start();
  return {
    setTheme(value: "light" | "dark") { dark = value === "dark"; render(); },
    setPaused(value: boolean) {
      paused = value;
      sync();
    },
    destroy() {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener("pointermove", pointer);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      if (gl) {
        resources.shaders.forEach((s) => gl.deleteShader(s));
        if (resources.buffer) gl.deleteBuffer(resources.buffer);
        if (resources.program) gl.deleteProgram(resources.program);
      }
    },
  };
}
