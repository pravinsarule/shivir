import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
  })
);
app.use(express.json());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
