'use client'

import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

type IProps = {
  title: string
  description?: string
}

const HeadMetatags = (props: IProps) => {
  const [url, setUrl] = useState('')
  const route = useRouter()
  const parsedName = 'Rivvals Backoffice'
  const title = props?.title ? props?.title + ' | ' + parsedName : parsedName
  const defaultDescription = props?.description || parsedName

  useEffect(() => {
    const parsedUrl = `${window.location.origin}${route.pathname}`
    setUrl(parsedUrl)
  }, [route])

  return (
    <Head>
      <title>{title}</title>
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <link rel="icon" href="/static/favicon.ico" />
      <meta property="og:title" content={props.title} />
      <meta name="description" content={defaultDescription} />
      <meta property="og:description" content={defaultDescription} />
    </Head>
  )
}

export default HeadMetatags
