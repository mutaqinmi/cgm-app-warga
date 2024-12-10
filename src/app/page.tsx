'use client';
import Link from 'next/link';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Root Component
export default function Page(){
    const route = useRouter();
    
    useEffect(() => {
        setTimeout(() => {
            route.push('/beranda');
        }, 3000)
    }, [route]);

    return <div className="w-screen h-screen flex flex-col gap-2 justify-center items-center">
        <h1 className="text-3xl font-semibold">Selamat Datang di CGM Warga</h1>
        <span className="text-sm">Mengarahkan anda menuju halaman <Link href={'/beranda'} className="underline">Beranda</Link> ...</span>
    </div>
}