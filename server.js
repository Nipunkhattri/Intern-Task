const express = require("express");
const axios = require("axios");
const _ = require("lodash");
const app = express();
const port = 3000;

app.get("/api/blog-stats", async (req, res) => {
  try {
    const apirequest = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    const blogData = apirequest.data;

    const totalBlogs = blogData?.blogs?.length;

    const blogWithLongestTitle = _.maxBy(blogData?.blogs, "title.length");

    const blogsWithPrivacyTitle = _.filter(blogData?.blogs, (blog) =>
      _.includes(blog?.title?.toLowerCase(), "privacy")
    );

    const uniqueBlogTitles = _.uniqBy(blogData?.blogs, "title");

    const analyticsData = {
      totalBlogs,
      blogWithLongestTitle,
      numBlogsWithPrivacyTitle: blogsWithPrivacyTitle.length,
      uniqueBlogTitles,
    };
    res.json(analyticsData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching or processing blog data",
      });
  }
});

app.get("/api/blog-search", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is missing" });
    }

    const apirequest = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      }
    );

    const blogData = apirequest.data;

    const searchResults = blogData?.blogs?.filter((blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );

    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching or processing blog data",
      });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
