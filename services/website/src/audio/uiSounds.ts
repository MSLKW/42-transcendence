const soundFiles = {
	hover: "/audio/button_hover.opus",
	click: "/audio/button_click.opus",
	release: "/audio/button_release.opus",
	notif: "/audio/notif.opus",
	chat: "/audio/chat.opus",
	shuffle: "/audio/shuffle.opus",
} as const;

type UiSound = keyof typeof soundFiles;

let audioContext: AudioContext | null = null;
let buffers: Record<UiSound, AudioBuffer> | null = null;
let loading: Promise<void> | null = null;
const pendingSounds: UiSound[] = [];

const initializeUiSounds = () => {
	if (!loading) {
		// Called from a trusted button click/key event so AudioContext creation is user-initiated.
		audioContext ??= new AudioContext();
		const context = audioContext;
		if (context.state === "suspended") void context.resume();
		const loadAttempt = Promise.all(Object.entries(soundFiles).map(async ([sound, file]) => {
			const response = await fetch(file);
			if (!response.ok) throw new Error(`Failed to load UI sound: ${file}`);
			return [sound as UiSound, await context.decodeAudioData(await response.arrayBuffer())] as const;
		})).then((entries) => {
			buffers = Object.fromEntries(entries) as Record<UiSound, AudioBuffer>;
			const queuedSounds = pendingSounds.splice(0);
			for (const sound of queuedSounds)
				playDecodedUiSound(sound);
		}).catch((error: unknown) => {
			pendingSounds.length = 0;
			console.error("Unable to preload UI sounds", error);
		}).finally(() => {
			if (loading === loadAttempt)
				loading = null;
		});
		loading = loadAttempt;
	}
	return loading;
};

const playDecodedUiSound = (sound: UiSound) => {
	const context = audioContext;
	const loadedBuffers = buffers;
	if (!context || !loadedBuffers)
		return;

	const buffer = loadedBuffers[sound];
	if (!buffer)
		return;

	const source = context.createBufferSource();
	source.buffer = buffer;
	source.connect(context.destination);
	source.start();
};

export const playUiSound = (sound: UiSound) => {
	// Ignore hover/focus sounds until an explicit action unlocks audio. This
	// prevents programmatic autofocus during initial render from creating a context.
	if (!audioContext && (sound === "hover" || sound === "notif"))
		return;

	if (!audioContext) {
		void initializeUiSounds();
	}

	if (buffers?.[sound]) {
		playDecodedUiSound(sound);
		return;
	}

	pendingSounds.push(sound);
};
