# CAS Development — CMS (Decap)

The site uses **[Decap CMS](https://decapcms.org/)** (formerly Netlify CMS) for content editing without code.

URL: **https://cas.swiss/admin/**

## Setup — GitHub OAuth (one-time)

Decap CMS authenticates via GitHub OAuth. Two options:

### Option A — Netlify Identity proxy (recommended, free)

The simplest setup. No backend needed.

1. Sign in to https://app.netlify.com/ (free, GitHub login).
2. Create a new site connected to **this repo** (you don't have to actually deploy from Netlify — only the OAuth proxy is used).
3. In Site settings → **Identity** → enable Identity service.
4. In Identity → **Registration preferences** → **Invite only**.
5. Invite yourself (`mustafa@cas-development.com`) — you'll get an invite email.
6. In Identity → **External providers** → enable GitHub provider, configure with a GitHub OAuth app (see Option B for OAuth app creation).
7. In Site settings → **Identity** → **Services** → enable **Git Gateway**.
8. Done — visit https://cas.swiss/admin/ and login with GitHub.

### Option B — Custom GitHub OAuth (full control)

1. Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Application name: `CAS Development CMS`
   - Homepage URL: `https://cas.swiss`
   - Authorization callback URL: `https://api.netlify.com/auth/done` (or your own OAuth proxy)
2. Note the **Client ID** and generate a **Client Secret**.
3. Use Netlify's free OAuth proxy by linking the GitHub app via Netlify Identity (see Option A from step 6).
4. Or self-host an OAuth proxy (more complex — see https://decapcms.org/docs/external-oauth-clients/).

## Content structure

| Folder | Purpose |
|--------|---------|
| `content/news/` | News articles (Markdown with YAML frontmatter) |
| `content/settings/` | Site-wide settings |
| `assets/images/news/` | News article images (uploaded via CMS) |

## How publication works

1. You write/edit an article in the CMS.
2. CMS commits to GitHub `main` branch (via OAuth on your behalf).
3. GitHub Pages auto-rebuilds the site (~1 min).
4. Article appears on https://cas.swiss/news.html.

**Note:** Currently `news.html` lists articles statically. To dynamically render articles from `content/news/*.md`, a build step is required (see the rendering section below).

## Rendering markdown to news.html (manual for now)

Without a static-site generator, news articles in `content/news/` need to be manually transcribed into `news.html`. To automate this, two options:

1. **Eleventy or Jekyll** — static-site generator that reads markdown and outputs HTML
2. **Custom build script** — Python/Node script that injects markdown content into news.html template

For simplicity, the current setup uses Decap CMS only as a **storage UI**. Display rendering is to be added in a future sprint (D.1+).

## Trouble?

- CMS not loading → check browser console for errors
- Login fails → verify Netlify Identity invite was accepted, GitHub OAuth app credentials match
- Commits don't appear → check repo permissions, branch protection rules
