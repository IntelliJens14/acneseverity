import fs from "fs-extra";

const source = "public/models";
const destination = "dist/models";

async function copyModels() {
  try {
    if (!(await fs.pathExists(source))) {
      console.warn("⚠️ Warning: 'public/models' folder does not exist. Skipping copy.");
      return;
    }

    await fs.copy(source, destination);
    console.log("✅ Models copied successfully!");
  } catch (err) {
    console.error("❌ Error copying models:", err);
    process.exit(1); // Exit with an error code if it fails
  }
}

copyModels();
