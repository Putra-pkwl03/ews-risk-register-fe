import { HomeIcon, ExclamationTriangleIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, toggle }) {
  return (
    <div
  className={`fixed top-0 left-0 h-full 
    w-40 sm:w-48 md:w-64 
    bg-gray-900 text-white shadow-lg transform 
    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    transition-transform duration-300 z-50`}
>
  <div className="flex items-center justify-between p-4 border-b border-gray-700">
    <h2 className="text-lg font-semibold">Menu</h2>
    <button onClick={toggle} className="text-gray-400 hover:text-white">
      <XMarkIcon className="h-6 w-6" />
    </button>
  </div>

  <ul className="p-4 space-y-3">
    <li className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
      <HomeIcon className="h-5 w-5" />
      <span className="text-sm">Dashboard</span>
    </li>
    <li className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
      <ExclamationTriangleIcon className="h-5 w-5" />
      <span className="text-sm">Identifikasi Risiko</span>
    </li>
    <li className="flex items-center gap-3 hover:bg-gray-800 p-2 rounded cursor-pointer">
      <Cog6ToothIcon className="h-5 w-5" />
      <span className="text-sm">Settings</span>
    </li>
  </ul>
</div>

  );
}
