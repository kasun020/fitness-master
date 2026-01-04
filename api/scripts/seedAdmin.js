import dotenv from "dotenv";
import mongoose from "mongoose";
import Signup from "../models/signupSchema.js";

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return String(value).trim();
}

async function main() {
  const mongoUrl = requireEnv("MONGO_URL");
  const adminEmail = requireEnv("ADMIN_EMAIL");
  const adminPassword = requireEnv("ADMIN_PASSWORD");

  const updatePassword =
    String(process.env.SEED_ADMIN_UPDATE_PASSWORD || "false").toLowerCase() ===
    "true";

  await mongoose.connect(mongoUrl);

  const existing = await Signup.findOne({ email: adminEmail });

  if (!existing) {
    const adminUser = new Signup({
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    adminUser.confirmPassword = adminPassword;

    await adminUser.save();

    console.log(`[seed:admin] created admin user email=${adminEmail}`);
    return;
  }

  let changed = false;

  if (existing.role !== "admin") {
    existing.role = "admin";
    changed = true;
  }

  if (updatePassword) {
    existing.password = adminPassword;
    existing.confirmPassword = adminPassword;
    changed = true;
  }

  if (changed) {
    await existing.save();
    console.log(
      `[seed:admin] updated user email=${adminEmail} role=admin$${
        updatePassword ? " password=updated" : ""
      }`.replace("$", "")
    );
  } else {
    console.log(`[seed:admin] admin user already exists email=${adminEmail}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[seed:admin] failed", err);
    process.exit(1);
  });
