# Fibre Planner

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### Docker build

```bash
docker build -t draft__fibre_planner .
```

### Docker run

```bash
docker run --restart=always --name=draft__fibre_planner -dp 3008:80 draft__fibre_planner
```
