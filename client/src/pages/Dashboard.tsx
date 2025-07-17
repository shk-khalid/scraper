import React, { useState, useEffect, useRef } from 'react';
import { Search, X, AlertCircle, CheckCircle, Loader2, Globe, Code, Copy, ExternalLink, RefreshCw, BookOpen, Sparkles, LogOut, Database } from 'lucide-react';
import { scrape } from '@/services/scrapeService';

interface Alert {
  id: string;
  type: 'error' | 'info' | 'success';
  message: string;
}

interface ScrapedResult {
  id: string;
  text: string;
  index: number;
  isNew?: boolean;
}

const Dashboard: React.FC = () => {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [results, setResults] = useState<ScrapedResult[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [searchFilter, setSearchFilter] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [hoveredResult, setHoveredResult] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    alerts.forEach(alert => {
      setTimeout(() => {
        dismissAlert(alert.id);
      }, 5000);
    });
  }, [alerts]);

  // Animate new results
  useEffect(() => {
    if (results.length > 0) {
      const timer = setTimeout(() => {
        setResults(prev => prev.map(result => ({ ...result, isNew: false })));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [results]);

  const addAlert = (type: Alert['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts(prev => [...prev, { id, type, message }]);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      addAlert('success', 'Text copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      addAlert('error', 'Failed to copy text');
    }
  };

  const toggleCardExpansion = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearResults = () => {
    setResults([]);
    setSearchFilter('');
    setExpandedCards(new Set());
    addAlert('info', 'Results cleared');
  };

  const refreshData = () => {
    if (url && selector) {
      setAnimationKey(prev => prev + 1);
      handleFetchData();
    }
  };

  const handleLogout = () => {
    // Clear any stored auth tokens or session data
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = '/login';
  };

  const handleFetchData = async () => {
    if (!url.trim() || !selector.trim()) {
      addAlert('error', 'Please provide both URL and CSS selector');
      return;
    }

    setIsLoading(true);
    setResults([]);
    setShowSuggestions(false);

    try {
      const { response, error } = await scrape(url.trim(), selector.trim());

      if (error) {
        addAlert('error', error.message);
        return;
      }

      if (response?.data) {
        // Update user email if provided
        if (response.user_email) {
          setUserEmail(response.user_email);
        }

        const formattedResults = response.data.map((text: string, index: number) => ({
          id: `result-${index}-${Date.now()}`,
          text,
          index,
          isNew: true
        }));
        setResults(formattedResults);
        addAlert('success', response.message || `Successfully scraped ${formattedResults.length} items`);
        
        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        addAlert('info', response?.message || 'No data found for the provided selector');
      }
    } catch (error) {
      addAlert('error', 'An unexpected error occurred');
      console.error('Scraping error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchData();
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="tw-h-5 tw-w-5" />;
      case 'success': return <CheckCircle className="tw-h-5 tw-w-5" />;
      case 'info': return <AlertCircle className="tw-h-5 tw-w-5" />;
    }
  };

  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'error': return 'tw-bg-red-50 tw-border-red-300 tw-text-red-800';
      case 'success': return 'tw-bg-verdigris/10 tw-border-verdigris tw-text-verdigris';
      case 'info': return 'tw-bg-yinmn-blue/10 tw-border-yinmn-blue tw-text-yinmn-blue';
    }
  };

  const filteredResults = results.filter(result =>
    result.text.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const resultVariants = [
    'tw-bg-gradient-to-br tw-from-oxford-blue/5 tw-to-space-cadet/10 tw-border-oxford-blue/20',
    'tw-bg-gradient-to-br tw-from-space-cadet/5 tw-to-yinmn-blue/10 tw-border-space-cadet/20',
    'tw-bg-gradient-to-br tw-from-yinmn-blue/5 tw-to-verdigris/10 tw-border-yinmn-blue/20',
    'tw-bg-gradient-to-br tw-from-verdigris/5 tw-to-oxford-blue/10 tw-border-verdigris/20',
  ];

  const selectorSuggestions = [
    { label: 'All headings', value: 'h1, h2, h3, h4, h5, h6' },
    { label: 'All paragraphs', value: 'p' },
    { label: 'All links', value: 'a' },
    { label: 'Article titles', value: '.title, .headline, h1' },
    { label: 'Navigation items', value: 'nav a, .nav-item' },
    { label: 'Content blocks', value: '.content, .post, article' },
  ];

  return (
    <div className="tw-min-h-screen tw-bg-oxford-blue tw-p-4">
      <div className="tw-max-w-7xl tw-mx-auto">
        {/* Header with Logout */}
        <div className="tw-flex tw-justify-between tw-items-center tw-mb-8">
          <div className="tw-flex tw-items-center">
            <div className="tw-bg-verdigris tw-p-3 tw-rounded-xl tw-shadow-lg tw-mr-4">
              <Database className="tw-h-8 tw-w-8 tw-text-white" />
            </div>
            <div>
              <h1 className="tw-text-3xl tw-font-bold tw-text-white">
                Web Scraper Dashboard
              </h1>
              <p className="tw-text-white/80 tw-mt-1">
                Extract content from any website using CSS selectors
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="tw-flex tw-items-center tw-space-x-2 tw-bg-white/10 hover:tw-bg-white/20 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-transition-colors tw-duration-200 tw-border tw-border-white/20 hover:tw-border-white/40"
          >
            <LogOut className="tw-h-4 tw-w-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Floating Alerts */}
        {alerts.length > 0 && (
          <div className="tw-fixed tw-top-4 tw-right-4 tw-z-50 tw-space-y-3 tw-max-w-sm">
            {alerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`tw-flex tw-items-center tw-justify-between tw-p-4 tw-rounded-xl tw-border-2 tw-shadow-lg tw-backdrop-blur-sm ${getAlertStyles(alert.type)} tw-animate-in tw-slide-in-from-right tw-duration-300`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="tw-flex tw-items-center tw-space-x-3">
                  <div className="tw-animate-pulse">
                    {getAlertIcon(alert.type)}
                  </div>
                  <span className="tw-font-medium tw-text-sm">{alert.message}</span>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="tw-text-current/70 hover:tw-text-current tw-transition-all tw-duration-200 tw-p-1 tw-rounded-full hover:tw-bg-white/20 hover:tw-scale-110"
                >
                  <X className="tw-h-4 tw-w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Layout */}
        <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-8">
          {/* Form Section */}
          <div className="tw-w-full lg:tw-w-2/5">
            <div className="tw-bg-white tw-rounded-xl tw-shadow-lg tw-border tw-border-white/20 tw-p-6">
              <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
                <div className="tw-flex tw-items-center">
                  <div className="tw-bg-verdigris tw-p-2 tw-rounded-lg tw-mr-3">
                    <Globe className="tw-h-5 tw-w-5 tw-text-white" />
                  </div>
                  <h2 className="tw-text-xl tw-font-semibold tw-text-oxford-blue">Scraping Configuration</h2>
                </div>
                <div className="tw-flex tw-space-x-2">
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="tw-p-2 tw-rounded-lg tw-bg-yinmn-blue/10 hover:tw-bg-yinmn-blue/20 tw-text-yinmn-blue tw-transition-colors tw-duration-200"
                    title="Show selector suggestions"
                  >
                    <BookOpen className="tw-h-4 tw-w-4" />
                  </button>
                  {results.length > 0 && (
                    <button
                      onClick={refreshData}
                      className="tw-p-2 tw-rounded-lg tw-bg-verdigris/10 hover:tw-bg-verdigris/20 tw-text-verdigris tw-transition-colors tw-duration-200"
                      title="Refresh data"
                    >
                      <RefreshCw className="tw-h-4 tw-w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Selector Suggestions */}
              {showSuggestions && (
                <div className="tw-mb-6 tw-p-4 tw-bg-yinmn-blue/5 tw-rounded-xl tw-border tw-border-yinmn-blue/20">
                  <h3 className="tw-text-sm tw-font-semibold tw-text-space-cadet tw-mb-3 tw-flex tw-items-center">
                    <Sparkles className="tw-h-4 tw-w-4 tw-mr-2 tw-text-verdigris" />
                    Quick Selectors
                  </h3>
                  <div className="tw-grid tw-grid-cols-1 tw-gap-2">
                    {selectorSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelector(suggestion.value);
                          setShowSuggestions(false);
                        }}
                        className="tw-text-left tw-p-2 tw-rounded-lg tw-bg-white/50 hover:tw-bg-white/80 tw-text-sm tw-text-oxford-blue tw-transition-colors tw-duration-200 tw-border tw-border-transparent hover:tw-border-verdigris/30"
                      >
                        <div className="tw-font-medium">{suggestion.label}</div>
                        <div className="tw-text-xs tw-text-yinmn-blue tw-font-mono">{suggestion.value}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="tw-space-y-6">
                <div>
                  <label htmlFor="url" className="tw-block tw-text-sm tw-font-semibold tw-text-space-cadet tw-mb-3">
                    Target URL
                  </label>
                  <div className="tw-relative tw-group">
                    <Globe className="tw-absolute tw-left-4 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-h-5 tw-w-5 tw-text-yinmn-blue tw-transition-colors tw-duration-200 group-focus-within:tw-text-verdigris" />
                    <input
                      type="url"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="tw-w-full tw-pl-12 tw-pr-4 tw-py-3 tw-border-2 tw-border-yinmn-blue/20 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-verdigris/20 focus:tw-border-verdigris tw-transition-colors tw-duration-200 tw-bg-white tw-text-oxford-blue placeholder:tw-text-yinmn-blue/60 hover:tw-border-yinmn-blue/40"
                      required
                    />
                    {url && (
                      <button
                        type="button"
                        onClick={() => window.open(url, '_blank')}
                        className="tw-absolute tw-right-4 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-p-1 tw-rounded-full tw-bg-verdigris/10 hover:tw-bg-verdigris/20 tw-text-verdigris tw-transition-colors tw-duration-200"
                        title="Open URL in new tab"
                      >
                        <ExternalLink className="tw-h-4 tw-w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="selector" className="tw-block tw-text-sm tw-font-semibold tw-text-space-cadet tw-mb-3">
                    CSS Selector
                  </label>
                  <div className="tw-relative tw-group">
                    <Code className="tw-absolute tw-left-4 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-h-5 tw-w-5 tw-text-yinmn-blue tw-transition-colors tw-duration-200 group-focus-within:tw-text-verdigris" />
                    <input
                      type="text"
                      id="selector"
                      value={selector}
                      onChange={(e) => setSelector(e.target.value)}
                      placeholder="h1, .title, #content p"
                      className="tw-w-full tw-pl-12 tw-pr-4 tw-py-3 tw-border-2 tw-border-yinmn-blue/20 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-verdigris/20 focus:tw-border-verdigris tw-transition-colors tw-duration-200 tw-bg-white tw-text-oxford-blue placeholder:tw-text-yinmn-blue/60 hover:tw-border-yinmn-blue/40"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="tw-w-full tw-bg-verdigris hover:tw-bg-verdigris/90 disabled:tw-bg-yinmn-blue/50 tw-text-white tw-font-semibold tw-py-3 tw-px-6 tw-rounded-lg tw-transition-colors tw-duration-200 tw-flex tw-items-center tw-justify-center tw-space-x-3 tw-shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="tw-h-5 tw-w-5 tw-animate-spin" />
                      <span>Fetching Data...</span>
                    </>
                  ) : (
                    <>
                      <Search className="tw-h-5 tw-w-5" />
                      <span>Fetch Data</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="tw-w-full lg:tw-w-3/5" ref={resultsRef}>
            <div className="tw-bg-white tw-rounded-xl tw-shadow-lg tw-border tw-border-white/20 tw-p-6">
              <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
                <div className="tw-flex tw-items-center">
                  <div className="tw-bg-yinmn-blue tw-p-2 tw-rounded-lg tw-mr-3">
                    <Search className="tw-h-5 tw-w-5 tw-text-white" />
                  </div>
                  <h2 className="tw-text-xl tw-font-semibold tw-text-oxford-blue">
                    Scraped Results
                  </h2>
                </div>
                <div className="tw-flex tw-items-center tw-space-x-3">
                  {results.length > 0 && (
                    <>
                      <div className="tw-bg-verdigris tw-text-white tw-px-4 tw-py-2 tw-rounded-full tw-text-sm tw-font-semibold tw-shadow-lg">
                        {filteredResults.length} items
                      </div>
                      <button
                        onClick={clearResults}
                        className="tw-p-2 tw-rounded-lg tw-bg-red-100 hover:tw-bg-red-200 tw-text-red-600 tw-transition-colors tw-duration-200"
                        title="Clear results"
                      >
                        <X className="tw-h-4 tw-w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Search Filter */}
              {results.length > 0 && (
                <div className="tw-mb-6">
                  <div className="tw-relative">
                    <Search className="tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-h-4 tw-w-4 tw-text-yinmn-blue" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Filter results..."
                      className="tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-border tw-border-yinmn-blue/20 tw-rounded-lg focus:tw-ring-2 focus:tw-ring-verdigris/20 focus:tw-border-verdigris tw-transition-all tw-duration-200 tw-bg-white/50 tw-text-oxford-blue placeholder:tw-text-yinmn-blue/60"
                    />
                  </div>
                </div>
              )}
              
              <div className="tw-max-h-96 tw-overflow-y-auto tw-space-y-4 tw-pr-2" key={animationKey}>
                {filteredResults.length === 0 && results.length === 0 ? (
                  <div className="tw-text-center tw-py-16">
                    <div className="tw-bg-yinmn-blue/20 tw-p-6 tw-rounded-full tw-w-24 tw-h-24 tw-mx-auto tw-mb-6 tw-flex tw-items-center tw-justify-center">
                      <Search className="tw-h-12 tw-w-12 tw-text-yinmn-blue" />
                    </div>
                    <h3 className="tw-text-lg tw-font-semibold tw-text-space-cadet tw-mb-2">No results yet</h3>
                    <p className="tw-text-yinmn-blue">Enter a URL and CSS selector to get started with scraping</p>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="tw-text-center tw-py-8">
                    <p className="tw-text-yinmn-blue">No results match your filter</p>
                  </div>
                ) : (
                  filteredResults.map((result, index) => (
                    <div
                      key={result.id}
                      className={`tw-rounded-lg tw-p-4 tw-border tw-shadow-sm hover:tw-shadow-md tw-transition-all tw-duration-200 tw-cursor-pointer tw-group ${resultVariants[result.index % resultVariants.length]}`}
                      onMouseEnter={() => setHoveredResult(result.id)}
                      onMouseLeave={() => setHoveredResult(null)}
                      onClick={() => toggleCardExpansion(result.id)}
                    >
                      <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                        <div className="tw-bg-verdigris/20 tw-px-3 tw-py-1 tw-rounded-full tw-flex tw-items-center tw-space-x-2">
                          <span className="tw-text-xs tw-font-bold tw-text-oxford-blue">
                            Item {result.index + 1}
                          </span>
                        </div>
                        <div className="tw-flex tw-space-x-2 tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity tw-duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(result.text, result.id);
                            }}
                            className={`tw-p-2 tw-rounded-lg tw-transition-colors tw-duration-200 ${copiedId === result.id ? 'tw-bg-verdigris tw-text-white' : 'tw-bg-white/50 tw-text-yinmn-blue hover:tw-bg-white/80'}`}
                            title="Copy to clipboard"
                          >
                            <Copy className="tw-h-4 tw-w-4" />
                          </button>
                        </div>
                      </div>
                      <p className={`tw-text-oxford-blue tw-leading-relaxed tw-break-words tw-font-medium ${expandedCards.has(result.id) ? '' : 'tw-line-clamp-3'}`}>
                        {result.text}
                      </p>
                      {result.text.length > 150 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCardExpansion(result.id);
                          }}
                          className="tw-mt-2 tw-text-sm tw-text-verdigris hover:tw-text-yinmn-blue tw-font-medium tw-transition-colors tw-duration-200"
                        >
                          {expandedCards.has(result.id) ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;