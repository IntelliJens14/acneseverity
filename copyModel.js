import fs from "fs-extra";
import path from "path";

const source = path.join(__dirname, "public/models"); // Use absolute path
const destination = path.join(__dirname, "dist/models"); // Use absolute path

// Ensure the source directory exists
if (fs.existsSync(source)) {
  fs.ensureDir(destination) // Ensure the destination directory exists
    .then(() => fs.copy(source, destination))
    .then(() => console.log("✅ Models copied successfully!"))
    .catch((err) => console.error("❌ Error copying models:", err));
} else {
  console.warn("⚠️ Source models directory does not exist. Skipping copy.");
}
