import { loadJournalAsync } from 'src/core/journal'
import { getUserDataAsync } from 'src/core/user'
import { loadGraphStatsAsync } from 'src/core/graph'

// Called when the auth flow is finishes, loads user and journal data
export default function loadAppData() {
  return (dispatch, getState) => {
    const { auth } = getState()
    const userId = auth.id

    dispatch(getUserDataAsync(userId))
    dispatch(loadJournalAsync())
    dispatch(loadGraphStatsAsync(userId))
  }
}
