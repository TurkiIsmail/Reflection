"use client"
import Image from "next/image";
import dynamic from "next/dynamic";
import Nav from "@/components/navbar/nav";
import Footer from "@/components/Footer/footer";
const Mainsection = dynamic(() => import("@/components/landing/mainsection"), { ssr: false });
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== 'undefined' && localStorage.getItem("token");
    if (token) {
      router.push("/journals");
    }
  }, [router]);
  return (
    <div>
      <Nav />
      <Mainsection />
      <Footer />
    </div>
  );
}
