'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Target, TrendingUp, CircleCheck as CheckCircle, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10 dark:from-blue-400/5 dark:to-green-400/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Track Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                {" "}Nutrition{" "}
              </span>
              Journey
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most beautiful and intuitive way to track your daily nutrition. 
              Monitor calories, protein, and achieve your health goals with stunning visualizations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tracker">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Start Tracking
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/activity">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                  View Demo
                </Button>
              </Link>
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