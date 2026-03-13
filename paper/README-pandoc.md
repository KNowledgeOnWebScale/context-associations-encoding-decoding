# LaTeX user template and guide

> Probably you want to do `source ./.venv/bin/activate`

Make sure `pandoc-include` is installed.

Build using the makefile: `make pandoc`

Just doing pandoc:

```shell
pandoc content/main.md --filter pandoc-include --template=template.tex --natbib -o main.tex
```