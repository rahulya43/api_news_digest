import User from "../models/userModel.js";

const createUser = async (req, res) => {
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
const getUserById = async (req, res) => {
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

// UPDATE user profile
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User profile updated successfully",
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

export { createUser, getUserById, updateUser };
