# My Scholarly Article

## Development mode
```
bundle install
bundle exec guard
```

If Guard file watching does not work (e.g. in WSL on `/mnt/c`), use rebuild-on-refresh instead:
```
NANOC_REBUILD_ON_REQUEST=1 bundle exec rackup -p 3000 -o 0.0.0.0
```
This rebuilds the site when you refresh a page in the browser and serves it on `http://localhost:3000/`.

## Build
```
bundle install
bundle exec nanoc compile
```

View on http://localhost:3000/

This article makes use of the [ScholarMarkdown](https://github.com/rubensworks/ScholarMarkdown/) framework.


## Paper
I copied the contents of `paper.md` paper into `content > 1_paper.md`