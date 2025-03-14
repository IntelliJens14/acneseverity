import fs from "fs-extra";

const source = "public/models";
const destination = "dist/models";

// Ensure the source directory exists
if (fs.existsSync(source)) {
  fs.copy(source, destination)
    .then(() => console.log("✅ Models copied successfully!"))
    .catch((err) => console.error("❌ Error copying models:", err));
} else {
  console.warn("⚠️ Source models directory does not exist. Skipping copy.");
}
