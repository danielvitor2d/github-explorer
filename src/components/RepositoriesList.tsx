import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

import '../styles/repositorieslist.scss'

interface Repository {
  name?: string;
  stargazers_count?: number;
  commits?: number;
  language?: string;
}

interface User {
  name?: string;
  login?: string;
  repositories?: Repository[];
}

export function RepositoriesList() {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [searching, setSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function handleFindRepositories() {
    setUser(null)
    setSearching(true)

    try {
      const responseUser = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          authorization: `token ${process.env.TOKEN_GITHUB}`
        }
      })

      const dataUser: User = await responseUser.json()

      if (!dataUser.login) {
        throw new Error("User not found!")
      }
      
      let dataRepositories: Repository[] = []

      let page = 1
      while (true) {
        const responseRepositories = await fetch(`https://api.github.com/users/${dataUser.login}/repos?per_page=100&page=${page}`, {
          headers: {
            authorization: `token ${process.env.TOKEN_GITHUB}`,
          },
        })
  
        const newRepositories = await responseRepositories.json()

        if (newRepositories.length === 0) break;

        dataRepositories = dataRepositories.concat(dataRepositories, newRepositories)

        page += 1
      }

      const newRepositories: Repository[] = []

      const promises = dataRepositories.map(async (repository: Repository) => {
        const responseCommits = await fetch(`https://api.github.com/repos/${dataUser.login}/${repository.name}/commits`, {
          headers: {
            authorization: `token ${process.env.TOKEN_GITHUB}`
          }
        })

        const dataCommits = await responseCommits.json()

        repository.commits = dataCommits.length

        newRepositories.push(repository)

        return repository
      }) || []

      await Promise.all(promises)

      setUser({
        name: dataUser.name,
        login: dataUser.login,
        repositories: [...newRepositories]
      })

      setSearching(false)
      setNotFound(false)
    } catch (error) {
      setSearching(false)
      setNotFound(true)
    }
  }

  return (
    <section className="repositories-list container">
      <header>
        <div className="input-group">
          <input
            type="text"
            placeholder="Digite o usuário"
            onChange={(e) => {
              setUsername(e.target.value)
            }}
          />
          <button
            type="submit"
            onClick={handleFindRepositories}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </header>

      <main>
        <p>{user ? user.name + ' - ' + user?.repositories?.length + ' repositórios encontrados' : (searching ? 'Fazendo pesquisa...' : (notFound ? 'Usuário não encontrado!' : ''))}</p>
        <ul>
          {user?.repositories?.map((repository: Repository) => (
            <li key={repository.name}>
              <div data-testid="repository">
                <p>{repository.name} | {repository.stargazers_count} estrelas | {repository.commits} commits | {repository.language}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </section>
  )
}