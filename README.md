# Events App

---

### Commands to setup (backend):

```bash
cd backend
cp .env.example .env
# configure .env
npm install
npm run db:sync
cd ..
```

__Don't forgot to put events xml file into ./backend/data/export.xml__

### Commands to setup (frontend):

```bash
cd frotnend
cp .env.example .env
# configure .env
npm install
cd ..
```


### Commands to start (concurrently):
```bash
npm start
```
