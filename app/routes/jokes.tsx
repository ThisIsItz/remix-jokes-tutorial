import type { Joke } from '@prisma/client'
import { json, type LinksFunction, type LoaderFunction } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'

import stylesUrl from '~/styles/jokes.css'
import { db } from '~/utils/db.server'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl }
]

type LoaderData = {
  jokeList: Array<Pick<Joke, 'id' | 'name'>>
}

export const loader: LoaderFunction = async () => {
  return json({
    jokeList: await db.joke.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  })
}

export default function JokesRoute() {
  const data = useLoaderData<LoaderData>()
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeList.map((joke) => {
                return (
                  <li key={joke.id}>
                    <Link to={joke.id}>{joke.name}</Link>
                  </li>
                )
              })}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
