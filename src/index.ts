import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import db from "./database/db";
import fs from 'fs';
import path from 'path'

dotenv.config();

const routesPath = path.join(__dirname, 'routes');



db.raw('SELECT 1 AS result')
  .then(() => {
    console.log('DB connected successfully');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

const PORT = process.env.PORT || 5000;
const RATE_TIME_LIMIT = Number(process.env.RATE_TIME_LIMIT) || 15;
const RATE_REQUEST_LIMIT = Number(process.env.RATE_REQUEST_LIMIT) || 100;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-urlencoded


app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// app.use(
//   rateLimit({
//     windowMs: RATE_TIME_LIMIT * 60 * 1000,
//     max: RATE_REQUEST_LIMIT,
//   }),
// );



const staticPath = path.resolve(__dirname, "assets/movies");
app.use("/assets/movie", express.static(staticPath));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

// Security Headers
app.use(helmet());
app.use(hpp());


try {
  if (!fs.existsSync(routesPath)) {
    console.warn(`!! WARNING !!: Routes directory not found at ${routesPath}`);
    process.exit(1);
  }

  const filenames: string[] = fs.readdirSync(routesPath);

  if (!filenames.length) {
    console.warn("!! NOTE !!: No route files found in the routes directory.");
  } else {
    console.log(`Found ${filenames.length} route files to load...`);
  }

filenames.forEach((file: string) => {
  if (!file.match(/\.(js|ts)$/)) return;

  try {
    const routePath = path.join(routesPath, file);
    console.log(`Loading route: ${routePath}`);

    const routeModule = require(routePath);
    const route = routeModule.default || routeModule; // Fix for ES module default export

    app.use('/api/', route);
  } catch (err) {
    console.error(`Error loading route file ${file}:`, err);
  }
});


} catch (err) {
  if (err instanceof Error) {
    console.error(`ERROR FETCHING ROUTES: ${err.message}`);
    process.exit(1);
  } else {
    console.error('ERROR FETCHING ROUTES: Unknown error occurred');
    process.exit(1);
  }
}

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


// Listen to specified port in .env or default 5000
app.listen(PORT, () => {
  console.log(`Server is listening on: ${PORT}`);
});
