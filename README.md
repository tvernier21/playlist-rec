### Spotify song recommendation based on playlist similarity graph

Song similarity is based on a search query that creates a network graph between each song, increasing the edge weight between songs where they appear in the same playlist.
In the backend, I use the search query string and use the spotify api to return all relevant playlists (current limit = 10). For every song in every playlist, we create a frequency map and nxn table to represent the edge map (n = number of unique songs). 

#### Backend
Python with FastAPI and spotify api

#### FrontEnd
Nextjs, tailwind, shadcn, typescript
