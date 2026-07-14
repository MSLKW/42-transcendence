export const StripeBg = () => {
    return (
        <section className="cont-bg">
            <svg
                width="100vw" height="100vh"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid slice"
            >
                <polygon
                    points="50,0 100,0 50,100, 0,100"
                    fill="var(--color-a1)"
                    stroke="var(--color-a2)"
                    strokeWidth="0.1"
                />
            </svg>
        </section>
    );
}