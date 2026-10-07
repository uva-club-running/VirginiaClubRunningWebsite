// Each form has its own state. Astro owns the markup; Alpine calls save().
function initialData(collection, operation) {
  if (operation === 'updateResults') return { results: '' };
  const year = String(new Date().getFullYear());
  return {
    Meets: { name: '', date: '', location: '', results: '' },
    Events: { name: '', type: '' },
    Records: { name: '', eventId: '', time: '', category: '', year },
    AllAmericans: { name: '', eventId: '', time: '', place: '', year, semester: '' },
    Philanthropy: { name: '', date: '', partner_org: '', description: '', link: '', flyer_link: '' },
  }[collection];
}

export function createContentForm(collection, operation, request) {
  let pending = null;
  let active = true;
  return {
    data: initialData(collection, operation), id: '', busy: false, error: '', page: '',
    destroy() { active = false; },
    async save() {
      if (this.busy) return;
      this.busy = true;
      this.error = '';
      this.page = '';
      // Snapshot inputs before sending. Retrying unchanged data reuses the ID.
      const payload = JSON.stringify(this.data);
      if (operation === 'create' && pending?.payload !== payload) {
        pending = { payload, id: crypto.randomUUID() };
      }
      try {
        const result = await request(null, {
          operation, collection,
          id: operation === 'create' ? pending.id : this.id,
          data: JSON.parse(payload),
        });
        if (!active) return;
        pending = null;
        this.data = initialData(collection, operation);
        this.id = '';
        this.page = result.page;
        this.$dispatch('content-saved');
      } catch (error) {
        if (active) this.error = error.message;
      } finally {
        if (active) this.busy = false;
      }
    },
  };
}
