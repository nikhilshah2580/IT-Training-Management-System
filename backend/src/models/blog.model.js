import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: [
        "Programming",
        "Web Development",
        "Data Science",
        "Cyber Security",
        "Graphic Design",
        "Career",
        "Technology",
        "Other",
      ],
      default: "Technology",
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

blogSchema.index({ title: "text", content: "text", tags: "text" });
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ createdAt: -1 });

export default mongoose.model("Blog", blogSchema);
