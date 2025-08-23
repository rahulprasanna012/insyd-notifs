const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDb = require("./config/db");
const userRoutes = require("./routes/user.routes");
const healthRoutes = require("./routes/health.routes");
const eventRoutes = require("./routes/events.routes");
const notifRoutes = require("./routes/notif.routes");

require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/users", userRoutes);
app.use(healthRoutes);
app.use("/events", eventRoutes);
app.use("/notifications", notifRoutes);

const PORT = process.env.PORT || 5000;
connectDb().then(() => {
  app.listen(PORT,"0.0.0.0", () => console.log(`Server Running on :${PORT}`));
});
