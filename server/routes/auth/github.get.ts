export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        id: String(user.id),
        login: user.login,
        name: user.name || user.login,
        avatar: user.avatar_url,
      },
    })

    return sendRedirect(event, '/')
  },

  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/?error=auth')
  },
})
