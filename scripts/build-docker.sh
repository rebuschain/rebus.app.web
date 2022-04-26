#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

docker build --tag rebus/frontend -f "$DIR"/../deploy/Dockerfile "$DIR"/..
