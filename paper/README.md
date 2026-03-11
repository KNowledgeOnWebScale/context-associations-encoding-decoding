# Context Associations: an Application-Independent Annotation Method for RDF Knowledge Graphs

This article uses the [ScholarMarkdown](https://github.com/rubensworks/ScholarMarkdown/) framework.

## Prerequisites

- Ruby (matching `.ruby-version`)
- Bundler (`gem install bundler`)

## Minimal build

```bash
bundle install
bundle exec nanoc compile
```

This writes the static site to `output/`.

## Local preview

Serve and rebuild on refresh:

```bash
NANOC_REBUILD_ON_REQUEST=1 bundle exec rackup -p 3000 -o 0.0.0.0
```

Open: `http://localhost:3000/`

> If Guard file watching does not work (e.g. in WSL on `/mnt/c`), use local preview

## Development mode

```bash
bundle install
bundle exec guard
```

Note: `bundle exec nanoc compile` only compiles static output; it does not start a web server by itself.
