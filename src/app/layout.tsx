import MantineProvider from "~/utils/providers/Mantine";
import "~/styles/globals.css";

export default async function Layout({ children }) {
  return (
    <html lang="fr">
      <head>
        <title>CV Érik Aouizerate</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </head>
      <body className="">
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
