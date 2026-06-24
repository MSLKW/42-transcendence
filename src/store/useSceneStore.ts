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

	setContAreaWidth: (contAreaWidth) => set({ contAreaWidth }),
	setContAreaHeight: (contAreaHeight) => set({ contAreaHeight }),
}));