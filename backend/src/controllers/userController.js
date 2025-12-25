import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { email, name, interests, keywords, delivery, digestTime } = req.body;

    if (!email || !interests || !keywords) {
      return res.status(400).json({
        success: false,
        message: "Email, interests and keywords are required"
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { name, interests, keywords, delivery, digestTime },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "User profile saved",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
