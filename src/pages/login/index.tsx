'use client'

import { ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import ilustration from '@/assets/ilustration.svg'
import HeadMetatags from '@/components/head-metatags'
import { Button } from '@/components/ui/button'
import { sleep } from '@/lib/utils'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { push } = useRouter()

  const onLogin = async () => {
    setIsLoading(true)
    await sleep(3500)
    push('/draft')
  }

  return (
    <>
      <HeadMetatags title="Login" />
      <div
        className="overflow-hidden flex w-full min-h-screen items-center justify-center bg-[#f3f4f6]"
        style={{
          backgroundImage: `url("/static/background.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex flex-col ">
          <h1 className="text-4xl font-bold text-center">Bem vindo(a)!</h1>
          <span className="text-2xl mt-2 text-center">
            Gestão de draft do Rivvals
          </span>
          <Image
            src={ilustration}
            alt="ilustratoin"
            width={400}
            height={400}
            className="self-center py-24"
          />
          <Button
            onClick={onLogin}
            className="text-xl self-center h-14 w-1/2 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600 hover:to-purple-900"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-7 w-7 animate-spin" />
                <span className="text-md ml-2">Carregando...</span>
              </>
            ) : (
              <>
                <span className="text-md">Entrar</span>
                <ArrowRight className="ml-2 h-6 w-6" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
