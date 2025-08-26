// Copyright (c) 2023, Xgrid Inc, https://xgrid.co

// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { lazy, Suspense } from 'react'
import { Navigation } from './components'
import { Route, Routes } from 'react-router-dom'

// Lazy load components for better performance
const Home = lazy(() => import('./components/Home'))
const UnclaimedVolumes = lazy(() => import('./components/UnclaimedVolumes'))

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    fontSize: '18px',
    color: '#666'
  }}>
    Loading...
  </div>
)

// App function which tells how to render the application like Navigation and Routes
function App () {
  return (
    <>
      <Navigation />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/unclaimed-volumes' element={<UnclaimedVolumes />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
