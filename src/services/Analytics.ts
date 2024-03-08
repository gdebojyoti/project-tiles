abstract class Analytics {
  public static send (event: string): void
  public static send (event: string, data: any): void
  
  public static send (event: string, data?: any): void {
    switch (event) {
      case 'START_GAME':
        this.sendEvent('start_game')
        break
      case 'SHOW_TUTORIAL':
        this.sendEvent('show_tutorial', {
          screen_name: 'home'
        })
        break
      case 'LEVEL_COMPLETE':
        this.sendEvent('level_complete', data)
        break
      case 'ALL_LEVELS_COMPLETE':
        this.sendEvent('all_levels_complete')
        break
    }
  }

  private static sendEvent (event: string): void
  private static sendEvent (event: string, data: any): void

  private static sendEvent (event: string, data?: any): void {
    // @ts-ignore
    window.gtag('event', event, {
      ...data,
      Environment: window.location.hostname === 'tiles.debojyotighosh.com' ? 'prod' : 'dev'
    })
  }
}

export default Analytics
