import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WeatherProvider } from "@/contexts/weather-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather App - 실시간 날씨 정보",
  description: "전 세계 도시의 실시간 날씨 정보와 예보를 제공하는 웹 애플리케이션",
  keywords: ["날씨", "weather", "예보", "forecast", "실시간", "온도", "습도"],
  authors: [{ name: "Weather App Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Weather App - 실시간 날씨 정보",
    description: "전 세계 도시의 실시간 날씨 정보와 예보를 제공하는 웹 애플리케이션",
    type: "website",
    locale: "ko_KR",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WeatherProvider>
          {children}
        </WeatherProvider>
      </body>
    </html>
  );
}
