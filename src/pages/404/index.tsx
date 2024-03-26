import { Frown } from 'lucide-react'
import { useRouter } from 'next/router'

import HeadMetatags from '@/components/head-metatags'
import { Button } from '@/components/ui/button'

export default function Page404() {
  const route = useRouter()
  return (
    <>
      <HeadMetatags title="Pagina não encontrada" />
      <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-14 text-center shadow-xl ">
          <Frown className="m-auto h-14 w-14 pb-4 " />
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="text-gray-600">Oops! Pagina não encontrada</p>
          <Button
            className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
            onClick={() => {
              route.back()
            }}
          >
            Voltar
          </Button>
        </div>
      </div>
    </>
  )
}
