import axios from 'axios'

export const handlePortalClick = async (
  stateHandler: (state: 'ready' | 'loading' | 'error') => void
) => {
  stateHandler('loading')
  try {
    const response = await axios('/api/portal', {
      method: 'GET',
    })
    const { url } = response.data as { url: string }
    window.location.assign(url)
  } catch (error) {
    stateHandler('error')
  }
}
