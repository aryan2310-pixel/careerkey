import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: node --env-file=.env.local scripts/create-admin.mjs "Name" email password');
  process.exit(1);
}
if (password.length < 10) {
  console.error("Use a password of at least 10 characters.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
const admins = mongoose.connection.collection("admins");
const cleanEmail = email.toLowerCase().trim();

if (await admins.findOne({ email: cleanEmail })) {
  console.error("An admin with that email already exists.");
  process.exit(1);
}

const now = new Date();
await admins.insertOne({
  name,
  email: cleanEmail,
  passwordHash: await bcrypt.hash(password, 12),
  role: "admin",
  createdAt: now,
  updatedAt: now,
});

console.log(`Admin created: ${cleanEmail}`);
await mongoose.disconnect();