import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { useSettingsContext } from "./SettingsContext";

// import { currentMonitor } from "@tauri-apps/api/window";
// const monitor = await currentMonitor();

// var monitorWidthHalf = 1920 / 2;
// var monitorHeightHalf = 1080 / 2;

// if (monitor) {
//   monitorWidthHalf = monitor.size.width / 2;
//   monitorHeightHalf = monitor.size.height / 2;
// }

type MouseInputType = [number, number, number];

function Canvas() {
  const { fps, trailLength, trailFadeSpeed, isVerboseMode } =
    useSettingsContext();
  const FRAMETIME_IN_MS = 1000 / fps; //why
  const ref = useRef<HTMLCanvasElement>(null);
  const mouseInput = useRef<Array<MouseInputType>>([]);
  const dotProductArray: Array<number> = [];
  if (isVerboseMode) {
    console.log(fps);
    console.log(trailLength);
    console.log(trailFadeSpeed);
  }
  useEffect(() => {
    const timeout = setInterval(() => {
      GetMousePosition().then(() => {
        DrawMouseOnCanvas();
      });
    }, FRAMETIME_IN_MS);
    return () => {
      clearInterval(timeout);
    };
  }, [ref, fps, trailLength, trailFadeSpeed]);
  function DrawMouseOnCanvas() {
    const pointer = ref.current?.getContext("2d");
    const len = mouseInput.current.length;
    if (!pointer || ref.current == null || ref.current == undefined) {
      return;
    }
    pointer.clearRect(0, 0, ref.current.width, ref.current.height);
    pointer.beginPath();
    let canvasW = ref.current!.width;
    let canvasH = ref.current!.height;
    let scalar = 50;

    let x = 0,
      xOld,
      y = 0,
      yOld,
      mag = 0,
      magOld: number;
    let dotProduct: number;
    for (var i = len - 1; i > 0; i--) {
      //purposefully not accessing "last" index
      xOld = mouseInput.current[i][0];
      yOld = mouseInput.current[i][1];
      magOld = mouseInput.current[i][2];
      if (i == len - 1) {
        x = mouseInput.current[i - 1][0];
        y = mouseInput.current[i - 1][1];
        mag = mouseInput.current[i - 1][2];
      }
      dotProduct = x * xOld + y * yOld;
      dotProductArray!.push(dotProduct);
      //console.log(i + "index");
      const opacity = (100 * ((i + 1) / len)) / trailFadeSpeed;
      //console.log(opacity + "opacity\n");
      //console.log(len + "len\n");
      pointer.moveTo(canvasW / 2, canvasH / 2);
      pointer.lineTo(canvasW / 2 + x * mag, canvasH / 2 + y * mag);
      pointer.strokeStyle = "rgb(255,0,255," + `${opacity})`;
      //console.log(pointer.strokeStyle)
      pointer.stroke();

      x = xOld;
      y = yOld;
      mag = magOld;
    }
  }

  async function GetMousePosition() {
    const mousePos = await invoke<MouseInputType>("send_mouse_position");
    mouseInput.current.push(mousePos);
    //console.log(mousePos);
    while (mouseInput.current.length > trailLength) {
      console.log(`SHIFTING: ${trailLength - mouseInput.current.length}`);

      mouseInput.current.shift();
      dotProductArray.shift();
    }
  }

  return (
    <canvas className="canvas"
      height={1000}
      width={1000}
      style={{ background: "rgb(0,255,0,100)", height:"100%", width:"100%",
       }}
      ref={ref}
    ></canvas>
  );
}

export default Canvas;
