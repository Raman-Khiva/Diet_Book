'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {Chrome as Home, Activity, Target, Moon, Sun, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuthed, selectUser } from '@/lib/redux/slices/authSlice';

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isAuthed = useSelector(selectIsAuthed); 
  const user = useSelector(selectUser); 
  const dispatch = useDispatch();
  const initials =
    typeof user?.displayName === 'string' && user.displayName.trim().length > 0
      ? user.displayName
          .trim()
          .split(/\s+/)
          .map((part: string) => part[0]?.toUpperCase())
          .join('')
          .slice(0, 2)
      : user?.email?.[0]?.toUpperCase() ?? undefined;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error while signing out:', error);
    }finally{
      dispatch(logout())
    }
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/activity', label: 'Activity', icon: Activity },
    { href: '/tracker', label: 'Tracker', icon: Target },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              DietTracker
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            {isAuthed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      {user.photoURL ? (
                        <AvatarImage
                          src={user.photoURL}
                          alt={user.displayName ?? user.email ?? 'User'}
                        />
                      ) : (
                        <AvatarFallback>
                          {initials ?? <UserIcon className="h-4 w-4" />}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">
                        {user.displayName ?? 'DietTracker user'}
                      </span>
                      {user.email ? (
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      ) : null}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" asChild>
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex justify-center pb-4">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}