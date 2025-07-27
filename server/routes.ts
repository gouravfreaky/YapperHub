import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { type Post } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Fetch posts from JSONPlaceholder API
  app.get("/api/posts", async (req, res) => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      
      if (!response.ok) {
        return res.status(500).json({ 
          message: "Failed to fetch posts from external API",
          error: response.statusText 
        });
      }
      
      const posts: Post[] = await response.json();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ 
        message: "Internal server error while fetching posts",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get a specific post by ID
  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ message: "Post not found" });
        }
        return res.status(500).json({ 
          message: "Failed to fetch post from external API",
          error: response.statusText 
        });
      }
      
      const post: Post = await response.json();
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ 
        message: "Internal server error while fetching post",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Search posts with query parameter
  app.get("/api/posts/search/:query", async (req, res) => {
    try {
      const query = req.params.query.toLowerCase();
      
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      
      if (!response.ok) {
        return res.status(500).json({ 
          message: "Failed to fetch posts from external API",
          error: response.statusText 
        });
      }
      
      const posts: Post[] = await response.json();
      
      // Filter posts based on query in title or body
      const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.body.toLowerCase().includes(query)
      );
      
      res.json(filteredPosts);
    } catch (error) {
      console.error("Error searching posts:", error);
      res.status(500).json({ 
        message: "Internal server error while searching posts",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
