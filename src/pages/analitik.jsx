import React from "react";

function hero () {
    return (
        <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            {!sidebarVisible && (
              <button onClick={() => setSidebarVisible(true)} aria-label="Show Sidebar" className="p-2 text-gray-600">
                <Menu size={20} />
              </button>
            )}
            <span className="ml-2 font-semibold text-lg">Desaverse</span>
          </div>
          <button onClick={() => setSidebarVisible(v => !v)} aria-label="Toggle Sidebar" className="p-2 text-gray-600 md:hidden">
            {sidebarVisible ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>
        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Konten Utama</h1>
          <p>Ini area konten contoh. Warna tema tidak diubah.</p>
        </main>
      </div>
    )
}

export default hero