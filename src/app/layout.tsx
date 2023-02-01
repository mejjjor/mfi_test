import MantineProvider from "~/utils/providers/Mantine";
import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

export default async function Layout({ children }) {
  return (
    <html lang="fr">
      <head>
        <title>MFI TEST / ERIK A</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </head>
      <body className="">
        <MantineProvider>{children}</MantineProvider>
        <Analytics />
      </body>
    </html>
  );
}
