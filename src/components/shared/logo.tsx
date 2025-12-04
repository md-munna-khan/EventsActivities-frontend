"use client";

import Image from "next/image";

type LogoProps = {
    width?: number;
    height?: number;
};

export const Logo = ({ width = 150, height = 50 }: LogoProps) => {
    return (
        <Image
            src="/evenzo .png"
            alt="Events Management Logo"
            width={width}
            height={height}
            priority
        />
    );
};
