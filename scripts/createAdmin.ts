import { createAdmin } from "../lib/createAdmin";

createAdmin()
  .then(() => {
    console.log("Admin initialized successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
