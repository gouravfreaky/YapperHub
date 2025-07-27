import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Database, User, TrendingUp, Clock, Activity, BarChart3, Calendar, RefreshCw, Users, AlertCircle, Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { type UserProfile } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsername, setSearchedUsername] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Fetch user data when searchedUsername is set
  const { data: userData, isLoading, error, refetch } = useQuery<UserProfile>({
    queryKey: ["/api/user", searchedUsername],
    enabled: !!searchedUsername,
    refetchOnWindowFocus: false,
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const username = searchQuery.trim();
      setSearchedUsername(username);
      
      // Add to search history (avoid duplicates)
      setSearchHistory(prev => {
        const filtered = prev.filter(item => item !== username);
        return [username, ...filtered].slice(0, 5); // Keep only last 5 searches
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchedUsername("");
  };

  const formatYapsValue = (value: string) => {
    const num = parseFloat(value);
    if (num === 0) return "0";
    if (num < 1) return num.toFixed(4);
    if (num < 1000) return num.toFixed(2);
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  const getTimeLabel = (period: string) => {
    switch (period) {
      case 'yaps_l24h': return 'Last 24 Hours';
      case 'yaps_l48h': return 'Last 48 Hours';
      case 'yaps_l7d': return 'Last 7 Days';
      case 'yaps_l30d': return 'Last 30 Days';
      case 'yaps_l3m': return 'Last 3 Months';
      case 'yaps_l6m': return 'Last 6 Months';
      case 'yaps_l12m': return 'Last 12 Months';
      case 'yaps_all': return 'All Time';
      default: return period;
    }
  };

  const getIcon = (period: string) => {
    switch (period) {
      case 'yaps_l24h':
      case 'yaps_l48h':
        return <Clock className="h-5 w-5" />;
      case 'yaps_l7d':
      case 'yaps_l30d':
        return <Calendar className="h-5 w-5" />;
      case 'yaps_l3m':
      case 'yaps_l6m':
      case 'yaps_l12m':
        return <TrendingUp className="h-5 w-5" />;
      case 'yaps_all':
        return <BarChart3 className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen font-inter">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 shadow-material border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-700 dark:text-neutral-200">YapperHub</h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Search for user profiles and activity data</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center">
                <span className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                  <Database className="mr-1" size={16} />
                  Kaito AI API
                </span>
              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-700 dark:text-neutral-200 mb-3">Search User Profiles</h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            Enter a username to view their activity statistics and engagement metrics from the Kaito platform.
          </p>
        </div>

        {/* Modern Search Input */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative group">
            {/* Gradient background for modern effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity duration-300"></div>
            
            <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200/60 dark:border-neutral-600/60 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="absolute left-5 flex items-center pointer-events-none">
                  <div className="flex items-center space-x-2">
                    <Search className="text-neutral-400 dark:text-neutral-500" size={22} />
                    <div className="hidden sm:block w-px h-6 bg-neutral-300 dark:bg-neutral-600"></div>
                  </div>
                </div>
                
                <Input
                  type="text"
                  placeholder="Search for any username on Kaito..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-16 sm:pl-20 pr-40 py-6 text-lg bg-transparent border-0 rounded-2xl focus:ring-0 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100 font-medium"
                />
                
                <div className="absolute right-3 flex items-center space-x-2">
                  {isLoading && (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="animate-spin text-primary" size={18} />
                      <span className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">Searching...</span>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isLoading}
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                  >
                    <Sparkles size={16} />
                    <span>Search</span>
                  </Button>
                </div>
              </div>
              
              {/* Search suggestions when focused */}
              {searchQuery.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-600 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 z-10">
                  <div className="p-4">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">Try searching for:</p>
                    <div className="flex flex-wrap gap-2">
                      {["VitalikButerin", "elonmusk", "naval", "balajis"].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setSearchedUsername(suggestion);
                          }}
                          className="px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Recent searches:</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((username, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  onClick={() => {
                    setSearchQuery(username);
                    setSearchedUsername(username);
                  }}
                >
                  {username}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Results Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <Card className="bg-white dark:bg-neutral-800 shadow-material">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500 dark:text-red-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200 mb-2">User not found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              We couldn't find a user with the username "{searchedUsername}". Please check the spelling and try again.
            </p>
            <Button onClick={clearSearch} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Search className="mr-2" size={16} />
              Try Another Search
            </Button>
          </div>
        )}

        {/* User Data */}
        {userData && !isLoading && !error && (
          <div className="space-y-6">
            {/* User Header */}
            <Card className="bg-white dark:bg-neutral-800 shadow-material">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-neutral-700 dark:text-neutral-200">{userData.username}</CardTitle>
                    <p className="text-neutral-500 dark:text-neutral-400">User ID: {userData.user_id}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Activity Metrics */}
            <Card className="bg-white dark:bg-neutral-800 shadow-material">
              <CardHeader>
                <CardTitle className="text-xl text-neutral-700 dark:text-neutral-200 flex items-center">
                  <Activity className="mr-2" size={20} />
                  Activity Metrics (YAPS)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(userData)
                    .filter(([key]) => key.startsWith('yaps_'))
                    .map(([key, value]) => (
                      <div key={key} className="p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">{getTimeLabel(key)}</span>
                          {getIcon(key)}
                        </div>
                        <div className="text-2xl font-bold text-neutral-700 dark:text-neutral-200">
                          {formatYapsValue(value)}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-blue-600/10 dark:from-primary/20 dark:to-blue-600/20 shadow-material">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
                    Activity Summary
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    <span className="font-bold">{userData.username}</span> has accumulated{" "}
                    <span className="font-bold text-primary">{formatYapsValue(userData.yaps_all)}</span>{" "}
                    total YAPS, with{" "}
                    <span className="font-bold">{formatYapsValue(userData.yaps_l30d)}</span>{" "}
                    YAPS in the last 30 days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Welcome State */}
        {!searchedUsername && !isLoading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-neutral-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200 mb-2">Search for a User</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              Enter a username in the search box above to view their activity statistics and engagement metrics.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                onClick={() => {
                  setSearchQuery("VitalikButerin");
                  setSearchedUsername("VitalikButerin");
                }}
              >
                Try: VitalikButerin
              </Badge>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}