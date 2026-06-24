import { create } from "zustand";

interface SceneState {
	contAreaWidth: number;
	contAreaHeight: number;

	setContAreaWidth: (width: number) => void;
	setContAreaHeight: (height: number) => void;
} 

export const useSceneStore = create<SceneState>((set) => ({
	contAreaWidth: 320,
	contAreaHeight: 320,

	setContAreaWidth: (width) => set({ contAreaWidth: width }),
	setContAreaHeight: (height) => set({ contAreaHeight: height }),
}));