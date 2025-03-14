import fs from "fs-extra";

const source = "public/models";
const destination = "dist/models";

fs.copy(source, destination)
  .then(() => console.log("✅ Models copied successfully!"))
  .catch(err => console.error("❌ Error copying models:", err));

