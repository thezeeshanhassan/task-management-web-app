import { Provider } from "react-redux"
import { store } from "./redux/store"
import TaskBoard from "./components/TaskBoard"
import Header from "./components/Header"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="container px-4 py-8 mx-auto">
            <TaskBoard />
          </main>
        </div>
      </ThemeProvider>
    </Provider>
  )
}

export default App
