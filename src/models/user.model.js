import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'user'], default: 'user' }
},
    {
        versionKey: false,
        timestamps: true,
    }
);

// code for hashing password before save
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// code for comparing password
UserSchema.methods.comparePassword = function (plainPwd) {
    return bcrypt.compare(plainPwd, this.password);
};

export default mongoose.model("User", UserSchema);