<div align="center">
  <a href="https://discord.gg/4qcXbeVehZ">
    <img alt="Discord" src="https://img.shields.io/discord/882288646517035028?label=%F0%9F%92%AC%20discord">
  </a>
  <a href="https://github.com/durudex/durudex-web/blob/main/COPYING">
    <img alt="License" src="https://img.shields.io/github/license/durudex/durudex-web?label=%F0%9F%93%95%20license">
  </a>
  <a href="https://github.com/durudex/durudex-web/stargazers">
    <img alt="GitHub Stars" src="https://img.shields.io/github/stars/durudex/durudex-web?label=%E2%AD%90%20stars&logo=sdf">
  </a>
  <a href="https://github.com/durudex/durudex-web/network">
    <img alt="GitHub Forks" src="https://img.shields.io/github/forks/durudex/durudex-web?label=%F0%9F%93%81%20forks">
  </a>
</div>

<h1 align="center">⚡️ Durudex Web</h1>

## Modules

- [`app`](packages/app): SolidJS application
  - [`main`](packages/app/src/main.tsx): setup routing and render the application
  - [`api`](packages/app/api): GraphQL module
    - [`core`](packages/app/src/api/core.ts): URQL wrappers
    - [`common`](packages/app/src/api/common.ts): common queries and mutations
  - [`auth`](packages/app/src/auth): authentication module
    - [`shared`](packages/app/src/auth/shared.tsx): common auth components etc.
    - [`sign-in`](packages/app/src/auth/sign-in.tsx)
    - [`sign-up`](packages/app/src/auth/sign-up.tsx)
    - [`forgot-password`](packages/app/src/auth/forgot-password.tsx)
  - [`lazy-module`](packages/app/src/lazy-module): less strict SolidJS `lazy`
  - [`use`](packages/app/src/use): common hooks
  - [`props`](packages/app/src/props): functions and types for working with component props
  - [`notifications`](packages/app/src/notifications): notifications module
    - [`api`](packages/app/src/notifications/api.tsx): imperative APIs (`showNotification` etc.)
    - [`root`](packages/app/src/notifications/root.tsx): a component that renders notifications
  - [`assets`](packages/app/src/assets): static assets
  - [`styles`](packages/app/src/styles): common Sass styles
- [`flow`](packages/flow): SolidJS wrappers and re-exports. See more in readme 
- [`form`](packages/form): abstract reactive forms
  - [`validator`](packages/form/src/validator.ts): abstract validation
- [`test-api`](packages/test-api): start a server that proxies Durudex Test API and logs responses to the console

... work in progress ...

## ⚠️ License
Copyright © 2022 [Durudex](https://github.com/durudex). Released under the [GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html) license.
