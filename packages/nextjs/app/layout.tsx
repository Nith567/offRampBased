import { Manrope } from "next/font/google";
import Head from "next/head";
import { Providers } from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
// import { Metadata } from "next";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import "~~/styles/globals.css";

// import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const manrope = Manrope({ subsets: ["latin"] });

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className="bg-white">
      <Head>
        <title>Scaffold-ETH 2 App</title>
        <meta name="description" content="Built with 🏗 Scaffold-ETH 2" />
      </Head>
      <body className={manrope.className}>
        <Providers>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </Providers>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
