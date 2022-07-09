import yaml
import sys

def main():
  if len(sys.argv) < 2:
    print("Specify input filename")

  with open(sys.argv[1]) as f:
    yaml.load(f)

if __name__ == "__main__":
  main()