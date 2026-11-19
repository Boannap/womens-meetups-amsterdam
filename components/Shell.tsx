import { Gluten, Caveat, Courier_Prime, DM_Sans } from "next/font/google";
import SvgDefs from "./SvgDefs";
import Animations from "./Animations";
import Tracker from "./Tracker";
import "@/app/globals.css";

const gluten = Gluten({ subsets: ["latin"], variable: "--font-gluten", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });
const courier = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-courier", display: "swap" });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm", display: "swap" });

/** <html>/<body>, fonts and shared SVG drawings. */
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${gluten.variable} ${caveat.variable} ${courier.variable} ${dm.variable}`}>
      <body>
        <SvgDefs />
        {children}
        <Animations />
        <Tracker />
      </body>
    </html>
  );
}
