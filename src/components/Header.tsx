import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import '../styles/header.scss'

export function Header() {
  return (
    <header className="header">
      <div className="left-header">
        <FontAwesomeIcon id="github-icon" icon={faGithub} spin />
        <span>
          <p>github.</p>
          <p>explorer</p>
        </span>
      </div>
      <div className="right-header">
        <p>Encontre seus Repositórios</p>
      </div>
    </header>
  )
}