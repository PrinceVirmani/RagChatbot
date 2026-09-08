"use client";

export function ProfileSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center text-xl font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          JB
        </div>
        <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-700">
          Change avatar
        </button>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Full Name</label>
          <input 
            type="text" 
            defaultValue="James Brown"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 placeholder-zinc-400"
          />
        </div>
        
        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Email Address</label>
          <input 
            type="email" 
            defaultValue="james@alignui.com"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 placeholder-zinc-400"
          />
        </div>

        <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Bio</label>
            <textarea 
                rows={4}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 placeholder-zinc-400"
                placeholder="Write a short bio..."
            />
        </div>
      </div>
      
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
              Save Changes
          </button>
      </div>
    </div>
  );
}
