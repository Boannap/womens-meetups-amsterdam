import Shell from "@/components/Shell";

// One root layout keeps builds and 404 pages simple. Dutch pages mark themselves with lang="nl"
// on their own wrapper, and hreflang in the metadata tells search engines which version is which.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
