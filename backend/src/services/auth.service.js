import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const registerUserService = async (data) => {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });

        const token = generateToken(user);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const authenticateUserService = async (data) => {
    try {
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password,
        );

        if (!isPasswordValid) {
            return null;
        }

        const token = generateToken(user);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
};
