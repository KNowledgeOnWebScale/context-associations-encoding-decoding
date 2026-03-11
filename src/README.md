# Context Assocation Demonstrator

- Make sure you have JAVA (^21) installed
- Make sure you have Jena-ARQ installed

## Installing JAVA/Jena-ARQ

Here are straightforward steps to install Apache Jena and use the arq command-line tool in WSL2 (Ubuntu/Debian).

1. Install Java

Apache Jena requires Java.

sudo apt update
sudo apt install openjdk-21-jdk -y

Check:

java -version
2. Download Apache Jena

Go to your home directory and download it from the official source.

cd ~
wget https://dlcdn.apache.org/jena/binaries/apache-jena-6.0.0.tar.gz

(If this version changes, check the latest at Apache Jena.)

3. Extract Jena
tar -xzf apache-jena-6.0.0.tar.gz

You now have:

~/apache-jena-6.0.0
4. Add Jena to your PATH

Edit .bashrc:

nano ~/.bashrc

Add this at the bottom:

export JENA_HOME="$HOME/apache-jena-6.0.0"
export PATH="$PATH:$JENA_HOME/bin"

Apply it:

source ~/.bashrc
5. Test arq
arq --version

You should see something like:

Apache Jena ARQ

