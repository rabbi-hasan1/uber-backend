import app from "./src/app.js";
import connectDB from "./src/db/connectDB.js";
const PORT = process.env.PORT || 5001;
connectDB();
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
