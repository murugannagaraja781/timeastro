// @ts-ignore
import "../styles/globals.css";
import type { AppProps } from "next/app";
import BottomNav from "../components/BottomNav";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="pb-16 md:pb-0">
      <Component {...pageProps} />
      <BottomNav />
    </div>
  );
}
