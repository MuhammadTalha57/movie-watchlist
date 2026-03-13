import {
    authenticateUserService,
    registerUserService,
} from "../services/auth.service.js";

export const registerUser = async (req, res) => {
    const user = await registerUserService(req.body);

    if (user) {
        res.status(201).json({
            success: true,
            data: user,
        });
    } else {
        res.status(400).json({
            success: false,
        });
    }
};

export const authenticateUser = async (req, res) => {
    const token = await authenticateUserService(req.body);

    if (token) {
        res.status(200).json({
            success: true,
            token: token,
        });
    } else {
        res.status(401).json({
            success: false,
        });
    }
};
