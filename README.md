[![Build Status](https://travis-ci.org/pdericson/riemann-dashboard.svg?branch=master)](https://travis-ci.org/pdericson/riemann-dashboard)

# riemann-dashboard

Riemann Dashboard

## Getting Started

```
docker run -e LC_ALL=C.UTF-8 -e PORT=8000 -e RIEMANN_HOST=localhost -e RIEMANN_PORT=5555 -i --net host --rm -t debian:8 /bin/sh -c "\
apt-get update && \
apt-get install --no-install-recommends -y ca-certificates curl && \
curl -L https://github.com/pdericson/riemann-dashboard/releases/download/0.1.4/dashboard.tar.gz | tar xzf - -C /usr/local && \
dashboard foreground"
```

## Development

```
iex -S mix phx.server
```
