import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { LinksFunction, MetaFunction } from "react-router";
import "@fontsource-variable/inter";
import "./styles/global.css";

export const meta: MetaFunction = () => {
  return [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export const links: LinksFunction = () => {
  return [];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        {import.meta.env.DEV && (
          <script
            dangerouslySetInnerHTML={{
              __html: `if(new URLSearchParams(location.search).has('light'))document.documentElement.dataset.forceLight=''`,
            }}
          />
        )}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
