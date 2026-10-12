# Adding your work to gragg.life

Every creator gets their own folder and a card on the home page. You only edit your own folder, plus one entry in `creators.json`.

## 1. Get access
Ask the site owner to add your GitHub username as a collaborator on this repo.

## 2. Make your folder
Copy `_template/` to a new folder named after you or your project, all lowercase with dashes:

```
my-project/
  index.html   ← your page (starts from the template)
  img/         ← your images
```

Your page will be live at `https://www.gragg.life/my-project/`.

## 3. Use the shared look
The template already links `/shared/site.css`, which gives you the header, colours, fonts, cards and tables. Change the accent colour for your page with one line:

```css
:root{ --accent:#5cc8f0; }
```

## 4. Add your card to the home page
Add yourself (or just a new project) to `creators.json`:

```json
{
  "id": "your-name",
  "name": "Your Name",
  "role": "What you make",
  "projects": [
    { "title": "My Project", "url": "/my-project/", "summary": "One sentence.", "tags": ["Game"], "image": "/my-project/img/cover.png" }
  ]
}
```

## 5. Publish
- Small change: commit to `main` and it is live in about a minute.
- Bigger change: open a pull request so someone can check it first.

## Rules
- **The repo is public.** Never commit passwords, API keys, tokens, or anyone's private info.
- **Only use images and text you have the right to use.** Credit sources. Fan-wiki text is CC BY-SA: link the page you used.
- Stay inside your own folder unless you have agreed a shared change (`shared/`, `index.html`, `CNAME`).
- Do not touch `CNAME`; it keeps the domain working.
