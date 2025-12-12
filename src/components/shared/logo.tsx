"use client";

import Image from "next/image";
import Link from "next/link";

type LogoProps = {
    width?: number;
    height?: number;
};

export const Logo = ({ width = 150, height = 50 }: LogoProps) => {
    return (
        <div className="flex items-center" style={{ width, height }}>
            <Image
                src="/evenzo .png"
                alt="Events Management Logo"
                width={width}
                height={height}
                priority
                style={{ width: "100%", height: "auto" }}
            />
        </div>
    );
};
