import Link from "next/link"

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-6">📚</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          StudentReg - Курсовой проект
        </h1>
        <p className="text-gray-600 mb-8">
          Онлайн-система регистрации студентов. Полноценный веб-сайт на HTML, CSS
          и JavaScript.
        </p>

        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-800">
            Структура проекта:
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-blue-600">index.html</span>
              <p className="text-gray-500 text-xs mt-1">Главная страница</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-blue-600">about.html</span>
              <p className="text-gray-500 text-xs mt-1">О нас</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-blue-600">services.html</span>
              <p className="text-gray-500 text-xs mt-1">Услуги</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-blue-600">contacts.html</span>
              <p className="text-gray-500 text-xs mt-1">Контакты</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-green-600">style.css</span>
              <p className="text-gray-500 text-xs mt-1">Все стили</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-yellow-600">script.js</span>
              <p className="text-gray-500 text-xs mt-1">JavaScript</p>
            </div>
          </div>
        </div>

        <Link
          href="/student-registration/index.html"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Открыть сайт →
        </Link>

        <p className="text-gray-400 text-sm mt-6">
          Все файлы находятся в папке{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">
            public/student-registration/
          </code>
        </p>
      </div>
    </div>
  )
}
