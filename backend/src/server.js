import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { initDb } from "./config/db.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: config.clientUrl,
  })
);
app.use(express.json());
// Easebuzz posts its payment result as form data to our callback URL.
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

// Initialize Postgres DB
initDb();

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
