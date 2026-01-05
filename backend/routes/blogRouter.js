import express from "express";
import {
  createBlog,
  getBlog,
  getBlogs,
  likeBlog,
} from "../controllers/blogController.js";
import userAuth from "../middleware/userAuth.js";

const blogRouter = express.Router();

blogRouter.route("/create-blog").post(userAuth, createBlog);
blogRouter.route("/data").get(getBlogs);
blogRouter.route("/:blogId").get(getBlog);
blogRouter.route("/like/:blogId").post(userAuth, likeBlog);

export default blogRouter;
