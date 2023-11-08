import type { Joke } from '@prisma/client'
import { useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'

type LoaderData = { randomJoke: Joke }

export const loader = async () => {
  const count = await db.joke.count()
  const randomRowNumber = Math.floor(Math.random() * count)
  const [randomJoke] = await db.joke.findMany({
    skip: randomRowNumber,
    take: 1
  })
  return { randomJoke }
}

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>()

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
    </div>
  )
}
