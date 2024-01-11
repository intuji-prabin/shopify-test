const ArrowRight = ({ fillColor = '#0F1010' }: { fillColor?: string }) => {
    return (
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.3334 12L16.3334 7M21.3334 12L16.3334 17M21.3334 12H3.33337" stroke={fillColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );
}

export default ArrowRight;