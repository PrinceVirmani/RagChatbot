"use client";

export function PeopleSettings() {
    return (
        <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">Status</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-200 dark:bg-zinc-900 dark:divide-zinc-800">
                        {[1, 2, 3].map((i) => (
                            <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-zinc-200 flex-shrink-0" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Jane Doe</div>
                                            <div className="text-sm text-zinc-500 dark:text-zinc-400">jane@example.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-zinc-900 dark:text-zinc-100">Admin</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="w-full rounded-lg border border-dashed border-zinc-300 p-4 text-center text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-400 transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                + Add new team member
            </button>
        </div>
    )
}
