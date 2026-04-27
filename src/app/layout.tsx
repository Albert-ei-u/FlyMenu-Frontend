import type { Metadata } from "next";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SocketProvider } from "@/context/SocketContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlyMenu — Order Healthy & Fresh Food Any Time",
  description:
    "FlyMenu lets you discover, book and order from the best restaurants in your city. Healthy, fresh meals delivered when you want them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0d0d0d] antialiased">
        <SocketProvider>
          <CartProvider>
            <MotionProvider>{children}</MotionProvider>
          </CartProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
