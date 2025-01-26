import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Blogs from './components/Blogs'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import CreateBlogs from './components/CreateBlogs'

const router = createBrowserRouter([
  {
    path: '/',
    element : <Blogs/>
  },
  {
    path: '/signup',
    element : <SignUp/>
  },
  {
    path: '/signin',
    element : <SignIn/>
  },
  {
    path: '/create-blog',
    element : <CreateBlogs/>
  },
  {
    path: '*',
    element: <h1>Page Not Found</h1>
  },
])

const App = () => {
  return (
    <RouterProvider router={router}>

    </RouterProvider>
  )
}

export default App