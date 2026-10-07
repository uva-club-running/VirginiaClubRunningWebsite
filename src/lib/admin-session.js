// Dependencies are supplied by admin-alpine.js so these flows can be tested
// without signing in to Firebase or changing production data.
export function createAdminSession({ observeAuth, signIn, signOut, request }) {
  let generation = 0;
  let optionRequest = 0;
  let unsubscribe;
  return {
    loading: true, authorized: false, userEmail: '', sessionError: '',
    email: '', password: '', loginBusy: false, loginError: '',
    tab: 'Meets', events: [], meets: [], optionsLoading: false, readError: '',
    init() {
      unsubscribe = observeAuth(async user => {
        const current = ++generation;
        ++optionRequest;
        this.authorized = false;
        this.userEmail = '';
        this.events = [];
        this.meets = [];
        this.readError = '';
        this.optionsLoading = false;
        this.sessionError = '';
        this.loading = !!user;
        if (!user) return;
        try {
          await request();
          if (current !== generation) return;
          this.userEmail = user.email || '';
          this.tab = 'Meets';
          this.authorized = true;
          this.password = '';
          await this.loadOptions();
        } catch (error) {
          if (current === generation) this.sessionError = error.message;
        } finally {
          if (current === generation) this.loading = false;
        }
      });
    },
    destroy() { generation++; optionRequest++; unsubscribe?.(); },
    async login() {
      if (this.loginBusy) return;
      this.loginBusy = true;
      this.loginError = '';
      try { await signIn(this.email.trim(), this.password); }
      catch { this.loginError = 'Unable to sign in. Check your email and password and try again.'; }
      finally { this.password = ''; this.loginBusy = false; }
    },
    async logout() {
      try { await signOut(); }
      catch { this.sessionError = 'Unable to sign out. Please try again.'; }
    },
    async loadOptions() {
      if (!this.authorized) return;
      const current = ++optionRequest;
      this.optionsLoading = true;
      this.readError = '';
      try {
        const [events, meets] = await Promise.all([request('Events'), request('Meets')]);
        if (current !== optionRequest) return;
        this.events = events.documents.sort((a, b) => a.name.localeCompare(b.name));
        this.meets = meets.documents.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      } catch (error) {
        if (current === optionRequest) this.readError = error.message;
      } finally {
        if (current === optionRequest) this.optionsLoading = false;
      }
    },
  };
}
