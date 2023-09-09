import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SWE1R Batch Submit',
  description: 'Mass submission tool for STAR WARS Episode I Racer speedruns.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
		<html lang="en">
			<Providers>
				<body className={inter.className}>{children}</body>
			</Providers>
		</html>
  )
}
