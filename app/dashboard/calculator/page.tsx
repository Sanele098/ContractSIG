"use client"

import { useState } from "react"
import { Search, TrendingUp, Plus, X, Calculator, ExternalLink, Lightbulb } from "lucide-react"
import { useSearchParams } from "next/navigation"
import Loading from "./loading"

interface SearchResult {
  id: string
  source: string
  title: string
  url: string
  price: number | null
  description: string
}

interface PricingItem {
  id: string
  name: string
  marketPrice: number
  quantity: number
  markup: number
  source: string
}

export default function BidCalculator() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [items, setItems] = useState<PricingItem[]>([])
  const [globalMarkup, setGlobalMarkup] = useState(20)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null)

  // Mock search results - simulating Perplexity-style web search
  const mockSearchResults: Record<string, SearchResult[]> = {
    "labor hourly": [
      {
        id: "1",
        source: "Glassdoor",
        title: "Average Construction Labor Hourly Rate 2024",
        url: "https://www.glassdoor.com/salaries/construction-labor",
        price: 75,
        description: "Current market rates for skilled construction labor range from $65-$85 per hour depending on location and experience.",
      },
      {
        id: "2",
        source: "Bureau of Labor Statistics",
        title: "Construction Laborers Occupational Outlook",
        url: "https://www.bls.gov/ooh/construction",
        price: 72,
        description: "Average hourly wage for construction laborers: $72.50 with benefits included.",
      },
      {
        id: "3",
        source: "Indeed Salary",
        title: "Construction Labor Rates by State",
        url: "https://www.indeed.com/career/construction-labor",
        price: 78,
        description: "Regional variations: Northeast $78/hr, Midwest $68/hr, South $65/hr, West $82/hr.",
      },
    ],
    "concrete": [
      {
        id: "4",
        source: "Home Depot",
        title: "Ready-Mix Concrete Pricing",
        url: "https://www.homedepot.com/p/concrete",
        price: 120,
        description: "Ready-mix concrete typically costs $120-$150 per cubic yard depending on mix design and location.",
      },
      {
        id: "5",
        source: "Concrete.org",
        title: "National Concrete Price Index",
        url: "https://www.concrete.org/pricing",
        price: 135,
        description: "Current market index shows premium concrete at $135/yd with delivery included.",
      },
      {
        id: "6",
        source: "Local Supplier Network",
        title: "Regional Concrete Costs",
        url: "https://www.concretesuppliers.com",
        price: 118,
        description: "Bulk orders: 10+ trucks qualify for wholesale pricing starting at $118/yd.",
      },
    ],
    "equipment rental": [
      {
        id: "7",
        source: "United Rentals",
        title: "Daily Equipment Rental Rates",
        url: "https://www.unitedrentals.com/pricing",
        price: 250,
        description: "Daily rental rates: Excavator $250-$350, Crane $300-$400, Scaffolding $100-$150 per day.",
      },
      {
        id: "8",
        source: "Home Depot Rentals",
        title: "Equipment Rental Calculator",
        url: "https://www.homedepot.com/tool-rental",
        price: 245,
        description: "Competitive daily rates with discounts for weekly and monthly rentals.",
      },
    ],
    "materials": [
      {
        id: "9",
        source: "Lowe's",
        title: "Construction Materials Pricing",
        url: "https://www.lowes.com/search",
        price: 150,
        description: "Wide selection of materials with current inventory pricing updated hourly.",
      },
    ],
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    // Simulate API call delay
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase()
      let results: SearchResult[] = []

      // Find matching results
      for (const [key, value] of Object.entries(mockSearchResults)) {
        if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
          results = [...results, ...value]
          break
        }
      }

      // If no exact match, show generic results
      if (results.length === 0) {
        results = [
          {
            id: "generic-1",
            source: "Market Research",
            title: `Pricing for "${query}" - Market Analysis`,
            url: "https://www.pricingdata.com/search",
            price: Math.floor(Math.random() * 400) + 50,
            description: `Current market rates for ${query} based on recent vendor quotes and industry benchmarks.`,
          },
          {
            id: "generic-2",
            source: "Industry Database",
            title: `${query} Cost Estimation 2024`,
            url: "https://www.costestimation.com/items",
            price: Math.floor(Math.random() * 400) + 50,
            description: `Comprehensive pricing data sourced from verified suppliers and contractors in your region.`,
          },
        ]
      }

      setSearchResults(results)
      setIsSearching(false)
    }, 600)
  }

  const handleAddItem = (result: SearchResult) => {
    const newItem: PricingItem = {
      id: result.id,
      name: searchQuery,
      marketPrice: result.price || 100,
      quantity: 1,
      markup: globalMarkup,
      source: result.source,
    }

    setItems([...items, newItem])
    setSearchQuery("")
    setSearchResults([])
    setSelectedItem(null)
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  const handleUpdateMarkup = (id: string, markup: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, markup } : item)))
  }

  // Calculate totals
  const getAverageMarketPrice = () => {
    if (items.length === 0) return 0
    return items.reduce((sum, item) => sum + item.marketPrice * item.quantity, 0) / items.length
  }

  const getTotalCost = () => {
    return items.reduce((sum, item) => sum + item.marketPrice * item.quantity, 0)
  }

  const getTotalProfit = () => {
    return items.reduce(
      (sum, item) =>
        sum +
        (item.marketPrice * item.quantity * item.markup) / 100,
      0
    )
  }

  const getFinalBid = () => {
    return getTotalCost() + getTotalProfit()
  }

  const getRecommendedPrice = () => {
    // AI recommendation: market price + global markup + competitive buffer
    const baseTotal = getTotalCost()
    const profit = (baseTotal * globalMarkup) / 100
    const competitiveBuffer = baseTotal * 0.05 // 5% buffer for competitiveness
    return Math.round((baseTotal + profit + competitiveBuffer) * 100) / 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Bid Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Search for items, view market prices from verified sources, and calculate competitive bids
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Search and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for materials, labor, equipment... (e.g., concrete, labor hourly)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3 bg-white border border-border rounded-lg p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase">Web Results</p>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleAddItem(result)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-secondary">{result.source}</span>
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                          {result.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{result.description}</p>
                      </div>
                      {result.price && (
                        <div className="flex-shrink-0 text-right">
                          <p className="text-base font-semibold text-secondary">
                            ${result.price}
                          </p>
                          <p className="text-xs text-muted-foreground">per unit</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button className="text-xs px-3 py-1 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors">
                        Add to Bid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Recommendation */}
            {items.length > 0 && (
              <div className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">AI Recommendation</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Based on {items.length} item{items.length !== 1 ? "s" : ""} and current market prices, we recommend a bid of
                    </p>
                    <p className="text-xl font-semibold text-secondary">
                      ${getRecommendedPrice().toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      This includes a {globalMarkup}% markup plus a 5% competitive buffer to win while maintaining profitability.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Items Grid */}
            {items.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase">Added Items</p>
                {items.map((item) => (
                  <div key={item.id} className="p-4 bg-white border border-border rounded-lg">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-foreground mb-1">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">{item.source}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-border rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-secondary/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Unit Price</label>
                        <p className="text-sm font-medium text-foreground">${item.marketPrice}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Markup %</label>
                        <input
                          type="number"
                          min="0"
                          value={item.markup}
                          onChange={(e) => handleUpdateMarkup(item.id, parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-border rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-secondary/50"
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                      <span className="text-muted-foreground">Line Total:</span>
                      <span className="font-medium text-foreground">
                        ${(item.marketPrice * item.quantity * (1 + item.markup / 100)).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {/* Global Markup Control */}
              <div className="p-4 bg-white border border-border rounded-lg">
                <label className="text-sm font-medium text-foreground mb-3 block">Global Markup %</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={globalMarkup}
                    onChange={(e) => setGlobalMarkup(Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-secondary/50"
                  />
                  <span className="py-2 px-3 text-sm font-medium text-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Default: 20% (applies to new items)</p>
              </div>

              {/* Bid Summary */}
              {items.length > 0 && (
                <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-50 border border-border rounded-lg space-y-3">
                  <p className="text-sm font-semibold text-foreground">Bid Summary</p>

                  <div className="space-y-2 py-3 border-y border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Cost:</span>
                      <span className="font-medium text-foreground">
                        ${getTotalCost().toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Profit:</span>
                      <span className="font-medium text-secondary">
                        ${getTotalProfit().toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="font-semibold text-foreground">Final Bid:</span>
                    <span className="font-bold text-secondary text-lg">
                      ${getFinalBid().toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button className="w-full mt-3 px-4 py-2 bg-secondary text-white text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors">
                    Save & Export Bid
                  </button>
                </div>
              )}

              {items.length === 0 && (
                <div className="p-4 bg-white border border-border rounded-lg text-center">
                  <Calculator className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">Search for items to build your bid</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


