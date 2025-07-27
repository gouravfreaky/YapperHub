import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { type UserProfile } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Fetch user profile from Kaito AI API
  app.get("/api/user/:username", async (req, res) => {
    try {
      const username = req.params.username;
      
      if (!username || username.trim() === "") {
        return res.status(400).json({ message: "Username is required" });
      }

      const response = await fetch(`https://api.kaito.ai/api/v1/yaps?username=${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(500).json({ 
          message: "Failed to fetch user data from Kaito AI API",
          error: response.statusText 
        });
      }
      
      const userData: UserProfile = await response.json();
      res.json(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ 
        message: "Internal server error while fetching user data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Search multiple users (for future enhancement)
  app.get("/api/users/search", async (req, res) => {
    try {
      const usernames = req.query.usernames as string;
      
      if (!usernames) {
        return res.status(400).json({ message: "Usernames parameter is required" });
      }

      const usernameList = usernames.split(",").map(u => u.trim()).filter(u => u);
      const userProfiles = [];

      for (const username of usernameList) {
        try {
          const response = await fetch(`https://api.kaito.ai/api/v1/yaps?username=${encodeURIComponent(username)}`);
          if (response.ok) {
            const userData = await response.json();
            userProfiles.push(userData);
          }
        } catch (error) {
          console.error(`Error fetching data for user ${username}:`, error);
          // Continue with other users even if one fails
        }
      }
      
      res.json(userProfiles);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ 
        message: "Internal server error while searching users",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
