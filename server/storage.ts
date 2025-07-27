import { type User, type InsertUser, type Post } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  createPost(post: Omit<Post, 'id'>): Promise<Post>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private posts: Map<number, Post>;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values());
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    const id = this.posts.size + 1;
    const newPost: Post = { ...post, id };
    this.posts.set(id, newPost);
    return newPost;
  }
}

export const storage = new MemStorage();
