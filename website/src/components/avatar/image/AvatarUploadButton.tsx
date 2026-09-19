export const AvatarUploadButton = () => {
	return (
		<button 
			// onClick={() => setAvatar(id)}
			className="
				hover:not-disabled:scale-105 active:hover:not-disabled:scale-100
				focus-visible:outline-double hover:not-disabled:outline-double outline-b5 outline-offset-5
				border-n2 bg-n3/20
				h-6rem aspect-square
				border rounded-sm
				cursor-pointer
			"
		>
			<img
				src="avatar-upload.webp"
				alt="avatar-upload.webp"
				loading="lazy"
			/>
		</button>
	)
}