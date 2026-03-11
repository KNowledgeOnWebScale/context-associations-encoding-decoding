# Context Assocation Encoding/Decoding

- Make sure you have JAVA (^21) installed
- Make sure you have Jena-ARQ (^5) installed

All conversion algorithms are encoded in SPARQL queries.

## Installation

Here are straightforward steps to install Apache Jena and use the arq command-line tool in WSL2 (Ubuntu/Debian).

1. Install Java

```bash
sudo apt update
sudo apt install openjdk-21-jdk -y
```

Check:

```bash
java -version
```

2. Download Apache Jena

Go to your home directory and download it from the official source.

```bash
cd ~
wget https://archive.apache.org/dist/jena/binaries/apache-jena-5.6.0.tar.gz
```

(If this version changes, check the latest at Apache Jena.)

3. Extract Jena

```bash
tar -xzf apache-jena-5.6.0.tar.gz
```

You now have: `~/apache-jena-5.6.0`

4. Add Jena to your PATH

Edit `.bashrc`:

```bash
nano ~/.bashrc
```

Add this at the bottom:

```bash
export JENA_HOME="$HOME/apache-jena-6.0.0"
export PATH="$PATH:$JENA_HOME/bin"
```

Apply it:

```bash
source ~/.bashrc
```

5. Test arq

```bash
arq --version
```

You should see something like:

```
Apache Jena version 5.6.0
```

## Run it

```bash
cd conversion/
./run.sh
```

What you'll see is, that
the annotation method-specific contextual information and target data (from `1_annotation-method`) gets automatically encoded into Context Assocations (in `2_encoded`),
and then using a general SPARQL query (using ARQ extensions) back losslessly decoded (results in `3_decoded`).
