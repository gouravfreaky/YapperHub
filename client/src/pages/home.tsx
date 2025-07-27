import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Database, User, Hash, Eye, Heart, ArrowRight, Bookmark, Filter, Download, List, Grid3X3, Clock, ListFilter, RefreshCw } from "lucide-react";
import { type Post } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(12);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch posts
  const { data: posts = [], isLoading, error, refetch } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    refetchOnWindowFocus: false,
  });

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Apply search filter
    if (debouncedQuery) {
      filtered = posts.filter(post =>
        post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date":
        case "id":
          return b.id - a.id;
        case "title":
          return a.title.localeCompare(b.title);
        case "relevance":
        default:
          if (debouncedQuery) {
            const aRelevance = (a.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ? 2 : 0) +
                              (a.body.toLowerCase().includes(debouncedQuery.toLowerCase()) ? 1 : 0);
            const bRelevance = (b.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ? 2 : 0) +
                              (b.body.toLowerCase().includes(debouncedQuery.toLowerCase()) ? 1 : 0);
            return bRelevance - aRelevance;
          }
          return b.id - a.id;
      }
    });

    return sorted;
  }, [posts, debouncedQuery, sortBy]);

  // Pagination
  const totalResults = filteredAndSortedPosts.length;
  const totalPages = Math.ceil(totalResults / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredAndSortedPosts.slice(startIndex, endIndex);

  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(postId)) {
        newBookmarks.delete(postId);
      } else {
        newBookmarks.add(postId);
      }
      return newBookmarks;
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(filteredAndSortedPosts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'posts-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-neutral-50 min-h-screen font-inter">
      {/* Header */}
      <header className="bg-white shadow-material border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Search className="text-white text-lg" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-700">DataSearch Pro</h1>
                <p className="text-sm text-neutral-500">Explore API data with ease</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-neutral-500 flex items-center">
                <Database className="mr-1" size={16} />
                JSONPlaceholder API
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-700 mb-3">Discover Posts & Content</h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            Search through a comprehensive database of posts, articles, and content using our powerful search engine.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-neutral-500" size={20} />
            </div>
            <Input
              type="text"
              placeholder="Search posts by title, content, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-lg border border-neutral-200 rounded-xl shadow-material focus:shadow-material-focus focus:ring-0 focus:border-primary transition-all duration-200 bg-white"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              {isLoading && debouncedQuery && (
                <RefreshCw className="animate-spin text-primary" size={20} />
              )}
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 h-auto"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-neutral-500">
          <div className="flex items-center">
            <ListFilter className="mr-2" size={16} />
            <span>{totalResults} results found</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2" size={16} />
            <span>Search completed in 0.23s</span>
          </div>
          <div className="flex items-center">
            <Filter className="mr-2" size={16} />
            <span>{debouncedQuery ? "Search filter applied" : "No filters applied"}</span>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-material">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Sort by Relevance</SelectItem>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="id">Sort by ID</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded text-sm ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                <Grid3X3 className="mr-1" size={16} /> Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded text-sm ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                <List className="mr-1" size={16} /> List
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Results per page */}
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span>Show:</span>
              <Select value={postsPerPage.toString()} onValueChange={(value) => setPostsPerPage(parseInt(value))}>
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export button */}
            <Button
              variant="outline"
              size="sm"
              onClick={exportResults}
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Loading State */}
        {isLoading && (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="bg-white shadow-material">
                <CardContent className="p-6">
                  <Skeleton className="h-4 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">Unable to load data</h3>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">
              We're having trouble connecting to the API. Please check your connection and try again.
            </p>
            <Button onClick={() => refetch()} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCw className="mr-2" size={16} />
              Try Again
            </Button>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && !error && totalResults === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-neutral-400 text-2xl" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">No results found</h3>
            <p className="text-neutral-500 mb-6 max-w-md mx-auto">
              We couldn't find any posts matching your search. Try different keywords or adjust your filters.
            </p>
            <Button onClick={clearSearch} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="mr-2" size={16} />
              Clear Filters
            </Button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && totalResults > 0 && (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {paginatedPosts.map((post) => (
              <Card key={post.id} className="bg-white shadow-material hover:shadow-material-hover transition-all duration-200 group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-700 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-sm text-neutral-500 mb-3">
                        <User className="mr-1" size={14} />
                        <span>User {post.userId}</span>
                        <span className="mx-2">•</span>
                        <Hash className="mr-1" size={14} />
                        <span>Post #{post.id}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(post.id)}
                      className={`transition-colors p-1 h-auto ${bookmarkedPosts.has(post.id) ? "text-accent" : "text-neutral-400 hover:text-accent"}`}
                    >
                      <Bookmark className={bookmarkedPosts.has(post.id) ? "fill-current" : ""} size={16} />
                    </Button>
                  </div>
                  
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.body}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-neutral-500">
                      <span className="flex items-center">
                        <Eye className="mr-1" size={14} />
                        <span>{Math.floor(Math.random() * 500) + 50}</span>
                      </span>
                      <span className="flex items-center">
                        <Heart className="mr-1" size={14} />
                        <span>{Math.floor(Math.random() * 50) + 5}</span>
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700 font-medium text-sm transition-colors p-0 h-auto">
                      Read More <ArrowRight className="ml-1" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Pagination */}
      {!isLoading && !error && totalResults > 0 && totalPages > 1 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-material">
            <div className="text-sm text-neutral-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, totalResults)}</span> of <span className="font-medium">{totalResults}</span> results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left mr-1"></i>
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 text-sm rounded-lg ${currentPage === pageNum ? "bg-primary text-white" : "border border-neutral-200 hover:bg-neutral-50"}`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="px-2 text-neutral-400">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <i className="fas fa-chevron-right ml-1"></i>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-neutral-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="text-white text-sm" size={16} />
                </div>
                <span className="text-lg font-semibold">DataSearch Pro</span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Advanced search and data exploration platform powered by modern APIs and intelligent filtering.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-neutral-300">
                <li><i className="fas fa-check text-secondary mr-2"></i>Real-time search</li>
                <li><i className="fas fa-check text-secondary mr-2"></i>Advanced filtering</li>
                <li><i className="fas fa-check text-secondary mr-2"></i>Data export</li>
                <li><i className="fas fa-check text-secondary mr-2"></i>Mobile responsive</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">API Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                  <span className="text-neutral-300">JSONPlaceholder API: Online</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                  <span className="text-neutral-300">Search Engine: Optimized</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                  <span className="text-neutral-300">Response Time: ~230ms</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-600 mt-8 pt-6 text-center text-sm text-neutral-400">
            <p>&copy; 2024 DataSearch Pro. Built with modern web technologies and best practices.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
