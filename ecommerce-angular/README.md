# EcommerceAngular

Simple ecommerce demo built with Angular, using the public FakeStore API.

## Features / business logic

### Products

- Product catalog is loaded from `https://fakestoreapi.com/products`.
- Product details are loaded from `https://fakestoreapi.com/products/:id`.

### Cart

- Cart is client-side only.
- Cart items are persisted in `localStorage` under the key `cart_items`.
- Quantity updates:
	- quantity `<= 0` removes the item
	- otherwise quantity is updated and persisted

### Authentication

- Login calls `POST https://fakestoreapi.com/auth/login` with `{ username, password }`.
- On success, the app stores:
	- token in `localStorage` key `ecommerce.auth.token.v1`
	- username in `localStorage` key `ecommerce.auth.username.v1`
- Logout clears those values.

Important: this project does not attach the token to outgoing requests (there is no auth header interceptor). The token is used for client-side gating only.

### Admin access (demo only)

Admin pages are protected in the frontend by a hardcoded allowlist (not secure, can be spoofed by editing localStorage).

- Configure admin usernames in `src/environments/environment.ts`:

```ts
export const environment = {
	apiUrl: 'https://fakestoreapi.com',
	persistLocalMutations: true,
	adminUsernames: ['mor_2314'],
};
```

Rules:

- Not logged in → redirect to `/login?returnUrl=...`
- Logged in but not in `adminUsernames` → redirect to `/`

### Product mutations (local fallback)

FakeStore API is a public demo API. This project optionally keeps local "mutations" (created/updated/deleted products) so the Admin UI feels consistent.

- Controlled by `persistLocalMutations` in `src/environments/environment.ts`.
- When enabled, local mutations are stored in `localStorage` under `ecommerce.products.mutations.v1` and applied on top of the remote product list.

### Theme

- Light/Dark theme toggle.
- Theme is persisted in `localStorage` under `ecommerce.theme.v1`.

## Run locally

Prerequisites:

- Node.js + npm

Install dependencies:

```bash
cd ecommerce-angular
npm install
```

Start dev server:

```bash
npm start
```

Open:

- `http://localhost:4200/`

Useful URLs:

- Home: `/`
- Cart: `/cart`
- Login: `/login`
- Register: `/register`
- Admin: `/admin` (requires demo-admin user)

## Demo credentials

FakeStore provides demo users. This repo is configured with `adminUsernames: ['mor_2314']`, so you can use:

- username: `mor_2314`
- password: `83r5^_`

If you change `adminUsernames`, make sure you pick usernames that FakeStore accepts.

## Scripts

- `npm start` - run development server
- `npm run build` - production build
- `npm test` - run unit tests (Karma)
- `npm run watch` - build in watch mode

## Troubleshooting

- If login keeps failing, verify you have internet access and that `apiUrl` is set to `https://fakestoreapi.com`.
- If you get unexpected admin access, remember this is demo-only and uses client-side storage.
