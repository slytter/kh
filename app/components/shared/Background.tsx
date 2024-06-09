import { Noise } from "~/components/shared/Noise";
import { MeshGradientRenderer } from "@johnn-e/react-mesh-gradient";

export const Background = () => (
  <div className="absolute top-0 -z-10 h-full w-full bg-white">
    <MeshGradientRenderer
      colors={["#ffffff", "#ff00c9", "#ffffff", "#4900ff", "#ffffff"]}
      speed={0.006}
      className="absolute h-full w-full opacity-100 z-0"
      wireframe={false}
      backgroundColor={"#FFFFFF"}
    />

    <Noise />
    {/* <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.9)] opacity-50 blur-[80px]"></div> */}
  </div>
);
