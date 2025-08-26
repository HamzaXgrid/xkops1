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

import React, { useState, useEffect, useMemo, memo } from 'react'
import VolumeTable from './VolumeTable'
import './VolumeTable.css'
import './unclaimedVolume.css'

// A React functional component that displays a list of unclaimed volumes and a table of details about them.
const UnclaimedVolumes = memo(() => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch data when component mounts with error handling and loading state
  useEffect(() => {
    const fetchVolumes = async () => {
      try {
        setLoading(true)
        const response = await fetch('/allPersistentVolumes')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        const unclaimedVolumes = data.items?.filter(record => record.status.phase === 'Available') || []
        setRecords(unclaimedVolumes)
        setError(null)
      } catch (err) {
        console.error('Error fetching volumes:', err)
        setError(err.message)
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    fetchVolumes()
  }, [])

  // Memoize the filtered records to avoid unnecessary re-renders
  const memoizedRecords = useMemo(() => records, [records])

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className='header'>XkOps - Unclaimed Volumes</h1>
        <div className='table-container'>
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading volumes...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div>
        <h1 className='header'>XkOps - Unclaimed Volumes</h1>
        <div className='table-container'>
          <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
            Error loading volumes: {error}
          </div>
        </div>
      </div>
    )
  }

  // Renders the component's content, including the header and table of unclaimed volumes.
  return (
    <div>
      <h1 className='header'>XkOps - Unclaimed Volumes</h1>
      <div className='table-container'>
        <VolumeTable records={memoizedRecords} />
      </div>
    </div>
  )
})

UnclaimedVolumes.displayName = 'UnclaimedVolumes'

export default UnclaimedVolumes
