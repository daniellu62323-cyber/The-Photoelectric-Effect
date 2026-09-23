# worker/ — deployment spike

**This is not the quiz backend.** It is the smallest thing that answers one
question, before anything gets built on top of it:

> Can a SQLite-backed Durable Object be deployed to this Cloudflare account
> through Workers Builds, with no Node installed locally, and can a browser
> open a WebSocket to it?

If the answer is no, the design changes — we fall back to Firebase — and that
has to be decided **before** `quiz.html` is written against a transport that may
not exist. See `BACKEND_STRUCTURE.md` §7, item 1.

---

## What to do (Cloudflare dashboard, ~10 minutes)

Nothing is installed locally. Cloudflare runs Wrangler in its own CI.

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository**.
2. Pick `daniellu62323-cyber/The-Photoelectric-Effect`, branch **`quiz-and-presentation`**.
3. Set the build settings:
   - **Root directory:** `worker`
   - **Deploy command:** `npx wrangler deploy`
   - **Build command:** leave empty
4. Deploy.

### Two things to get right

- The deploy command must be **`wrangler deploy`**. It must *not* be
  `wrangler versions upload` — creating a Durable Object class has to go
  through a real deploy.
- **No preview URL will appear.** Cloudflare does not generate preview URLs for
  Workers with Durable Objects. That is expected; use the `workers.dev` address.

---

## How to tell whether it worked

You get an address like `https://photoelectric-quiz.<something>.workers.dev`.

**1. The Worker is up** — open that address in a browser. It should print:

```
photoelectric spike: ok
```

**2. The Durable Object is reachable** — open `<address>/ws` in a browser. It
should print:

```
Room is alive. Open a WebSocket to /ws to talk to it.
```

Getting this far is the part that proves the free plan allows SQLite-backed
Durable Objects on this account.

**3. WebSockets work** — open that address, then the browser console, and paste:

```js
const ws = new WebSocket(location.origin.replace('http', 'ws') + '/ws');
ws.onmessage = e => console.log('got:', e.data);
ws.onopen = () => ws.send('hello');
```

It should log something like:

```
got: {"type":"echo","received":"hello","at":1770000000000}
```

If all three pass, the design in `BACKEND_STRUCTURE.md` holds and the real
backend can be built on it. **Send me the `workers.dev` address either way.**

---

## If it fails

Note *which* of the three steps failed and what the error said. The likely ones:

- **Deploy rejected over the Durable Object migration** — usually
  `new_classes` being used instead of `new_sqlite_classes`. This config already
  uses the SQLite form, which the free plan requires.
- **Build cannot find the config** — the root directory is not set to `worker`.
- **Deploy succeeds but `/ws` errors** — the binding name or class name does not
  match between `wrangler.jsonc` and `src/index.js`.

Any of these and we reconsider; Firebase is the recorded fallback and costs the
phone page about 40–50 KB instead.
