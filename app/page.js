import Image from "next/image";
import Lottie from "lottie-react";
import Nav from "@/components/navbar/nav";
import Footer from "@/components/Footer/footer";
import Mainsection from "@/components/landing/mainsection";
export default function Home() {
  return (
    <div>
      <Nav />
      <Mainsection />
      <Footer />
    </div>
  );
}
