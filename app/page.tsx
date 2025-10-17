'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Target, TrendingUp, CircleCheck as CheckCircle, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-500/10 dark:from-blue-500/5 dark:via-transparent dark:to-purple-500/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/20 bg-white/80 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm backdrop-blur dark:border-blue-500/40 dark:bg-gray-900/60 dark:text-blue-300">
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                  Version 2.0
                </span>
                <span>Smarter &amp; Faster</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Power up your workflow with ease.
              </h1>

              <p className="text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
                Manage tasks, finances, and growth — all in one powerful dashboard tailored for modern teams.
                Stay ahead with insights that adapt as fast as you do.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link href="/tracker">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300">
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/activity">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-200 bg-white/80 px-8 py-4 text-lg font-semibold text-slate-900 transition-colors duration-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-gray-900/80 dark:text-white dark:hover:bg-gray-800"
                  >
                    Talk to sales
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-sm font-semibold text-slate-400 dark:text-slate-500">
                <span className="uppercase tracking-[0.3em]">Coo</span>
                <span className="uppercase tracking-[0.3em]">Logopsum</span>
                <span className="uppercase tracking-[0.3em]">Matrix</span>
                <span className="uppercase tracking-[0.3em]">Logoispsum</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-16 -left-12 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-indigo-400/20 blur-3xl"></div>

              <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-2xl backdrop-blur-sm dark:border-slate-800 dark:bg-gray-900/70">
                <div className="flex items-center justify-between pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Dashboard</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Welcome Back, Kadirov!</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Products</span>
                    <span>Customers</span>
                    <span>Revenue</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-blue-50 p-6 shadow-sm dark:bg-blue-500/10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-300">
                      Total Sales
                    </p>
                    <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">$156,654</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-blue-500 dark:text-blue-300">
                      <TrendingUp className="h-4 w-4" />
                      <span>+24% vs last week</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-6 shadow-sm dark:bg-emerald-500/10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
                      Total Revenue
                    </p>
                    <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">$541,937</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-500 dark:text-emerald-300">
                      <ArrowRight className="h-4 w-4" />
                      <span>+19% vs last week</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-6 shadow-sm dark:border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Total Product Sales
                    </p>
                    <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">43,476</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-500 dark:text-emerald-300">
                      <CheckCircle className="h-4 w-4" />
                      <span>Top previous week</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-6 shadow-sm dark:border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Total Customers
                    </p>
                    <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">2,987</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-rose-500 dark:text-rose-400">
                      <ArrowRight className="h-4 w-4 rotate-180" />
                      <span>-3% vs last week</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-6 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Sales Trends</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">July – December, Growth +26%</p>
                    </div>
                    <div className="flex gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600 dark:bg-blue-500/10 dark:text-blue-200">Dashboard</span>
                      <span>Performance</span>
                    </div>
                  </div>
                  <div className="mt-6 h-32 rounded-xl bg-gradient-to-r from-blue-100 via-white to-indigo-100 dark:from-blue-500/10 dark:via-transparent dark:to-indigo-500/10"></div>
                </div>
              </div>

              <div className="absolute -bottom-10 left-6 w-52 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-gray-900/90">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Sales by Country</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>USA</span>
                    <span>$120,000</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Europe</span>
                    <span>$87,450</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Asia</span>
                    <span>$67,210</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make nutrition tracking effortless and insightful
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Smart Food Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Intuitive table-based interface with quick entry modals. Track calories and protein with just a few clicks.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Visual Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Beautiful charts and graphs to visualize your progress. Switch between calories and protein views instantly.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Goal Achievement
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Set personal targets and track your success rate. See at a glance how often you meet your nutrition goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Free to Use
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                &lt;1s
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Quick Entry
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                24/7
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Access Anywhere
              </div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                ∞
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium">
                Food Items
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-500 dark:to-green-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your nutrition habits?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already started their journey to better health with our beautiful, intuitive nutrition tracker.
          </p>
          <Link href="/tracker">
            <Button size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}