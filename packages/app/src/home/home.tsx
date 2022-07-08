import {Link} from 'solid-app-router'

export function Home() {
  return (
    <div class="home flex-center forward-height">
      <div class="typography brutal-container">
        <h1>Durudex web app</h1>
        <h2>Durudex web app</h2>
        <h3>Durudex web app</h3>
        <h4>Durudex web app</h4>
        <h5>Durudex web app</h5>
        <h6>Durudex web app</h6>
        <p>Sign in to an account or create one</p>
        <ul>
          <li>
            <Link href="/auth">Auth Page</Link>
          </li>
          <li>
            <Link href="/auth/sign-in">Sign In</Link>
          </li>
          <li>
            <Link href="/auth/sign-up">Sign Up</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
