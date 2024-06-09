import { useEffect } from "react";

export const Noise = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/grained@0.0.2/grained.min.js";
    script.async = true;

    document.body.appendChild(script);
    grained("#_grained", {
      animate: true,
      patternWidth: 500,
      patternHeight: 500,
      grainOpacity: 0.6,
      grainDensity: 1,
      grainWidth: 1,
      grainHeight: 1,
    });

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="_grained"
      className="mix-blend-soft-light"
      style={{ width: "100%", height: "100%", position: "absolute" }}
    ></div>
  );
};
