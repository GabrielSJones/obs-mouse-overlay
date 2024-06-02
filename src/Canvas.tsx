import { useContext, useEffect, useRef } from "react";
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

type MouseInputType = [number, number];

function Canvas({
  //resetState,
  //setResetState,
  //FRAMERATE,
  //TRAIL_LENGTH,
  //TRAIL_FADE_SPEED,
  BACKGROUND_COLOR,
}: {
  resetState: boolean;
  //setResetState: React.Dispatch<React.SetStateAction<boolean>>;
  //FRAMERATE: number;
  //TRAIL_LENGTH: number;
  //TRAIL_FADE_SPEED: number;
  BACKGROUND_COLOR: string;
}) {
  const { fps, trailLength, trailFadeSpeed } = useSettingsContext();
  const FRAMETIME_IN_MS = 1000 / fps; //why
  const ref = useRef<HTMLCanvasElement>(null);
  const mouseInput = useRef<Array<MouseInputType>>([]);

  console.log(fps);
  console.log(trailLength);
  console.log(trailFadeSpeed);

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
    for (var i = len - 1; i >= 0; i--) {
      const x = mouseInput.current[i][0];
      const y = mouseInput.current[i][1];

      //console.log(i + "index");
      const opacity = (100 * ((i + 1) / len)) / trailFadeSpeed;
      //console.log(opacity + "opacity\n");
      //console.log(len + "len\n");
      pointer.moveTo(canvasW / 2, canvasH / 2);
      pointer.lineTo(canvasW / 2 + x * scalar, canvasH / 2 + y * scalar);
      pointer.strokeStyle = "rgb(255,0,255," + `${opacity})`;
      //console.log(pointer.strokeStyle)
      pointer.stroke();
    }
  }

  async function GetMousePosition() {
    const mousePos = await invoke<MouseInputType>("send_mouse_position");
    mouseInput.current.push(mousePos);
    //console.log(mousePos);
    while (mouseInput.current.length > trailLength) {
      console.log(`SHIFTING: ${trailLength - mouseInput.current.length}`);
      mouseInput.current.shift();
    }
  }

  return (
    <div className="askdjfghasdf">
      <canvas
        height={"fit-content"}
        width={"fit-content"}
        style={{ background: BACKGROUND_COLOR }}
        ref={ref}
      ></canvas>
    </div>
  );
}

export default Canvas;
