export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user, tokens: _tokens }) {
    // user = GitHub User Objekt
    // tokens = { accessToken, ... }

    // Session setzen:
    await setUserSession(event, {
      user: {
        id: String(user.id), // GitHub User ID
        login: user.login, // Username (z.B. "flo0806")
        name: user.name, // Display Name
        avatar: user.avatar_url, // Profilbild URL
      },
    })

    return sendRedirect(event, '/')
  },

  async onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/?error=auth')
  },
})
