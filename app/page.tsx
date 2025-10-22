'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Target, TrendingUp, CircleCheck as CheckCircle, Sparkles, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
      <div className='bg-[#f0f0f0]' >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#f0f0f0] dark:from-blue-500/5 dark:via-transparent dark:to-purple-500/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="space-y-8">

              <div className="bg-white/40 backdrop-blur-xl p-1 w-fit rounded-3xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/90 pl-1 pr-3 py-1 text-sm font-medium text-blue-600 shadow-sm backdrop-blur dark:border-blue-500/40 dark:bg-gray-900/60 dark:text-blue-300">
                <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold tracking-wide text-white">
                  Version 2.0
                </span>
                <span className='text-black'>Smarter &amp; Faster</span>
              </div>
              </div>


              <h1 className="flex flex-col gap-3 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white">
                <span className="flex flex-wrap items-center gap-4">
                  <span>Power</span>
                  <span className="bg-white shadow-lg rotate-12 shadow-blue-300 h-fit w-fit p-1 rounded-2xl flex items-center justify-center">
                  <span className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#1b44fe]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                        focusable="false"
                        fill="currentColor"
                        style={{
                          userSelect: "none",
                          width: "80%",
                          height: "80%",
                          display: "inline-block",
                          flexShrink: 0,
                          color: "var(--token-48f4cf02-1409-476f-bfe9-36729a835e0c, rgb(255, 255, 255))",
                        }}
                      >
                        <g color="currentColor" weight="fill">
                          <path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z" />
                        </g>
                      </svg>

                  </span>
                  </span>
                  <span>up your</span>
                </span>
                <span className="text-balance">workflow with ease.</span>
              </h1>

              <p className="text-lg sm:text-lg font-medium leading-relaxed text-gray-500 dark:text-slate-300 max-w-xl">
                Manage tasks, finances, and growth — all in one powerful dashboard tailored for modern teams.
                Stay ahead with insights that adapt as fast as you do.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link href="/tracker">
                  <Button  className="bg-[#1b44fe] rounded-xl border-2 border-blue-400/80 shadow-md shadow-blue-400/80   text-white px-4 py-1 text-lg font-semibold  transition-all duration-300
                  
                  hover:text-[#1b44fe] hover:bg-white ">
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/activity"
                   className='flex items-center  text-lg font-semibold  transition-colors duration-300  dark:border-slate-700 dark:bg-gray-900/80 dark:text-white dark:hover:bg-gray-800
                              border-2 border-blue-400/80 shadow-md shadow-blue-400/80 rounded-xl px-8 py-1 text-[#1b44fe] hover:text-white hover:bg-[#1b44fe]
                   '
                >
                  Activiy 
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>

              
            </div>

            <div className="relative">
              <div className="absolute -top-16 -left-12 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-indigo-400/20 blur-3xl"></div>

              <div className="relative overflow-hidden rounded-3xl border-8 border-white bg-[#f0f0f0] p-2  dark:border-slate-800 dark:bg-gray-900/70">
                <div className="flex items-center bg-white justify-between 
                                rounded-3xl p-4 mb-6
                ">
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
                  <div className="rounded-2xl bg-white p-6 shadow-sm dark:border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Total Product Sales
                    </p>
                    <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">43,476</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-emerald-500 dark:text-emerald-300">
                      <CheckCircle className="h-4 w-4" />
                      <span>Top previous week</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-6 shadow-sm dark:border-slate-800">
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

                <div className="mt-8 rounded-2xl bg-white border border-dashed border-slate-200 p-6 dark:border-slate-700">
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
                  <div className="flex items-center justify_between text-slate-600 dark:text-slate-300">
                    <span>USA</span>
                    <span>$120,000</span>
                  </div>
                  <div className="flex items-center justify_between text-slate-600 dark:text-slate-300">
                    <span>Europe</span>
                    <span>$87,450</span>
                  </div>
                  <div className="flex items-center justify_between text-slate-600 dark:text-slate-300">
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
      <div className="py-20  dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center  text-center mb-16">
            
              <div className="bg-white/40 backdrop-blur-xl p-1 mb-4 w-fit rounded-3xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/90 pl-1 pr-3 py-1 text-sm font-medium text-blue-600 shadow-sm backdrop-blur dark:border-blue-500/40 dark:bg-gray-900/60 dark:text-blue-300">
                <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold tracking-wide text-white">
                  Version 2.0
                </span>
                <span className='text-black'>Smarter &amp; Faster</span>
              </div>
              </div>

            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-loose dark:text-white mb-4">
              Everything you need <br/> to succeed
            </h2>
            <p className="text-lg font-medium px-20  text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make nutrition tracking effortless and insightful
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/50 backdrop-blur-xl p-1.5 rounded-[18px]">
            <div className="group p-8 rounded-2xl bg-white dark:from-blue-900/20 dark:to-blue-800/20  dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="mb-6">
                <div className="bg-white shadow-lg rotate-12 shadow-blue-300 h-fit w-fit p-1 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-blue-500">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Smart Food Tracking
              </h3>
              <p className="text-gray-500/80 font-medium dark:text-gray-300 leading-relaxed">
                Intuitive table-based interface with quick entry modals. Track calories and protein with just a few clicks.
              </p>
            </div>
            </div>

            <div className="bg-white/50 backdrop-blur-xl p-1.5 rounded-[18px]">
              <div className="group p-8 rounded-2xl bg-white dark:from-blue-900/20 dark:to-blue-800/20  dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6">
                  <div className="bg-white shadow-lg rotate-12 shadow-green-300 h-fit w-fit p-1 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-green-500">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Visual Insights
                </h3>
                <p className="text-gray-500/80 font-medium dark:text-gray-300 leading-relaxed">
                  Beautiful charts and graphs to visualize your progress. Switch between calories and protein views instantly.
                </p>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-xl p-1.5 rounded-[18px]">
              <div className="group p-8 rounded-2xl bg-white dark:from-blue-900/20 dark:to-blue-800/20  dark:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="mb-6">
                  <div className="bg-white shadow-lg rotate-12 shadow-purple-300 h-fit w-fit p-1 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-purple-500">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Goal Achievement
                </h3>
                <p className="text-gray-500/80 font-medium dark:text-gray-300 leading-relaxed">
                  Set personal targets and track your success rate. See at a glance how often you meet your nutrition goals.
                </p>
              </div>
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
      <div className="relative py-20 overflow-hidden bg-[#f0f0f0] dark:from-blue-700 dark:via-indigo-700 dark:to-emerald-600">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.4),_transparent_55%)]"></div>
        <div className="absolute inset-y-0 left-1/2 h-[120%] w-[55%] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white/40 backdrop-blur-xl p-1 w-fit rounded-3xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/90 pl-1 pr-3 py-1 text-sm font-medium text-blue-600 shadow-sm backdrop-blur dark:border-blue-500/40 dark:bg-gray-900/60 dark:text-blue-300">
                <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold tracking-wide text-white">
                  Premium
                </span>
                <span className="text-black">Experience</span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl text-black md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            Ready to transform your nutrition habits?
          </h2>
          <p className="text-lg md:text-lg font-semibold text-gray-500/80 mb-10 max-w-2xl mx-auto">
            Join thousands of users embracing a smarter approach to health. Track meals, monitor macros, and celebrate progress with a beautifully intuitive dashboard.
          </p>
          <Link href="/tracker">
            <Button
              size="lg"
              className="bg-[#1b44fe] rounded-xl border-2 border-blue-400/80 shadow-md shadow-blue-400/80 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:text-[#1b44fe] hover:bg-white"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}