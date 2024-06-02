import { createContext, useContext, useState } from "react";

type SettingsContextType = {
  fps: number;
  setFps: React.Dispatch<React.SetStateAction<number>>;
  trailLength: number;
  setTrailLength: React.Dispatch<React.SetStateAction<number>>;
  trailFadeSpeed: number;
  setTrailFadeSpeed: React.Dispatch<React.SetStateAction<number>>;
  displayMagnitude: boolean;
  setDisplayMagnitude: React.Dispatch<React.SetStateAction<boolean>>;
};
const DEFAULT_SETTINGS: SettingsContextType = {
  fps: 60,
  setFps: () => undefined,
  trailLength: 10,
  setTrailLength: () => undefined,
  trailFadeSpeed: 1,
  setTrailFadeSpeed: () => undefined,
  displayMagnitude: false,
  setDisplayMagnitude: () => undefined,
};
const SettingsContext = createContext<SettingsContextType>(DEFAULT_SETTINGS);
export const useSettingsContext = () => useContext(SettingsContext);
const SettingsProvider = ({
  children,
  value,
}: {
  value: SettingsContextType;
  children: React.ReactNode;
}) => {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
export default SettingsProvider;
