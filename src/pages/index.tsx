/* eslint-disable @typescript-eslint/no-var-requires */
import dynamic from 'next/dynamic'

const LoginPage = dynamic(() => import('./login'), { ssr: false })

export default function Login() {
  return <LoginPage />
}
