import { useEffect, useRef, useState } from "react";

export default function CursorRing() {
    const ringRef = useRef(null);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(pointer: fine)");
        setIsDesktop(mediaQuery.matches);

        const handleChange = (e) => {
            setIsDesktop(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    useEffect(() => {
        if (!isDesktop) return;

        const ring = ringRef.current;

        const moveCursor = (e) => {
            const clickable = e.target.closest(
                "a, button, input, textarea, select"
            );

            if (clickable) {
                ring.style.width = "56px";
                ring.style.height = "56px";
                ring.style.borderColor = "#b026ff";
                ring.style.boxShadow = "0 0 30px rgba(176,38,255,0.8)";
                ring.style.transform = `translate(${e.clientX - 28}px, ${e.clientY - 28}px)`;
            } else {
                ring.style.width = "32px";
                ring.style.height = "32px";
                ring.style.borderColor = "rgba(0,229,255,0.7)";
                ring.style.boxShadow = "0 0 15px rgba(0,229,255,0.5)";
                ring.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
            }
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, [isDesktop]);

    if (!isDesktop) return null;

    return (
        <div
            ref={ringRef}
            className="
                fixed
                top-0
                left-0
                w-8
                h-8
                rounded-full
                border
                border-electric-blue/70
                pointer-events-none
                z-[9999]
                transition-[width,height,border-color,box-shadow]
                duration-200
            "
        />
    );
}