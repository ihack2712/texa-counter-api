# Texa Counter API

This is a simple server built on Deno and Texa to store the amount of visitors a key has.

## Visitor Count

For normal visitor count you can send a get request to `/v/:key([a-z0-9]{1,64})`, where `:key` is the key you wish to visit. Every time this endpoint is visited the key will increment.

## Unique Visitor Count (IP Based)

For unique visitor count you can send a get request to `/u/:key([a-z0-9]{1,64})`, where `:key` is the key you wish to visit. Every time a new IP visits the key will increment.

The IP is then hashed and stored as a file to prevent the IP from incrementing the value again.

## Running the server.

```sh
deno run --allow-env --allow-net --allow-read=. --allow-write=. https://raw.githubusercontent.com/ihack2712/texa-counter-api/master/server.ts
```

If you wish to use a different port you can use a PORT environment variable, or you can change the host and port by adding an argument to the run command:

```sh
deno run \
	--allow-net \
	--allow-env \
	--allow-read=. \
	--allow-write=. \
	https://raw.githubusercontent.com/ihack2712/texa-counter-api/master/server.ts \
	0.0.0.0:3000
```
